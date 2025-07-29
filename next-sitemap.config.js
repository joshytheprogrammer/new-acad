module.exports = {
  siteUrl: 'https://academy.wandggroup.com', // Academy-specific URL
  generateRobotsTxt: true, // Generate robots.txt file
  sitemapSize: 7000, // Split sitemap if it exceeds this size
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/404', '/500', '/studio'], // Exclude specific pages
}; 