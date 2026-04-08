/* ═══════════════════════════════════════════════════════
   Blog System — JSON-powered blog renderer
   ═══════════════════════════════════════════════════════ */

(function() {
  var POSTS_PER_PAGE = 6;

  // ─── Determine base path for data/posts.json ───
  var basePath = '';
  if (window.location.pathname.includes('/blog/')) {
    basePath = '../';
  }

  // ─── Category colors ───
  var categoryColors = {
    'Characters': '#7b2d26',
    'Fun Facts': '#2d5a27',
    'Memes': '#4a2d6b',
    'News': '#1a4a6b'
  };

  // ─── Format date ───
  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // ─── Generate placeholder image color based on post ID ───
  function getPlaceholderGradient(id) {
    var hash = 0;
    for (var i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    var hue1 = Math.abs(hash % 40) + 15; // warm brown/gold range
    var hue2 = Math.abs((hash >> 8) % 40) + 15;
    return 'linear-gradient(135deg, hsl(' + hue1 + ', 40%, 25%), hsl(' + hue2 + ', 50%, 35%))';
  }

  // ─── Render blog card HTML ───
  function renderCard(post, index) {
    var imageStyle = post.image
      ? 'background-image: url(' + post.image + '); background-size: cover; background-position: center;'
      : 'background: ' + getPlaceholderGradient(post.id) + '; display: flex; align-items: center; justify-content: center;';

    var placeholderIcon = post.image ? '' :
      '<svg width="48" height="48" viewBox="0 0 100 100" style="opacity: 0.3; fill: #d4a84a;">' +
        '<polygon points="50,5 5,95 95,95" fill="none" stroke="currentColor" stroke-width="4"/>' +
        '<circle cx="50" cy="62" r="18" fill="none" stroke="currentColor" stroke-width="4"/>' +
        '<line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" stroke-width="4"/>' +
      '</svg>';

    var categoryBg = categoryColors[post.category] || '#3D1110';

    return '<div class="blog-card reveal stagger-' + ((index % 3) + 1) + '">' +
      '<div class="blog-card-image" style="' + imageStyle + '">' +
        placeholderIcon +
        '<span class="blog-card-category" style="background: ' + categoryBg + ';">' + post.category + '</span>' +
      '</div>' +
      '<div class="blog-card-body">' +
        '<p class="blog-card-date">' + formatDate(post.date) + '</p>' +
        '<h3><a href="' + basePath + 'blog/post-template.html?id=' + post.id + '">' + post.title + '</a></h3>' +
        '<p>' + post.excerpt + '</p>' +
        '<a href="' + basePath + 'blog/post-template.html?id=' + post.id + '" class="read-more">' +
          'Read More ' +
          '<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</a>' +
      '</div>' +
    '</div>';
  }

  // ─── Home Page Blog Preview ───
  var blogFullListing = document.getElementById('blogFullListing');
  var blogGrid = document.getElementById('blogGrid');
  if (blogGrid && !blogFullListing) {
    fetch(basePath + 'data/posts.json')
      .then(function(r) { return r.json(); })
      .then(function(posts) {
        // Sort by date descending
        posts.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });

        // Show latest 3
        var html = '';
        var count = Math.min(3, posts.length);
        for (var i = 0; i < count; i++) {
          html += renderCard(posts[i], i);
        }
        blogGrid.innerHTML = html;

        // Trigger scroll reveal for newly added cards
        setTimeout(function() {
          blogGrid.querySelectorAll('.reveal').forEach(function(el) {
            if ('IntersectionObserver' in window) {
              var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                  }
                });
              }, { threshold: 0.1 });
              obs.observe(el);
            } else {
              el.classList.add('visible');
            }
          });
        }, 100);
      })
      .catch(function(err) {
        console.error('Failed to load blog posts:', err);
        blogGrid.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1/-1;">Failed to load posts. Please try again later.</p>';
      });
  }

  // ─── Full Blog Listing Page ───
  if (blogFullListing) {
    var currentPage = 1;
    var currentCategory = 'all';
    var allPosts = [];

    // Get category from URL param
    var urlParams = new URLSearchParams(window.location.search);
    var catParam = urlParams.get('cat');
    if (catParam) {
      currentCategory = catParam;
    }

    fetch(basePath + 'data/posts.json')
      .then(function(r) { return r.json(); })
      .then(function(posts) {
        allPosts = posts.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
        renderBlogPage();
        setupFilters();
      })
      .catch(function(err) {
        console.error('Failed to load blog posts:', err);
      });

    function getFilteredPosts() {
      if (currentCategory === 'all') return allPosts;
      return allPosts.filter(function(p) {
        return p.category.toLowerCase().replace(/\s+/g, '-') === currentCategory ||
               p.category.toLowerCase() === currentCategory;
      });
    }

    function renderBlogPage() {
      var filtered = getFilteredPosts();
      var startIndex = (currentPage - 1) * POSTS_PER_PAGE;
      var endIndex = startIndex + POSTS_PER_PAGE;
      var pagePosts = filtered.slice(startIndex, endIndex);

      var html = '';
      for (var i = 0; i < pagePosts.length; i++) {
        html += renderCard(pagePosts[i], i);
      }

      blogFullListing.innerHTML = html;

      // Pagination
      var totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
      renderPagination(totalPages);

      // Scroll reveal for cards
      setTimeout(function() {
        blogFullListing.querySelectorAll('.reveal').forEach(function(el) {
          el.classList.add('visible');
        });
      }, 100);
    }

    function renderPagination(totalPages) {
      var paginationEl = document.getElementById('blogPagination');
      if (!paginationEl || totalPages <= 1) {
        if (paginationEl) paginationEl.innerHTML = '';
        return;
      }

      var html = '';
      for (var i = 1; i <= totalPages; i++) {
        var activeClass = i === currentPage ? ' active' : '';
        html += '<button class="pagination-btn' + activeClass + '" data-page="' + i + '">' + i + '</button>';
      }
      paginationEl.innerHTML = html;

      paginationEl.querySelectorAll('.pagination-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          currentPage = parseInt(this.dataset.page);
          renderBlogPage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }

    function setupFilters() {
      var filterBtns = document.querySelectorAll('.blog-filter-btn');
      filterBtns.forEach(function(btn) {
        if (btn.dataset.category === currentCategory) {
          btn.classList.add('active');
        }

        btn.addEventListener('click', function() {
          filterBtns.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          currentCategory = btn.dataset.category;
          currentPage = 1;
          renderBlogPage();
        });
      });
    }
  }

  // ─── Post Detail Page ───
  var postDetail = document.getElementById('postDetail');
  if (postDetail) {
    var params = new URLSearchParams(window.location.search);
    var postId = params.get('id');

    if (!postId) {
      postDetail.innerHTML = '<p style="text-align: center;">Post not found. <a href="../blog.html">Back to blog</a></p>';
      return;
    }

    fetch(basePath + 'data/posts.json')
      .then(function(r) { return r.json(); })
      .then(function(posts) {
        var post = posts.find(function(p) { return p.id === postId; });

        if (!post) {
          postDetail.innerHTML = '<p style="text-align: center;">Post not found. <a href="../blog.html">Back to blog</a></p>';
          return;
        }

        document.title = post.title + ' | The Daily Harry Potter';

        var meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', post.excerpt);

        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postDate').textContent = formatDate(post.date);
        document.getElementById('postCategory').textContent = post.category;
        document.getElementById('postBody').innerHTML = post.content;

        // Related posts
        var related = posts
          .filter(function(p) { return p.id !== postId && p.category === post.category; })
          .slice(0, 3);

        var relatedEl = document.getElementById('relatedPosts');
        if (relatedEl && related.length > 0) {
          var html = '';
          for (var i = 0; i < related.length; i++) {
            html += '<li><a href="post-template.html?id=' + related[i].id + '">' + related[i].title + '</a></li>';
          }
          relatedEl.innerHTML = html;
        }
      })
      .catch(function(err) {
        console.error('Failed to load post:', err);
        postDetail.innerHTML = '<p style="text-align: center;">Error loading post. <a href="../blog.html">Back to blog</a></p>';
      });
  }
})();
