-- ============================================
-- Auburn Business Network - Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT,
  bio TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  auburn_connection TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create businesses table
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  address TEXT,
  location TEXT DEFAULT 'Auburn, AL',
  website TEXT,
  bio TEXT NOT NULL,
  owner TEXT NOT NULL,
  contact TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'expired')),
  application_id UUID REFERENCES applications(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Policies for applications
-- Anyone can submit an application (INSERT)
CREATE POLICY "Anyone can submit applications"
  ON applications FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated (admin) can view applications
CREATE POLICY "Admin can view applications"
  ON applications FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated (admin) can update applications
CREATE POLICY "Admin can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated (admin) can delete applications
CREATE POLICY "Admin can delete applications"
  ON applications FOR DELETE
  TO authenticated
  USING (true);

-- 4. RLS Policies for businesses
-- Anyone can view active, paid businesses
CREATE POLICY "Public can view active paid businesses"
  ON businesses FOR SELECT
  TO anon
  USING (status = 'active' AND payment_status = 'paid');

-- Authenticated (admin) can view ALL businesses
CREATE POLICY "Admin can view all businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated (admin) can insert businesses
CREATE POLICY "Admin can insert businesses"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated (admin) can update businesses
CREATE POLICY "Admin can update businesses"
  ON businesses FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated (admin) can delete businesses
CREATE POLICY "Admin can delete businesses"
  ON businesses FOR DELETE
  TO authenticated
  USING (true);

-- 5. Seed with sample businesses (all marked as paid so they show up)
INSERT INTO businesses (name, industry, address, location, website, bio, owner, contact, phone, status, payment_status) VALUES
('Tiger Construction Co.', 'Construction', '1425 S College St, Auburn, AL 36830', 'Auburn, AL', 'https://tigerconstructionco.com', 'Full-service general contractor specializing in residential and commercial builds across East Alabama. Auburn grad ''04, building quality structures with integrity since 2008.', 'Matt Henderson', 'info@tigerconstructionco.com', '(334) 555-0102', 'active', 'paid'),
('Plains Wealth Advisors', 'Financial Services', '234 E Magnolia Ave, Auburn, AL 36830', 'Auburn, AL', 'https://plainswealthadvisors.com', 'Comprehensive financial planning and investment management for Auburn families. We believe in the same values on and off the Plains — hard work, loyalty, and doing things right.', 'Sarah Mitchell', 'hello@plainswealthadvisors.com', '(334) 555-0198', 'active', 'paid'),
('War Eagle Brewing', 'Food & Beverage', '160 N College St, Auburn, AL 36830', 'Auburn, AL', 'https://wareaglebrewing.com', 'Craft brewery with an Auburn soul. Serving award-winning beers inspired by our time on the Plains. Stop by on game days for the best watch party in town.', 'Jake Sullivan', 'cheers@wareaglebrewing.com', '(334) 555-0147', 'active', 'paid'),
('Loveliest Village Realty', 'Real Estate', '310 Gay St, Auburn, AL 36830', 'Auburn, AL', 'https://loveliestvillagerealty.com', 'Helping Auburn families find their forever homes since 2010. Whether you''re moving to the Plains or investing in Auburn real estate, we know this community inside and out.', 'Lisa Parker', 'homes@loveliestvillagerealty.com', '(334) 555-0233', 'active', 'paid'),
('Toomer''s Tech Solutions', 'Technology', '550 Opelika Rd, Auburn, AL 36830', 'Auburn, AL', 'https://toomerstech.com', 'IT consulting and managed services for small to mid-size businesses. Auburn engineering grads building tech solutions that actually work. Serving the Auburn-Opelika area and beyond.', 'Chris Dawson', 'support@toomerstech.com', '(334) 555-0311', 'active', 'paid'),
('Plainsman Legal Group', 'Legal', '201 S 9th St, Opelika, AL 36801', 'Auburn, AL', 'https://plainsmanlaw.com', 'Full-service law firm handling business law, estate planning, and real estate closings. Two Auburn Law alumni dedicated to serving the Auburn-Opelika community with trusted legal counsel.', 'David & Rachel Turner', 'info@plainsmanlaw.com', '(334) 555-0409', 'active', 'paid'),
('Samford''s Southern Kitchen', 'Food & Beverage', '128 N College St, Auburn, AL 36830', 'Auburn, AL', 'https://samfordskitchen.com', 'Southern comfort food at its finest. From fried green tomatoes to our famous smoked brisket, every plate is made with love and a whole lot of Auburn pride.', 'Marcus Williams', 'eat@samfordskitchen.com', '(334) 555-0512', 'active', 'paid'),
('Jordan-Hare Hardware', 'Home Services', '802 Columbus Pkwy, Opelika, AL 36801', 'Opelika, AL', 'https://jordanharehardware.com', 'Your locally-owned hardware store serving Lee County. From plumbing supplies to power tools, we''ve got everything you need. Auburn family helping Auburn families.', 'Tom Bradley', 'shop@jordanharehardware.com', '(334) 555-0621', 'active', 'paid'),
('Eagle Eye Photography', 'Creative Services', '415 Opelika Rd, Auburn, AL 36830', 'Auburn, AL', 'https://eagleeyephoto.com', 'Professional photography for weddings, events, and corporate clients. Auburn ''12 grad with a passion for capturing life''s biggest moments right here on the Plains.', 'Amanda Foster', 'book@eagleeyephoto.com', '(334) 555-0733', 'active', 'paid'),
('Aubie''s Auto Shop', 'Automotive', '720 Opelika Rd, Auburn, AL 36830', 'Auburn, AL', 'https://aubiesauto.com', 'Honest, reliable auto repair and maintenance. Serving the Auburn-Opelika community for over 15 years. We treat every customer''s car like it''s our own.', 'Kevin Rhodes', 'service@aubiesauto.com', '(334) 555-0844', 'active', 'paid'),
('The Plains Dental', 'Healthcare', '1550 Opelika Rd Ste 1, Auburn, AL 36830', 'Auburn, AL', 'https://theplainsdentalal.com', 'Modern family dentistry with a gentle touch. Dr. Collins is a proud Auburn grad providing comprehensive dental care to the Auburn family and Lee County community.', 'Dr. Amy Collins', 'smile@theplainsdentalal.com', '(334) 555-0955', 'active', 'paid'),
('Orange & Blue Marketing', 'Marketing', '241 E Magnolia Ave Ste 200, Auburn, AL 36830', 'Auburn, AL', 'https://orangebluemarketing.com', 'Digital marketing agency specializing in social media, SEO, and brand strategy. Auburn grads helping local businesses grow their online presence right here in town.', 'Ryan & Kelly Price', 'grow@orangebluemarketing.com', '(334) 555-1022', 'active', 'paid'),
('Tiger Fitness', 'Health & Fitness', '330 W Magnolia Ave, Auburn, AL 36830', 'Auburn, AL', 'https://tigerfitness.com', 'Boutique gym offering personal training, group classes, and nutrition coaching. Built by Auburn athletes who believe in pushing limits and supporting each other.', 'Derek Mason', 'train@tigerfitness.com', '(334) 555-1133', 'active', 'paid'),
('Heisman Accounting', 'Financial Services', '604 Ave A, Opelika, AL 36801', 'Opelika, AL', 'https://heismanaccounting.com', 'CPA firm providing tax preparation, bookkeeping, and business advisory services. Auburn accounting grad helping individuals and small businesses win with their finances.', 'Jennifer Owens', 'taxes@heismanaccounting.com', '(334) 555-1244', 'active', 'paid'),
('Plains Landscaping', 'Home Services', '2200 Wire Rd, Auburn, AL 36832', 'Auburn, AL', 'https://plainslandscaping.com', 'Professional landscaping, lawn care, and outdoor living design. We bring the beauty of the Auburn campus to your backyard. Serving Auburn-Opelika since 2015.', 'Brian Wells', 'yards@plainslandscaping.com', '(334) 555-1355', 'active', 'paid'),
('War Eagle Insurance', 'Insurance', '305 Gay St, Auburn, AL 36830', 'Auburn, AL', 'https://wareagleinsurance.com', 'Independent insurance agency offering home, auto, life, and business coverage. Auburn ''07 grad providing personalized insurance solutions for Lee County families and businesses.', 'Patrick Simmons', 'protect@wareagleinsurance.com', '(334) 555-1466', 'active', 'paid');
