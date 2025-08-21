#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildResume() {
  try {
    // Read resume.json
    const resumeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'resume.json'), 'utf8'));
    
    // Generate HTML directly (no more temporary scripts)
    const html = generateHTML(resumeData);
    
    // Ensure docs directory exists
    const docsDir = 'docs';
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Write HTML file
    fs.writeFileSync(path.join(docsDir, 'index.html'), html);
    console.log('Resume HTML built successfully: docs/index.html');
    
    // Generate PDF
    await generatePDF();
    
  } catch (error) {
    console.error('Error building resume:', error);
    process.exit(1);
  }
}

function generateHTML(data) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${data.basics.name} - Resume</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.cdnfonts.com/css/latin-modern-roman" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">  
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
      --link-color: #0066cc;
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
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      background: var(--bg-primary);
      font-size: 14px;
      line-height: 1.4;
    }
    
    body { 
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      letter-spacing: 0.02em;
    }
    
    .label { 
      font-size: 1.1rem; 
      color: var(--text-primary); 
      margin: 0 0 1rem 0; 
      font-weight: bold;
      text-align: center;
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    }
    
    .contact { 
      margin: 1rem 0; 
      font-size: 0.9rem;
      text-align: center;
      line-height: 1.4;
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
    
    .download-pdf {
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

    .download-pdf:hover {
      background: var(--border-color);
      color: var(--text-primary);
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .download-pdf:active {
      transform: scale(0.95);
    }
    
    .theme-indicator {
      position: fixed;
      top: 4.5rem;
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
    
    .github-link {
      position: fixed;
      top: 8rem;
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
      text-decoration: none;
    }

    .github-link:hover {
      background: var(--border-color);
      color: var(--text-primary);
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .github-link:active {
      transform: scale(0.95);
    }
    
    .summary {
      text-align: center;
      margin: 1.5rem 0 0 0;
      font-size: 1rem;
      line-height: 1.6;
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    }
    
    .work-date {
      color: var(--text-muted); 
      font-size: 0.9rem; 
      font-style: italic;
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      white-space: nowrap;
    }
    
    .company { 
      font-weight: normal; 
      font-size: 1rem; 
      color: var(--text-muted-light);
      font-style: italic;
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      margin-bottom: 0.5rem;
    }
    
    .work-summary { 
      margin: 0.5rem 0; 
      font-size: 1rem;
      line-height: 1.5;
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    }
    
    .skills-category { 
      margin-bottom: 0.75rem; 
      text-align: left;
    }
    
    .skills-name { 
      font-weight: bold; 
      color: var(--text-primary);
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    }
    
    .skills-keywords { 
      margin-left: 0.5rem; 
      color: var(--text-primary); 
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    }
    
    p, li {
      font-size: 1rem;
      line-height: 1.5;
      font-family: 'LMRoman10', 'Space Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
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
      :root {
        --bg-primary: #ffffff !important;
        --bg-secondary: #f8f9fa !important;
        --text-primary: #000000 !important;
        --text-secondary: #333333 !important;
        --text-muted: #555555 !important;
        --text-muted-light: #444444 !important;
        --border-color: #e3e3e3 !important;
        --link-color: #0066cc !important;
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
        color: #0066cc !important;
      }
      
      .theme-indicator, .download-pdf, .github-link {
        display: none !important;
      }
    }
  </style>
  <script>
    let currentTheme = 'system';
    
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
        root.style.setProperty('--link-color', '#0066cc');
        root.style.setProperty('--section-border', '#e3e3e3');
      } else {
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
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          icon.className = 'fas fa-moon';
          indicator.title = 'Dark mode (system preference, click to override)';
        } else {
          icon.className = 'fas fa-sun';
          indicator.title = 'Light mode (system preference, click to override)';
        }
      }
    }
    
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
      localStorage.setItem('resume-theme', currentTheme);
    }
    
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentTheme === 'system') {
          updateThemeIndicator();
        }
      });
    }
    
    document.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('resume-theme');
      if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
      }
      
      updateThemeIndicator();
      
      const indicator = document.querySelector('.theme-indicator');
      indicator.addEventListener('click', cycleTheme);
    });
  </script>
  
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-VVE26YF8FE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-VVE26YF8FE');
  </script>
