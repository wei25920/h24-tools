#!/usr/bin/env node
// Generate sitemap.xml for H24 Tools
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://wei25920.github.io/h24-tools';
const toolsDir = path.join(__dirname, '..', 'tools');
const tools = fs.readdirSync(toolsDir).filter(f => f.endsWith('.html'));

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

tools.forEach(t => {
  xml += `  <url>
    <loc>${baseUrl}/tools/${t}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), xml);
console.log('✅ sitemap.xml generated');
