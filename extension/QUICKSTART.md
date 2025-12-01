# 🚀 Quick Start Guide

Get the Job Application Assistant Chrome Extension up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd /workspaces/Job-Application-Bot/extension
npm install
```

This installs:
- React 19
- Vite
- Tailwind CSS v4
- All required dependencies

## Step 2: Configure Environment

Open `src/config/index.js` and verify settings:

```javascript
const CONFIG = {
  ENVIRONMENT: 'development', // Use 'development' for testing
  // ... rest is already configured
};
```

Default settings are already configured for your Codespace!

## Step 3: Build the Extension

```bash
npm run build
```

This creates a `dist/` folder with the compiled extension.

## Step 4: Load in Chrome

1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Turn ON "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Navigate to `/workspaces/Job-Application-Bot/extension/dist`
6. Click "Select Folder"

✅ Extension is now installed!

## Step 5: Test It Out

1. **Go to a job site** (LinkedIn, Indeed, etc.)
2. **Select job description text** (at least 100 characters)
3. **Watch the menu appear** automatically!
4. **Click "Generate Cover Letter"**
5. **Download your cover letter** in DOCX or PDF format

## 🎯 Development Mode

For active development with hot reload:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser to test the UI.

## 🔧 Common Commands

```bash
# Development server (with HMR)
npm run dev

# Build for extension
npm run build

# Build for production
NODE_ENV=production npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 🐛 Troubleshooting

### Extension not showing up?
- Make sure you selected the `dist` folder, not the root `extension` folder
- Check Chrome extensions page for error messages
- Try reloading the extension

### API not working?
- Verify your backend is running
- Check `src/config/index.js` has correct API URL
- Look at browser console for error messages

### Build fails?
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite dist
npm run build
```

## 📚 Next Steps

- Read [README.md](README.md) for complete documentation
- Read [DEVELOPMENT.md](DEVELOPMENT.md) for development guide
- Read [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md) for what changed

## 🎉 You're Ready!

The extension is now installed and ready to use. Visit any job site and start generating cover letters!

Need help? Check the troubleshooting section in README.md or the browser console for detailed error messages.
