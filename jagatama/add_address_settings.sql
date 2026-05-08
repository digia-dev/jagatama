-- Add address and maps_url to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address TEXT AFTER tagline;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maps_url TEXT AFTER address;

-- Update existing settings with default values
UPDATE site_settings SET 
  address = 'Dukuhwaru, Tegal, Jawa Tengah', 
  maps_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.43235338167!2d109.0838186173828!3d-6.9075746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b9a67448d3%3A0x7d6f556b6b778c1!2sDukuhwaru%2C%20Kec.%20Dukuhwaru%2C%20Kabupaten%20Tegal%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1715050000000!5m2!1sid!2sid'
WHERE id = 1;
