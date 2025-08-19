# JSON Resume Builder

An automated resume builder that generates HTML and PDF resumes from a structured JSON file.

## ✨ Features

- **JSON-based**: Write your resume once in a structured format
- **Multiple outputs**: Generate HTML and PDF versions
- **Modern design**: Clean, professional layout with LaTeX-style typography
- **Dark/Light mode**: Automatic theme switching with manual override
- **Responsive**: Works great on all devices
- **Print optimized**: Perfect for PDF generation and printing
- **GitHub Pages ready**: Includes GitHub Actions workflow for automatic deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Chrome/Chromium (for PDF generation)

### Installation

```bash
# Install dependencies and setup Chrome for PDF generation
make install
```

### Build Your Resume

```bash
make build # Build HTML version
make pdf # Build HTML and generate PDF
make all # Install dependencies and build everything from scratch
```

## 📝 How to Fill in the JSON Resume

The project uses the [JSON Resume schema](https://jsonresume.org/schema/), which provides a standardized way to structure your resume data. Here's how to fill in each section:


## 🔧 How the Build System Works

The build process transforms your JSON resume into a beautiful HTML document and optionally generates a PDF. Here's how it works:

### Build Process Details

1. **JSON Parsing**: The build script reads your `resume.json` file
2. **Template Generation**: Creates a custom HTML template with professional styling
3. **Theme Integration**: Adds dark/light mode support with CSS custom properties
4. **Output Generation**: Writes the final HTML to `docs/index.html`
5. **PDF Generation** (optional): Uses Puppeteer to render HTML and generate PDF

### File Structure

```
repo/
├── resume.json          # Your resume data
├── build-resume.mjs     # Main build script
├── pdf-generator.js     # PDF generation script
├── docs/                # Generated HTML output
├── package.json         # Dependencies and scripts
├── Makefile            # Build automation
└── .github/workflows/  # GitHub Actions for deployment
```

### Layout

The layout is optimized for:

- **Screen viewing**: Responsive design with dark/light mode
- **Printing**: Clean, readable format for PDFs
- **Mobile**: Responsive layout for all screen sizes

## 🚀 Deployment

### GitHub Pages

The project includes a GitHub Actions workflow that automatically builds and deploys your resume to GitHub Pages:

1. Push your changes to the main branch
2. GitHub Actions will automatically build the resume
3. Your resume will be available at `https://username.github.io/repository-name`

### Manual Deployment

```bash
# Deploy to any static hosting service
# The docs/ folder contains your built resume```

### Makefile Commands

- `make install` - Install dependencies
- `make build` - Build HTML resume
- `make pdf` - Build HTML and generate PDF
- `make clean` - Remove generated files
- `make all` - Complete setup and build

## 🔍 Troubleshooting

### Common Issues

1. **Chrome not found**: Run `npm run setup` to install Chrome for Puppeteer
2. **Build errors**: Check that your `resume.json` is valid JSON
3. **PDF generation fails**: Ensure Chrome is properly installed and accessible

