# Development Guide

Complete guide for developing, building, and testing the Job Application Assistant Chrome Extension.

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd extension
npm install
```

### 2. Configure Environment

Edit `src/config/index.js`:

```javascript
const CONFIG = {
  ENVIRONMENT: 'development', // Switch to 'development'
  // ...
};
```

## 📦 Building

### Development Build

```bash
npm run build
```

This creates a development build in `dist/` folder with:
- Source maps enabled
- Non-minified code
- Console logs intact

### Production Build

1. Update config to production:
   ```javascript
   ENVIRONMENT: 'production'
   ```

2. Build:
   ```bash
   NODE_ENV=production npm run build
   ```

This creates an optimized build with:
- Minified code
- No source maps
- Production optimizations

## 🧪 Testing

### Local Development Testing

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open in browser**: http://localhost:5173

3. **Test features**:
   - Select text on the page
   - Test floating button
   - Test cover letter generation (mock)

### Chrome Extension Testing

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

3. **Test on real websites**:
   - Go to LinkedIn, Indeed, etc.
   - Select job descriptions
   - Test all features

### Hot Reload During Development

For quick iteration:

1. Keep dev server running: `npm run dev`
2. Make changes to components
3. Changes reflect immediately in browser
4. When ready, build and reload extension

## 🔍 Debugging

### Browser Console

Open DevTools Console to see:
- Extension initialization logs
- API call logs  
- Error messages
- State changes

### React DevTools

1. Install React DevTools extension
2. Open DevTools
3. Go to "Components" tab
4. Inspect component state and props

### Network Tab

Monitor API calls:
1. Open DevTools Network tab
2. Test cover letter generation
3. Check request/response
4. Verify endpoints and payloads

### Source Maps

In development builds:
- Source maps are enabled
- Original React code visible
- Set breakpoints in original files
- Step through code execution

## 📝 Code Quality

### Linting

```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint -- --fix
```

### Type Checking with JSDoc

All files include comprehensive JSDoc comments:
```javascript
/**
 * Description of function
 * @param {Type} paramName - Description
 * @returns {Type} Description
 */
```

## 🏗️ Build Output Structure

After running `npm run build`, the `dist/` folder contains:

```
dist/
├── index.html
├── manifest.json
├── src/
│   ├── main.js            # Entry point
│   └── [chunk].js         # Code chunks
└── assets/
    ├── [hash].css         # Compiled styles
    └── [hash].js          # Asset chunks
```

## 🔧 Customization

### Adding New Components

1. Create component in `src/components/`:
   ```jsx
   // src/components/MyComponent.jsx
   import React from 'react';
   
   const MyComponent = ({ prop1 }) => {
     return <div>{prop1}</div>;
   };
   
   export default MyComponent;
   ```

2. Import in App.jsx:
   ```jsx
   import MyComponent from './components/MyComponent';
   ```

3. Use in JSX:
   ```jsx
   <MyComponent prop1="value" />
   ```

### Adding New Hooks

1. Create hook in `src/hooks/`:
   ```javascript
   // src/hooks/useMyHook.js
   import { useState } from 'react';
   
   const useMyHook = () => {
     const [state, setState] = useState(null);
     return { state, setState };
   };
   
   export default useMyHook;
   ```

2. Import and use:
   ```jsx
   import useMyHook from './hooks/useMyHook';
   
   const { state, setState } = useMyHook();
   ```

### Adding New Services

1. Create service in `src/services/`:
   ```javascript
   // src/services/myService.js
   class MyService {
     static async doSomething() {
       // Implementation
     }
   }
   
   export default MyService;
   ```

2. Import and use:
   ```javascript
   import MyService from './services/myService';
   
   await MyService.doSomething();
   ```

## 🎨 Styling

### Using Tailwind Classes

All styling uses Tailwind CSS v4:

```jsx
<div className="
  bg-white rounded-lg shadow-md
  px-4 py-2
  hover:shadow-lg
  transition-shadow duration-200
">
  Content
</div>
```

### Custom Animations

Define in `src/index.css`:

```css
@keyframes myAnimation {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-myAnimation {
  animation: myAnimation 0.3s ease;
}
```

Use in components:

```jsx
<div className="animate-myAnimation">
  Animated content
</div>
```

## 🐛 Common Issues

### Build Fails

**Clear cache and rebuild**:
```bash
rm -rf node_modules/.vite dist
npm run build
```

### Extension Not Loading

1. Check `dist/manifest.json` exists
2. Verify all paths are correct
3. Check console for errors
4. Reload extension in Chrome

### Styles Not Applying

1. Ensure Tailwind classes are correct
2. Check for typos in class names
3. Verify custom classes in index.css
4. Clear browser cache

### HMR Not Working

1. Restart dev server
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check port 5173 is not in use
4. Verify vite.config.js settings

## 📊 Performance

### Bundle Size

Check bundle size:
```bash
npm run build
# Look at dist/ folder sizes
```

### Optimization Tips

1. **Code splitting**: Vite handles automatically
2. **Tree shaking**: Remove unused code
3. **Lazy loading**: Use React.lazy() for heavy components
4. **Image optimization**: Use appropriate formats
5. **Minimize dependencies**: Only use what you need

## 🚀 Deployment Checklist

Before releasing:

- [ ] Update version in `manifest.json`
- [ ] Set `ENVIRONMENT: 'production'` in config
- [ ] Run production build
- [ ] Test all features thoroughly
- [ ] Check console for errors
- [ ] Test on multiple websites
- [ ] Verify both dev and prod API endpoints
- [ ] Update CHANGELOG in README
- [ ] Create git tag for version
- [ ] Archive `dist` folder as extension package

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

## 💡 Tips

1. **Use React DevTools** for debugging component state
2. **Keep components small** and focused on one thing
3. **Document your code** with JSDoc comments
4. **Test frequently** during development
5. **Use Tailwind** for all styling - avoid custom CSS
6. **Follow the existing patterns** in the codebase
7. **Check the console** for helpful log messages

---

Happy coding! 🎉
