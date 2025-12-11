# Job Application Assistant - Chrome Extension (React)

AI-powered Chrome extension for job application automation, featuring cover letter generation with a beautiful React-powered UI and Tailwind CSS styling.

## 🎯 Features

- ✅ **Generate Cover Letters**: Select job description text and generate tailored cover letters powered by AI
- 🎯 **Smart Auto-Show**: Menu automatically appears when you select text (100+ characters)
- 🎨 **Modern React UI**: Built with React 19, Tailwind CSS v4, and smooth animations
- 🔄 **Draggable Interface**: Floating button can be positioned anywhere on the page
- 📥 **Dual Download Options**: Download cover letters in DOCX or PDF format
- 🌐 **Environment Switching**: Easy configuration for dev/production environments
- 📦 **Modular Architecture**: Clean, well-commented, and maintainable codebase
- 🎭 **Beautiful Animations**: Smooth transitions and modern design with Tailwind
- 🧩 **Lazy-Loaded Portals**: About and Profile modals load on demand to keep the content script light

## 📁 Project Structure

```
extension/
├── public/
│   └── manifest.json          # Chrome extension manifest (MV3)
├── src/
│   ├── components/            # React components
│   │   ├── FloatingButton.jsx # Main floating action button
│   │   ├── ActionMenu.jsx     # Actions dropdown menu
│   │   ├── AboutModal.jsx     # About/info modal
│   │   ├── PreviewModal.jsx   # Cover letter preview & download
│   │   └── Toast.jsx          # Toast notifications
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDraggable.js    # Drag & drop functionality
│   │   ├── useTextSelection.js # Text selection detection
│   │   ├── useModal.js        # Modal state management
│   │   └── useToast.js        # Toast notifications
│   ├── services/              # Business logic services
│   │   ├── api.js             # API communication
│   │   └── documentProcessor.js # DOCX/PDF processing
│   ├── config/                # Configuration
│   │   └── index.js           # Environment & feature flags
│   ├── App.jsx                # Main app component
│   ├── App.css                # Component styles
│   ├── main.jsx               # Content script entry point
│   └── index.css              # Global styles & Tailwind
├── index.html                 # Dev HTML template
├── vite.config.js             # Vite build configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Chrome browser (or any Chromium-based browser)

### Installation

1. **Clone the repository**
   ```bash
   cd extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension/dist` folder
   - The extension should now appear in your extensions list

## ⚙️ Configuration

### Environment Switching

Edit `src/config/index.js` to switch between development and production:

```javascript
const CONFIG = {
  ENVIRONMENT: 'production', // Change to 'development' for local testing
  // ...
};
```

### API Endpoints

Configure your API URLs in `src/config/index.js`:

```javascript
API_ENDPOINTS: {
  development: {
    baseUrl: 'https://your-dev-url.app.github.dev',
    // ...
  },
  production: {
    baseUrl: 'https://your-production-url.com',
    // ...
  }
}
```

### Feature Flags

Enable or disable features in `src/config/index.js`:

```javascript
FEATURES: {
  coverLetterGeneration: true,  // Cover letter generation
  resumeAnalysis: false,         // Resume analysis (coming soon)
  jobMatching: false            // Job matching (coming soon)
}
```

## 📖 Usage

### 🎯 Smart Auto-Show Feature

The extension automatically shows the menu when you select text:

```
┌─────────────────────────────────────┐
│  1. Select job description text     │
│     (minimum 100 characters)        │
└─────────────────┬───────────────────┘
                  │
                  ↓ (0.2 seconds)
┌─────────────────────────────────────┐
│  2. Menu appears automatically!     │
│     • Generate Cover Letter         │
│     • About & Portal                │
└─────────────────┬───────────────────┘
                  │
                  ↓ (click)
