/* Hoopsology data layer.
 *
 * Videos: data/videos.json — refreshed every 2h by .github/workflows/hoopsology-videos.yml.
 * Stories / settings / Locker Room waitlist:
 *   - DEMO mode (no keys in config.js): saved in this browser's localStorage, seeded
 *     from data/news.json. Good for previewing the admin; nothing is shared.
 *   - LIVE mode (HS_CONFIG.supabaseUrl + supabaseAnonKey set): Supabase tables from
 *     supabase/schema.sql. Public reads published stories; only signed-in admins write.
 */
(function () {
  const cfg = window.HS_CONFIG || {};
  const LIVE = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  const base = document.currentScript.src.replace(/assets\/store\.js.*$/, '');
  const K = { stories: 'hs_stories_v1', settings: 'hs_settings_v1', waitlist: 'hs_waitlist_v1', session: 'hs_admin_session' };

  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  const fetchJSON = (p) => fetch(base + p, { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error(p + ' ' + r.status); return r.json(); });

  let sb = null;
  async function client() {
    if (sb) return sb;
    if (!window.supabase) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        s.onload = res; s.onerror = () => rej(new Error('Could not load Supabase'));
        document.head.appendChild(s);
      });
    }
    sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    return sb;
  }
  const must = ({ data, error }) => { if (error) throw error; return data; };

  async function demoStories() {
    let s = ls.get(K.stories, null);
    if (!s) {
      s = (await fetchJSON('data/news.json')).stories;
      ls.set(K.stories, s);
    }
    return s;
  }

  const slugify = (t) => (t || 'story').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'story';

  const byDate = (a, b) => (b.published || '').localeCompare(a.published || '');

  const store = {
    live: LIVE,
    slugify,

    videos: () => fetchJSON('data/videos.json'),

    async stories({ drafts = false } = {}) {
      let all;
      if (LIVE) {
        let q = (await client()).from('stories').select('*').order('published', { ascending: false });
        if (!drafts) q = q.eq('status', 'published');
        all = must(await q);
      } else {
        all = await demoStories();
      }
      const now = new Date().toISOString();
      return all.filter((s) => drafts || (s.status === 'published' && (s.published || '') <= now)).sort(byDate);
    },

    async story(slug) {
      if (LIVE) return must(await (await client()).from('stories').select('*').eq('slug', slug).maybeSingle());
      return (await demoStories()).find((s) => s.slug === slug) || null;
    },

    async saveStory(story) {
      const s = { ...story };
      s.slug = s.slug || slugify(s.title);
      s.updated = new Date().toISOString();
      if (s.status === 'published' && !s.published) s.published = s.updated;
      if (LIVE) {
        const c = await client();
        if (!s.id) s.id = crypto.randomUUID();
        if (s.featured) must(await c.from('stories').update({ featured: false }).neq('id', s.id));
        return must(await c.from('stories').upsert(s).select().single());
      }
      const all = await demoStories();
      if (!s.id) s.id = 'st-' + Date.now().toString(36);
      if (all.some((x) => x.slug === s.slug && x.id !== s.id)) s.slug += '-' + s.id.slice(-4);
      if (s.featured) all.forEach((x) => { x.featured = false; });
      const i = all.findIndex((x) => x.id === s.id);
      if (i >= 0) all[i] = s; else all.unshift(s);
      if (!ls.set(K.stories, all)) throw new Error('Browser storage is full. Use an image URL instead of uploading a large photo.');
      return s;
    },

    async deleteStory(id) {
      if (LIVE) return must(await (await client()).from('stories').delete().eq('id', id));
      ls.set(K.stories, (await demoStories()).filter((s) => s.id !== id));
    },

    async resetDemo() { localStorage.removeItem(K.stories); localStorage.removeItem(K.settings); },

    /* settings: { heroVideo: id|null, hidden: [videoIds] } */
    async settings() {
      if (LIVE) {
        const row = must(await (await client()).from('site_settings').select('value').eq('key', 'site').maybeSingle());
        return { hidden: [], ...(row ? row.value : {}) };
      }
      return { hidden: [], ...ls.get(K.settings, {}) };
    },
    async saveSettings(v) {
      if (LIVE) return must(await (await client()).from('site_settings').upsert({ key: 'site', value: v }));
      ls.set(K.settings, v);
    },

    async joinWaitlist(email) {
      if (LIVE) return must(await (await client()).from('waitlist').insert({ email }));
      const w = ls.get(K.waitlist, []);
      if (!w.some((x) => x.email === email)) w.push({ email, at: new Date().toISOString() });
      ls.set(K.waitlist, w);
    },
    async waitlist() {
      if (LIVE) return must(await (await client()).from('waitlist').select('*').order('created_at', { ascending: false }));
      return ls.get(K.waitlist, []);
    },

    /* admin auth */
    async signIn(email, password) {
      if (LIVE) { must(await (await client()).auth.signInWithPassword({ email, password })); return true; }
      if (password !== (cfg.demoPasscode || 'hoopsology')) throw new Error('Wrong passcode.');
      ls.set(K.session, Date.now() + 12 * 3600e3); // demo session: 12h, shared across tabs so Preview works
      return true;
    },
    async signedIn() {
      if (LIVE) return !!must(await (await client()).auth.getSession()).session;
      return ls.get(K.session, 0) > Date.now();
    },
    async signOut() {
      if (LIVE) return (await client()).auth.signOut();
      try { localStorage.removeItem(K.session); } catch (e) {}
    },
  };

  window.HS = Object.assign(window.HS || {}, { store });
})();
