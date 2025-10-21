# Quick Start Guide

## 🚀 Getting Started

### 1. Navigate to the client folder
```bash
cd /workspaces/Job-Application-Bot/client
```

### 2. Install dependencies (if not already done)
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open your browser
Visit: `http://localhost:3000`

## 📱 Application Flow

### Home Page (`/`)
- Landing page with a button to access the dashboard
- Shows feature overview

### Dashboard (`/dashboard`)
Two main sections accessible via tabs:

#### 1. **Profile Tab**
- Upload your resume (PDF, DOC, DOCX)
- Upload your cover letter template (PDF, DOC, DOCX)
- Submit button to save files
- Files are currently saved using dummy functions

#### 2. **Cover Letter Tab**
- Paste job description (max 800 words)
- Real-time word counter
- Click "Generate Cover Letter" to create a tailored cover letter
- Copy the generated cover letter to clipboard
- Clear to reset the form

## 🛠️ Development Notes

### Current Status
✅ All UI components built and working
✅ Tab navigation functional
✅ Form validation implemented
✅ Word counter active
✅ File upload UI ready
✅ Dummy data functions in place

### Ready for Backend Integration
All server actions are in `src/actions/` with clear TODO markers:
- `profile.ts` - Profile submission and retrieval
- `coverletter.ts` - Cover letter generation

### File Structure
```
src/
├── app/
│   ├── dashboard/page.tsx       # Dashboard page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/dashboard/
│   ├── DashboardLayout.tsx      # Main dashboard component
│   ├── ProfileSection.tsx       # Profile upload component
│   └── CoverLetterSection.tsx   # Cover letter generator
├── actions/
│   ├── profile.ts               # Profile server actions
│   └── coverletter.ts           # Cover letter server actions
└── types/
    └── dashboard.ts             # TypeScript types
```

## 🔗 Next Steps

1. **Test the UI**: Start the dev server and test all features
2. **Backend Integration**: Connect the server actions to your FastAPI backend
3. **File Storage**: Implement actual file upload (Supabase/AWS S3)
4. **AI Integration**: Connect the cover letter generator to your AI service
5. **Authentication**: Add user authentication if needed

## 💡 Tips

- All components are client-side (`'use client'`) for interactivity
- Server actions are marked with `'use server'` for Next.js
- Tailwind CSS is used for all styling
- TypeScript types are defined in `src/types/dashboard.ts`
- No external UI libraries - pure Tailwind components

## 🐛 Troubleshooting

If you encounter any issues:
1. Make sure you're in the `client` folder
2. Run `npm install` to ensure all dependencies are installed
3. Clear `.next` cache: `rm -rf .next`
4. Restart the dev server
