# Dashboard Structure

This dashboard provides a clean interface for managing job applications with two main sections:

## Features

### 1. Profile Section
- Upload Resume (PDF, DOC, DOCX)
- Upload Cover Letter (PDF, DOC, DOCX)
- Form validation
- File preview

### 2. Cover Letter Section
- Job description input (max 800 words)
- Word counter
- Generate cover letter from job description
- Copy generated cover letter to clipboard
- Clear functionality

## File Structure

```
client/src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard route page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page with link to dashboard
├── components/
│   └── dashboard/
│       ├── DashboardLayout.tsx   # Main dashboard with tab navigation
│       ├── ProfileSection.tsx    # Profile upload component
│       └── CoverLetterSection.tsx # Cover letter generator component
└── actions/
    ├── profile.ts                # Server actions for profile
    └── coverletter.ts            # Server actions for cover letter
```

## Usage

1. Navigate to `/dashboard` to access the dashboard
2. Use the tabs to switch between Profile and Cover Letter sections
3. In Profile: Upload your resume and cover letter files
4. In Cover Letter: Paste job description and generate a tailored cover letter

## Server Actions

All server actions are currently using dummy data. Replace the TODO sections with actual backend API calls:

- `submitProfile()` - Submit profile files
- `getProfile()` - Fetch user profile
- `generateCoverLetter()` - Generate cover letter from job description

## Styling

- Built with Tailwind CSS
- No additional UI libraries
- Clean, responsive design
- Proper form validation and error states