┌─────────────────────────────────────┐
│  3. Preview & Download              │
│     • DOCX format                   │
│     • PDF format                    │
└─────────────────────────────────────┘
```

### Two Ways to Use

**Method 1: Auto-Show (Recommended) ⭐**
1. Select job description text on any webpage
2. Menu appears automatically after 0.2 seconds
3. Click "Generate Cover Letter"
4. Preview and download your cover letter

**Method 2: Manual Button**
1. Click the floating purple button (bottom-right)
2. Select "Generate Cover Letter"
3. Select job description text
4. Preview and download your cover letter

### Features in Detail

**Text Selection**
- Text is captured and stored automatically
- Works even if selection gets cleared
- Minimum 100 characters for auto-show
- Configurable threshold in config

**Draggable UI**
- Click and drag the floating button
- Position it anywhere on the page
- Stays within viewport bounds
- Remembers position while on page

**Preview & Download**
- Real-time HTML preview of DOCX content
- Download in DOCX format (original)
- Download in PDF format (converted)
- Fallback handling for conversion errors

## 🛠️ Development

### Available Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Workflow

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Open in browser**: http://localhost:5173

3. **Make changes**: Files hot-reload automatically

4. **Build extension**
   ```bash
   npm run build
   ```

5. **Test in Chrome**: Load `dist` folder as unpacked extension

### Hot Module Replacement (HMR)

- Changes to React components reload instantly
- Tailwind styles update in real-time
- State is preserved during development
- Fast feedback loop for rapid iteration

## 🎨 Styling with Tailwind CSS

The extension uses **Tailwind CSS v4** for all styling:

- **No custom CSS files needed** - All styling via Tailwind classes
- **Responsive design** - Mobile-friendly components
- **Dark mode ready** - Can be easily enabled
- **Custom animations** - Defined in `index.css`
- **Design tokens** - Consistent colors, spacing, shadows

### Custom Utility Classes

```css
/* High z-index for extension UI */
.z-999999 { z-index: 999999; }
.z-1000000 { z-index: 1000000; }
.z-1000001 { z-index: 1000001; }

/* Custom animations */
.animate-slideInRight { animation: slideInRight 0.3s ease; }
.animate-fadeIn { animation: fadeIn 0.3s ease; }
.animate-spin { animation: spin 1s linear infinite; }
```

## 🏗️ Architecture

### Component Hierarchy

```
App
├── FloatingButton (Draggable main button)
├── ActionMenu (Feature buttons)
├── AboutModal (Info & portal link)
├── PreviewModal (Document preview & download)
└── Toast (Notifications)
```

### Custom Hooks

- **useDraggable**: Drag-and-drop functionality for floating UI
- **useTextSelection**: Automatic text selection detection
- **useModal**: Modal state management with keyboard support
- **useToast**: Toast notification system

### Services

- **APIService**: Backend communication for cover letter generation
- **DocumentProcessor**: DOCX to HTML conversion and PDF generation

### State Management

- Uses React hooks for local state
- No external state management library needed
- Clean separation of concerns
- Predictable data flow

## 🐛 Troubleshooting

### Extension doesn't load

- **Check for syntax errors**: Open Chrome DevTools console
- **Verify manifest.json**: Ensure valid JSON syntax
- **Check build output**: Look in `dist` folder for compiled files
- **Review permissions**: Ensure host permissions are correct

### API calls failing

- **Verify environment**: Check `src/config/index.js` settings
- **Check CORS**: Backend must allow cross-origin requests
- **Network tab**: Inspect requests in DevTools
- **Console logs**: Look for detailed error messages

### Text selection not working

- **Minimum length**: Default is 100 characters
- **Adjust threshold**: Edit `minSelectionLength` in config
- **Check console**: Look for selection detection logs
- **Try manual**: Use floating button as fallback

### Button not appearing

- **Check z-index**: Extension uses high z-index values
- **Inspect element**: Use DevTools to find the button
- **Page conflicts**: Some sites may interfere with extension
- **Refresh page**: Try reloading after enabling extension

### Build errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Try building again
npm run build
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch" | Backend not running | Start Flask server |
| "CORS policy" | Missing CORS headers | Enable CORS in backend |
| "No text selected" | Selection too short | Select more text (100+ chars) |
| "PDF conversion failed" | Library load error | Check internet connection |
| Button position wrong | Cache issue | Refresh page |

## 🧪 Testing

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Floating button appears in bottom-right
- [ ] Button is draggable and repositionable
- [ ] Text selection auto-shows menu
- [ ] Cover letter generation works
- [ ] Preview modal displays content
- [ ] DOCX download works
- [ ] PDF download works
- [ ] Toast notifications appear
- [ ] About modal opens and closes
- [ ] Environment switching works
- [ ] All animations are smooth

### Test Different Scenarios

1. **Various websites**: Test on LinkedIn, Indeed, company sites
2. **Different text lengths**: Short, medium, long job descriptions
3. **Edge cases**: Very long text, special characters
4. **Network errors**: Test with backend offline
5. **Browser compatibility**: Test in Chrome, Edge, Brave

## 📝 API Backend Requirements

The extension expects the following API endpoints:

### Generate Cover Letter

```
POST /api/generate_coverletter
Content-Type: application/json