</head>
<body>
  <div class="theme-indicator" title="System theme indicator"><i class="fas fa-adjust"></i></div>
  <a id="download-pdf-button" class="download-pdf" href="#" title="Download PDF">
    <i class="fas fa-file-pdf"></i>
  </a>
  <a href="https://github.com/datajoely/resume-builder/tree/main" class="github-link" title="View on GitHub" target="_blank" rel="noopener noreferrer">
    <i class="fab fa-github"></i>
  </a>
  <div class="header">
    <h1 class="name">${data.basics.name}</h1>
    <div class="label">${data.basics.label}</div>
    <div class="contact">
      <span class="contact-item"><i class="fas fa-map-marker-alt"></i>${data.basics.location.city}, ${data.basics.location.region}, ${data.basics.location.countryCode}</span>
      <span class="contact-item"><i class="fas fa-envelope"></i>${data.basics.email}</span>
      ${data.basics.profiles.map(profile => {
        const icon = profile.network.toLowerCase() === 'github' ? 'fab fa-github' : 'fas fa-link';
        return `<span class="contact-item"><i class="${icon}"></i><a href="${profile.url}">${profile.username}</a></span>`;
      }).join('')}
    </div>
    <div class="summary">${data.basics.summary}</div>
  </div>

  <div class="section">
    <h2>Experience</h2>
    ${data.work.map(job => `
      <div class="work-item">
        <div class="work-header">
          <div class="work-title">${job.position}</div>
          <div class="work-date">${job.startDate} - ${job.endDate || 'Present'}</div>
        </div>
        <div class="company">${job.company}</div>
        <div class="work-summary">${job.summary}</div>
        ${job.highlights ? `<ul class="highlights">${job.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>

  ${data.education ? `
  <div class="section">
    <h2>Education</h2>
    ${data.education.map(edu => `
      <div class="work-item">
        <div class="work-header">
          <div class="work-title">${edu.studyType} in ${edu.area}</div>
          <div class="work-date">${edu.startDate} - ${edu.endDate}</div>
        </div>
        <div class="company">${edu.institution}</div>
        ${edu.score ? `<div class="work-summary">Grade: ${edu.score}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.awards ? `
  <div class="section">
    <h2>Awards</h2>
    ${data.awards.map(award => `
      <div class="work-item">
        <div class="work-header">
          <div class="work-title">${award.title}</div>
        </div>
        <div class="company">${award.awarder}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.skills ? `
  <div class="section">
    <h2>Skills</h2>
    ${data.skills.map(skill => `
      <div class="skills-category">
        <span class="skills-name">${skill.name}:</span>
        <span class="skills-keywords">${skill.keywords.join(', ')}</span>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.projects ? `
  <div class="section">
    <h2>Projects</h2>
    ${data.projects.map(project => `
      <div class="work-item">
        <div class="work-header">
          <div class="work-title"><a href="${project.url}">${project.name}</a></div>
        </div>
        <div class="work-summary">${project.summary}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${data.publications ? `
  <div class="section">
    <h2>Publications</h2>
    ${data.publications.map(pub => `
      <div class="work-item">
        <div class="work-header">
          <div class="work-title"><a href="${pub.url}">${pub.name}</a></div>
          <div class="work-date">${pub.releaseDate}</div>
        </div>
        <div class="company">${pub.publisher}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  <script>
  document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-pdf-button');
    downloadButton.href = 'resume.pdf';
  });
  </script>
</body>
</html>`;
}

async function generatePDF() {
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    const page = await browser.newPage();
    
    // Load the HTML file
    const htmlPath = path.join(__dirname, 'docs', 'index.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Generate PDF in the docs directory for GitHub Pages
    const pdfPath = path.join(__dirname, 'docs', 'resume.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: {
        top: '12.5mm',
        right: '12.5mm',
        bottom: '12.5mm',
        left: '12.5mm'
      }
    });
    
    console.log('PDF generated successfully: docs/resume.pdf');
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

buildResume();