#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildResume() {
  try {
    // Read resume.json
    const resumeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'resume.json'), 'utf8'));
    
    // Use a Node.js subprocess to handle the CommonJS theme
    const { spawn } = await import('child_process');
    
    // Create a temporary CommonJS script to handle the theme
    const tempScript = `
const fs = require('fs');
const path = require('path');

// Mock React environment for server-side rendering
global.window = {};
global.document = { createElement: () => ({}), createTextNode: () => ({}) };

// Simple template for the professional theme layout
const resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));

function generateHTML(data) {
  return \`<!DOCTYPE html>
<html>
<head>
  <title>\${data.basics.name} - Resume</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.cdnfonts.com/css/latin-modern-roman" rel="stylesheet">
  <style>
    :root {
      /* Light mode colors (default) */
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --text-primary: #000000;
      --text-secondary: #333333;
      --text-muted: #555555;
      --text-muted-light: #444444;
      --border-color: #e3e3e3;
      --link-color: #000000;
      --section-border: #e3e3e3;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        /* Dark mode colors */
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #e0e0e0;
        --text-muted: #b0b0b0;
        --text-muted-light: #cccccc;
        --border-color: #404040;
        --link-color: #66b3ff;
        --section-border: #404040;
      }
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Smooth transitions for dark/light mode changes */
    body, html, .name, .label, .contact a, .summary, .section h2, 
    .work-title, .work-date, .company, .skills-name, .skills-keywords, a {
      transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
    }
    
    html {
      font-family: 'LMRoman10', serif;
      background: var(--bg-primary);
      font-size: 14px;
      line-height: 1.4;
    }
    
    body { 
      font-family: 'LMRoman10', serif;
      margin: 0 auto; 
      line-height: 1.4; 
      color: var(--text-primary); 
      max-width: 700px;
      font-size: 1rem;
      padding: 2rem;
      background: var(--bg-primary);
    }
    
    .header { 
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
    }
    
    .name { 
      font-size: 2.5rem; 
      font-weight: bold; 
      margin: 0 0 0.5rem 0; 
      color: var(--text-primary);
      text-align: center;
      font-family: 'LMRoman10', serif;
      letter-spacing: 0.02em;
    }
    
    .label { 
      font-size: 1.1rem; 
      color: var(--text-primary); 
      margin: 0 0 1rem 0; 
      font-weight: normal;
      font-style: italic;
      text-align: center;
      font-family: 'LMRoman10', serif;
    }
    
    .contact { 
      margin: 1rem 0; 
      font-size: 0.9rem;
      text-align: center;
      line-height: 1.4;
      font-family: 'LMRoman10', serif;
    }
    
    .contact a { 
      color: var(--link-color); 
      text-decoration: none; 
    }
    
    .contact a:hover { 
      text-decoration: underline; 
    }
    
    .contact-item {
      display: inline-block;
      margin: 0 0.75rem;
    }
    
    .contact i {
      margin-right: 0.25rem;
      font-size: 0.8rem;
    }
    
    .theme-indicator {
      position: fixed;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem;
      border-radius: 50%;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      user-select: none;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .theme-indicator:hover {
      background: var(--border-color);
      color: var(--text-primary);
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .theme-indicator:active {
      transform: scale(0.95);
    }
    
    .theme-indicator i {
      font-size: 1rem;
    }
    
    .summary {
      text-align: center;
      margin: 1.5rem 0 0 0;
      font-size: 1rem;
      line-height: 1.6;
      font-family: 'LMRoman10', serif;
      max-width: 650px;
      margin-left: auto;
      margin-right: auto;
      color: var(--text-secondary);
    }
    
    .section { 
      margin: 1.5rem 0; 
    }
    
    .section h2 { 
      font-size: 1.3rem; 
      border-bottom: 1px solid var(--section-border); 
      padding-bottom: 0.25rem; 
      margin-bottom: 1rem; 
      color: var(--text-primary);
      font-weight: bold;
      margin-top: 1.5rem;
      text-align: left;
      font-family: 'LMRoman10', serif;
      letter-spacing: 0.01em;
    }
    
    .work-item { 
      margin-bottom: 1.75rem; 
      text-align: left;
    }
    
    .work-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    
    .work-title {
      font-weight: bold;
      font-size: 1rem;
      color: var(--text-primary);
      font-family: 'LMRoman10', serif;
    }
    
    .work-date {
      color: var(--text-muted); 
      font-size: 0.9rem; 
      font-style: italic;
      font-family: 'LMRoman10', serif;
      white-space: nowrap;
    }
    
    .company { 
      font-weight: normal; 
      font-size: 1rem; 
      color: var(--text-muted-light);
      font-style: italic;
      font-family: 'LMRoman10', serif;
      margin-bottom: 0.5rem;
    }
    
    .work-summary { 
      margin: 0.5rem 0; 
      font-size: 1rem;
      line-height: 1.5;
      font-family: 'LMRoman10', serif;
    }
    
    .highlights { 
      margin: 0.5rem 0; 
      padding-left: 1.5rem; 
      list-style-type: disc;
    }
    
    .highlights li { 
      margin: 0.25rem 0; 
      line-height: 1.4;
      font-size: 1rem;
      font-family: 'LMRoman10', serif;
    }
    
    .skills-category { 
      margin-bottom: 0.75rem; 
      text-align: left;
    }
    
    .skills-name { 
      font-weight: bold; 
      color: var(--text-primary);
      font-family: 'LMRoman10', serif;
    }
    
    .skills-keywords { 
      margin-left: 0.5rem; 
      color: var(--text-primary); 
      font-family: 'LMRoman10', serif;
    }
    
    /* Ensure proper LaTeX-style typography */
    p, li {
      font-size: 1rem;
      line-height: 1.5;
      font-family: 'LMRoman10', serif;
    }
    
    a {
      text-decoration: none;
      color: var(--link-color);
    }
    
    ul {
      margin: 0;
      padding: 0;
    }
    
    /* Print and PDF optimization */
    @media print {
      /* Force light mode for PDFs and printing */
      :root {
        --bg-primary: #ffffff !important;
        --bg-secondary: #f8f9fa !important;
        --text-primary: #000000 !important;
        --text-secondary: #333333 !important;
        --text-muted: #555555 !important;
        --text-muted-light: #444444 !important;
        --border-color: #e3e3e3 !important;
        --link-color: #000000 !important;
        --section-border: #e3e3e3 !important;
      }
      
      body {
        margin: 0;
        padding: 1rem;
        max-width: none;
        font-size: 12px;
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      /* Just prevent really awkward breaks */
      .section h2 {
        page-break-after: avoid;
        color: #000000 !important;
        border-bottom-color: #e3e3e3 !important;
      }
      
      .work-header {
        page-break-after: avoid;
      }
      
      .name, .label, .work-title, .skills-name, .skills-keywords {
        color: #000000 !important;
      }
      
      .work-date {
        color: #555555 !important;
      }
      
      .company {
        color: #444444 !important;
      }
      
      .summary {
        color: #333333 !important;
      }
      
      .contact a, a {
        color: #000000 !important;
      }
      
      /* Hide theme indicator in print */
      .theme-indicator {
        display: none !important;
      }
    }
  </style>
  <script>
    let currentTheme = 'system'; // 'system', 'light', or 'dark'
    
    // Function to apply theme
    function applyTheme(theme) {
      const root = document.documentElement;
      
      if (theme === 'dark') {
        root.style.setProperty('--bg-primary', '#1a1a1a');
        root.style.setProperty('--bg-secondary', '#2d2d2d');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#e0e0e0');
        root.style.setProperty('--text-muted', '#b0b0b0');
        root.style.setProperty('--text-muted-light', '#cccccc');
        root.style.setProperty('--border-color', '#404040');
        root.style.setProperty('--link-color', '#66b3ff');
        root.style.setProperty('--section-border', '#404040');
      } else if (theme === 'light') {
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8f9fa');
        root.style.setProperty('--text-primary', '#000000');
        root.style.setProperty('--text-secondary', '#333333');
        root.style.setProperty('--text-muted', '#555555');
        root.style.setProperty('--text-muted-light', '#444444');
        root.style.setProperty('--border-color', '#e3e3e3');
        root.style.setProperty('--link-color', '#000000');
        root.style.setProperty('--section-border', '#e3e3e3');
      } else {
        // Reset to system preference
        root.style.removeProperty('--bg-primary');
        root.style.removeProperty('--bg-secondary');
        root.style.removeProperty('--text-primary');
        root.style.removeProperty('--text-secondary');
        root.style.removeProperty('--text-muted');
        root.style.removeProperty('--text-muted-light');
        root.style.removeProperty('--border-color');
        root.style.removeProperty('--link-color');
        root.style.removeProperty('--section-border');
      }
    }
    
    // Function to update theme indicator
    function updateThemeIndicator() {
      const indicator = document.querySelector('.theme-indicator');
      const icon = indicator.querySelector('i');
      
      if (currentTheme === 'dark') {
        icon.className = 'fas fa-moon';
        indicator.title = 'Dark mode (click to switch to light)';
      } else if (currentTheme === 'light') {
        icon.className = 'fas fa-sun';
        indicator.title = 'Light mode (click to switch to system)';
      } else {
        // System preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          icon.className = 'fas fa-moon';
          indicator.title = 'Dark mode (system preference, click to override)';
        } else {
          icon.className = 'fas fa-sun';
          indicator.title = 'Light mode (system preference, click to override)';
        }
      }
    }
    
    // Function to cycle through themes
    function cycleTheme() {
      if (currentTheme === 'system') {
        currentTheme = 'light';
      } else if (currentTheme === 'light') {
        currentTheme = 'dark';
      } else {
        currentTheme = 'system';
      }
      
      applyTheme(currentTheme);
      updateThemeIndicator();
      
      // Save preference to localStorage
      localStorage.setItem('resume-theme', currentTheme);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentTheme === 'system') {
          updateThemeIndicator();
        }
      });
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
      // Load saved theme preference
      const savedTheme = localStorage.getItem('resume-theme');
      if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
      }
      
      updateThemeIndicator();
      
      // Add click event listener
      const indicator = document.querySelector('.theme-indicator');
      indicator.addEventListener('click', cycleTheme);
    });
  </script>
</head>
<body>
  <div class="theme-indicator" title="System theme indicator"><i class="fas fa-adjust"></i></div>
  <div class="header">
    <h1 class="name">\${data.basics.name}</h1>
    <div class="label">\${data.basics.label}</div>
    <div class="contact">
      <span class="contact-item"><i class="fas fa-map-marker-alt"></i>\${data.basics.location.city}, \${data.basics.location.region}, \${data.basics.location.countryCode}</span>
      <span class="contact-item"><i class="fas fa-envelope"></i>\${data.basics.email}</span>
      \${data.basics.profiles.map(profile => {
        const icon = profile.network.toLowerCase() === 'github' ? 'fab fa-github' : 'fas fa-link';
        return \`<span class="contact-item"><i class="\${icon}"></i><a href="\${profile.url}">\${profile.username}</a></span>\`;
      }).join('')}
    </div>
    <div class="summary">\${data.basics.summary}</div>
  </div>

  <div class="section">
    <h2>Experience</h2>
    \${data.work.map(job => \`
      <div class="work-item">
        <div class="work-header">
          <div class="work-title">\${job.position}</div>
          <div class="work-date">\${job.startDate} - \${job.endDate || 'Present'}</div>
        </div>
        <div class="company">\${job.company}</div>
        <div class="work-summary">\${job.summary}</div>
        \${job.highlights ? \`<ul class="highlights">\${job.highlights.map(h => \`<li>\${h}</li>\`).join('')}</ul>\` : ''}
      </div>
    \`).join('')}
  </div>

  \${data.education ? \`
  <div class="section">
    <h2>Education</h2>
    \${data.education.map(edu => \`
      <div class="work-item">
        <div class="work-header">
          <div class="work-title">\${edu.studyType} in \${edu.area}</div>
          <div class="work-date">\${edu.startDate} - \${edu.endDate}</div>
        </div>
        <div class="company">\${edu.institution}</div>
        \${edu.score ? \`<div class="work-summary">Grade: \${edu.score}</div>\` : ''}
      </div>
    \`).join('')}
  </div>
  \` : ''}

  \${data.skills ? \`
  <div class="section">
    <h2>Skills</h2>
    \${data.skills.map(skill => \`
      <div class="skills-category">
        <span class="skills-name">\${skill.name}:</span>
        <span class="skills-keywords">\${skill.keywords.join(', ')}</span>
      </div>
    \`).join('')}
  </div>
  \` : ''}

  \${data.projects ? \`
  <div class="section">
    <h2>Projects</h2>
    \${data.projects.map(project => \`
      <div class="work-item">
        <div class="work-header">
          <div class="work-title"><a href="\${project.url}">\${project.name}</a></div>
        </div>
        <div class="work-summary">\${project.summary}</div>
      </div>
    \`).join('')}
  </div>
  \` : ''}

  \${data.publications ? \`
  <div class="section">
    <h2>Publications</h2>
    \${data.publications.map(pub => \`
      <div class="work-item">
        <div class="work-header">
          <div class="work-title"><a href="\${pub.url}">\${pub.name}</a></div>
          <div class="work-date">\${pub.releaseDate}</div>
        </div>
        <div class="company">\${pub.publisher}</div>
      </div>
    \`).join('')}
  </div>
  \` : ''}

  \${data.awards ? \`
  <div class="section">
    <h2>Awards</h2>
    \${data.awards.map(award => \`
      <div class="work-item">
        <div class="work-header">
          <div class="work-title">\${award.title}</div>
        </div>
        <div class="company">\${award.awarder}</div>
      </div>
    \`).join('')}
  </div>
  \` : ''}
</body>
</html>\`;
}

const docsDir = 'docs';
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const html = generateHTML(resumeData);
fs.writeFileSync(path.join(docsDir, 'index.html'), html);
console.log('Resume built successfully: docs/index.html');
`;

    // Write and execute the temporary script
    fs.writeFileSync(path.join(__dirname, 'temp-build.cjs'), tempScript);
    
    const { execSync } = await import('child_process');
    execSync('node temp-build.cjs', { cwd: __dirname, stdio: 'inherit' });
    
    // Clean up
    fs.unlinkSync(path.join(__dirname, 'temp-build.cjs'));
    
  } catch (error) {
    console.error('Error building resume:', error);
    process.exit(1);
  }
}

buildResume();