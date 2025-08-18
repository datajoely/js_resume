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
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Latin+Modern+Roman:ital,wght@0,400;0,700;1,400&display=swap');
    
    html {
      font-family: "Latin Modern Roman", "Computer Modern", "Times New Roman", Times, serif;
      background: #fff;
      font-size: 10px;
    }
    
    body { 
      font-family: "Latin Modern Roman", "Computer Modern", "Times New Roman", Times, serif;
      margin: 40px; 
      line-height: 1.5; 
      color: #000; 
      max-width: 800px;
      font-size: 1.4rem;
      padding: 0;
    }
    .header { 
      border-bottom: 1px solid #000; 
      padding-bottom: 15px; 
      margin-bottom: 25px; 
    }
    .name { 
      font-size: 2.4rem; 
      font-weight: bold; 
      margin: 0; 
      color: #000;
      text-align: center;
      margin-bottom: 8px;
    }
    .label { 
      font-size: 1.3rem; 
      color: #000; 
      margin: 2px 0; 
      font-weight: normal;
      font-style: italic;
      text-align: center;
    }
    .contact { 
      margin: 8px 0; 
      font-size: 1.1rem;
      text-align: center;
      line-height: 1.3rem;
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
      margin: 0 6px;
    }
    .contact i {
      margin-right: 3px;
      font-size: 0.9rem;
    }
    p {
      padding: 0;
      margin: 0;
    }
    p, li {
      font-size: 1.4rem;
      line-height: 1.5rem;
    }
    a {
      text-decoration: none;
    }
    ul {
      margin: 0;
      padding: 0;
    }
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    .section { 
      margin: 20px 0; 
    }
    .section h2 { 
      font-size: 1.65rem; 
      border-bottom: 1px solid #000; 
      padding-bottom: 2px; 
      margin-bottom: 8px; 
      color: #000;
      font-weight: bold;
      margin-top: 20px;
    }
    .summary {
      text-align: center;
      margin: 10px 0;
      font-size: 1.4rem;
      line-height: 1.5rem;
    }
    .work-item { 
      margin-bottom: 18px; 
      border-left: none;
      padding-left: 0;
    }
    .company { 
      font-weight: normal; 
      font-size: 1.4rem; 
      color: #000;
      font-style: italic;
    }
    .position { 
      font-style: normal; 
      color: #000; 
      margin: 0;
      display: inline;
      font-size: 1.4rem;
    }
    .date { 
      color: #000; 
      font-size: 1.3rem; 
      margin: 0;
      float: right;
      font-style: italic;
    }
    .work-summary { 
      margin: 4px 0; 
      clear: both;
      font-size: 1.4rem;
      line-height: 1.5rem;
    }
    .highlights { 
      margin: 4px 0; 
      padding-left: 20px; 
      list-style-type: disc;
    }
    .highlights li { 
      margin: 2px 0; 
      line-height: 1.5rem;
      font-size: 1.4rem;
    }
    .skills-category { 
      margin-bottom: 6px; 
    }
    .skills-name { 
      font-weight: bold; 
      color: #000;
    }
    .skills-keywords { 
      margin-left: 0; 
      color: #000; 
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
        <div class="date">\${job.startDate} - \${job.endDate || 'Present'}</div>
        <div><strong class="position">\${job.position}</strong></div>
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
        <div class="company">\${edu.institution}</div>
        <div class="position">\${edu.studyType} in \${edu.area}</div>
        <div class="date">\${edu.startDate} - \${edu.endDate}</div>
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
        <div class="company"><a href="\${project.url}">\${project.name}</a></div>
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
        <div class="company"><a href="\${pub.url}">\${pub.name}</a></div>
        <div class="position">\${pub.publisher}</div>
        <div class="date">\${pub.releaseDate}</div>
      </div>
    \`).join('')}
  </div>
  \` : ''}

  \${data.awards ? \`
  <div class="section">
    <h2>Awards</h2>
    \${data.awards.map(award => \`
      <div class="work-item">
        <div class="company">\${award.title}</div>
        <div class="position">\${award.awarder}</div>
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