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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.cdnfonts.com/css/latin-modern-roman" rel="stylesheet">
  <style>
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      font-family: 'LMRoman10', serif;
      background: #fff;
      font-size: 14px;
      line-height: 1.4;
    }
    
    body { 
      font-family: 'LMRoman10', serif;
      margin: 0 auto; 
      line-height: 1.4; 
      color: #000; 
      max-width: 700px;
      font-size: 1rem;
      padding: 2rem;
      background: #fff;
    }
    
    .header { 
      text-align: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #000;
      padding-bottom: 1rem;
    }
    
    .name { 
      font-size: 2.5rem; 
      font-weight: bold; 
      margin: 0 0 0.5rem 0; 
      color: #000;
      text-align: center;
      font-family: 'LMRoman10', serif;
      letter-spacing: 0.02em;
    }
    
    .label { 
      font-size: 1.1rem; 
      color: #000; 
      margin: 0 0 1rem 0; 
      font-weight: normal;
      font-style: italic;
      text-align: center;
      font-family: 'LMRoman10', serif;
    }
    
    .contact { 
      margin: 0.5rem 0; 
      font-size: 0.9rem;
      text-align: center;
      line-height: 1.3;
      font-family: 'LMRoman10', serif;
    }
    
    .contact a { 
      color: #000; 
      text-decoration: none; 
    }
    
    .contact a:hover { 
      text-decoration: underline; 
    }
    
    .contact-item {
      display: inline-block;
      margin: 0 0.5rem;
    }
    
    .contact i {
      margin-right: 0.25rem;
      font-size: 0.8rem;
    }
    
    .summary {
      text-align: center;
      margin: 1rem 0 0 0;
      font-size: 1rem;
      line-height: 1.5;
      font-family: 'LMRoman10', serif;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .section { 
      margin: 1.5rem 0; 
    }
    
    .section h2 { 
      font-size: 1.3rem; 
      border-bottom: 1px solid #666; 
      padding-bottom: 0.25rem; 
      margin-bottom: 1rem; 
      color: #000;
      font-weight: bold;
      margin-top: 1.5rem;
      text-align: left;
      font-family: 'LMRoman10', serif;
      letter-spacing: 0.01em;
    }
    
    .work-item { 
      margin-bottom: 1.5rem; 
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
      color: #000;
      font-family: 'LMRoman10', serif;
    }
    
    .work-date {
      color: #000; 
      font-size: 0.9rem; 
      font-style: italic;
      font-family: 'LMRoman10', serif;
      white-space: nowrap;
    }
    
    .company { 
      font-weight: normal; 
      font-size: 1rem; 
      color: #000;
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
      color: #000;
      font-family: 'LMRoman10', serif;
    }
    
    .skills-keywords { 
      margin-left: 0.5rem; 
      color: #000; 
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
      color: #000;
    }
    
    ul {
      margin: 0;
      padding: 0;
    }
    
    /* Print and PDF optimization */
    @media print {
      body {
        margin: 0;
        padding: 1rem;
        max-width: none;
        font-size: 12px;
      }
      
      /* Just prevent really awkward breaks */
      .section h2 {
        page-break-after: avoid;
      }
      
      .work-header {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
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