Request Body:
{
  "job_description": "string"
}

Response: Binary (DOCX file)
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### Health Check

```
GET /api/hello

Response: HTML or JSON
Status: 200 OK
```

### Required CORS Headers

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 🔒 Security & Privacy

- Extension only activates when user selects text
- No data is stored locally or sent without user action

## 📚 Documentation Map (single source)

- Quick start, build, and troubleshooting live in this README (see Getting Started and Troubleshooting).
- Development workflow and scripts are in this README (see Development and Available Scripts).
- The original conversion notes are summarized below.

## 🧭 Conversion Summary (vanilla → React)

- Rebuilt the extension into modular React components (FloatingButton, ActionMenu, About/Preview/Toast) with reusable hooks (dragging, selection, modals, toasts).
- Centralized configuration and feature flags in [src/config/index.js](src/config/index.js).
- Added service layer for API and document handling, Tailwind v4 styling, and Vite for fast builds.
- Preserved feature parity (floating UI, selection-driven actions, cover-letter generation, downloads) while improving animations, accessibility, and error handling.
- Added lazy loading for heavier portals (About, Profile) to minimize impact on page performance.
- All API calls are logged to console for transparency
- Host permissions are minimal and scoped
- No tracking or analytics

## 🚀 Future Enhancements

- [ ] Resume analysis feature
- [ ] Job matching algorithm
- [ ] Application tracking system
- [ ] Multiple cover letter templates
- [ ] LinkedIn integration
- [ ] Chrome sync for settings
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts
- [ ] Context menu integration
- [ ] Offline mode with caching

## 📦 Tech Stack

- **React 19**: Latest React with hooks and concurrent features
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS v4**: Utility-first CSS framework
- **Chrome Extension API**: Manifest V3
- **ES Modules**: Modern JavaScript modules
- **JSDoc**: Comprehensive code documentation
- **Mammoth.js**: DOCX to HTML conversion
- **jsPDF**: PDF generation

## 📄 License

MIT License - Feel free to modify and extend!

## 🤝 Contributing

Contributions are welcome! When adding new features:

1. Follow the existing code structure
2. Add comprehensive JSDoc comments
3. Use Tailwind for styling (no custom CSS)
4. Test in both dev and production modes
5. Update this README with new features
6. Increment version number in manifest.json

## 📋 Changelog

### Version 2.0.0 (Current)

- ✨ Complete React rewrite with modern architecture
- 🎨 Tailwind CSS v4 for all styling
- 📦 Modular component structure
- 🔧 Custom hooks for reusable logic
- 🎯 Smart text selection with auto-show
- 📥 Dual download options (DOCX & PDF)
- 🌐 Environment configuration system
- 📝 Comprehensive documentation
- 🐛 Improved error handling
- ⚡ Better performance with Vite

### Version 1.0.0 (Legacy)

- Initial release with vanilla JavaScript
- Basic cover letter generation
- Floating UI with CSS
- Manual text selection only

---

## 🆘 Need Help?

If you encounter issues:

1. Check this README thoroughly
2. Look in the browser console for errors
3. Verify your configuration in `src/config/index.js`
4. Test API endpoints directly in browser
5. Check the Network tab in DevTools
6. Ensure backend is running and accessible

**Built with ❤️ for easier job applications**
