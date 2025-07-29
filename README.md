npm i
npm run dev

# Resume-Refiner

Resume-Refiner is an AI-powered resume tailoring platform that helps users optimize their resumes for specific job descriptions. Built with modern web technologies and seamless integrations, it delivers a professional, responsive, and user-friendly experience.

## 🚀 Features

- **AI Resume Tailoring:** Instantly refine your resume for any job using Cohere AI via n8n workflows.
- **Magic Link Authentication:** Secure, passwordless login powered by Supabase. Users receive a magic link via email to access their dashboard.
- **Resume History:** View, download, delete, and manage all previously tailored resumes.
- **File Upload:** Upload your resume in PDF, Word (.docx), or TXT format for instant processing.
- **Download & Share:** Download tailored resumes as PDF, copy to clipboard, or share via Web Share API (WhatsApp, email, etc.).
- **Responsive Design:** Fully responsive UI/UX for all device sizes, built with shadcn-ui and Tailwind CSS.
- **Professional Dashboard:** Track resume stats, view recent activity, and access AI insights.
- **Postman Tested:** All APIs and backend functionality are thoroughly tested using Postman.

## 🛠️ Tech Stack

**Frontend:**
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn-ui
- Web Share API
- html2pdf.js (PDF export)
- Mammoth.js, pdfjs-dist (resume file parsing)

**Backend & Integrations:**
- n8n (workflow automation, webhook handling)
- Cohere AI (LLM for resume refinement, via trial API keys)
- Supabase (authentication, magic link, database)

**Other Tools:**
- Postman (API and workflow testing)

## 📝 How It Works

1. **Authentication:**
   - User enters their email and receives a magic link via Supabase.
   - Clicking the link grants access to the dashboard.

2. **Resume Tailoring:**
   - User provides their current resume and the job description.
   - Optionally, upload a resume file (PDF, Word, TXT).
   - Data is sent to n8n via webhook, which:
     - Formats the input in a code node.
     - Sends it to Cohere AI via HTTP request node with a refined prompt.
     - Receives the tailored resume from Cohere, formats it, and returns it as JSON.
   - The tailored resume is displayed in the frontend.

3. **Resume Management:**
   - User can download the tailored resume as PDF, copy it, or share via Web Share API.
   - All tailored resumes are saved in history, where users can view, delete, or download them.

## 📦 Getting Started

### Prerequisites

- Node.js & npm (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase project & API keys
- n8n instance with Cohere API integration

### Installation

```sh
git clone <YOUR_GIT_URL>
cd resume-refiner
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file and add your API endpoints and keys as needed.

### Testing

- Use Postman to test n8n webhooks and Cohere API integration.

## 🌐 Deployment

- Deploy on [Vercel](https://vercel.com/) or your preferred platform.
- Connect a custom domain via Lovable or Vercel settings.

## 📄 License

MIT

## 💡 Future Improvements

- Real-time ATS and keyword match analytics
- Enhanced dashboard statistics
- Advanced resume insights
- One-click deployment and domain management

---

**Built with ❤️ by Esh90.**
