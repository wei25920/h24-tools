#!/usr/bin/env node
// This script rewrites HTML files with proper UTF-8 encoding
// It uses qrcode.html as a known-good template and applies per-file specific content

const fs = require('fs');
const path = require('path');

const toolsDir = 'D:\\gw\\mygw\\h24-tools\\tools';

// Each tool's content as a function that returns the HTML (using template literals for freshness)
function writeTool(filename, htmlContent) {
    const filepath = path.join(toolsDir, filename);
    fs.writeFileSync(filepath, htmlContent, 'utf8');
    const bytes = fs.readFileSync(filepath);
    const text = bytes.toString('utf8');
    const hasBad = text.indexOf('\uFFFD') >= 0;
    console.log(`${filename}: ${bytes.length} bytes, corrupted=${hasBad}`);
}

// Build per-tool JS content separately to avoid template literal issues
const scripts = {};
const htmls = {};

// We'll write each file using regular string concatenation (no template literals to avoid backtick issues)
// Content is passed as a simple string - newlines embedded with \n

console.log('Starting to write all tool files...');
