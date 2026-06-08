# 🌌 AntiGravity Studio

> **AI-Powered Website Builder**
>
> Transform simple prompts into modern, responsive landing pages in minutes.

Built for **Microsoft AI Skill Fest — Agent League Hackathon**

---

# 🚀 Overview

AntiGravity Studio is an AI-powered website generation platform that helps users create beautiful, responsive websites from natural language prompts.

Using Google Gemini AI, users can generate landing pages, customize layouts visually, edit content directly inside a live preview, and rapidly iterate without manually building frontend interfaces from scratch.

The platform is designed for developers, designers, students, founders, and creators who want to move from idea to prototype faster.

---

# 🎯 Problem Statement

Creating landing pages traditionally requires:

* Designing layouts
* Writing frontend code
* Styling components
* Finding visual assets
* Making responsive adjustments

This process can take hours.

AntiGravity Studio reduces this effort by combining AI-powered generation with real-time visual editing in a single workspace.

## Result

Generate responsive landing pages and customize them visually within minutes.

---

# ✨ Features

## 🤖 AI Website Generation

Generate complete landing pages from natural language prompts using Google Gemini AI.

Examples:

* SaaS Landing Pages
* Developer Portfolios
* Startup Websites
* Agency Websites
* Product Showcases
* Personal Brands

---

## 🎙️ Voice Prompt Support

Generate websites using voice input for a faster workflow.

---

## ✏️ Live Visual Editing

Edit website content directly inside the preview canvas.

Changes are reflected instantly.

---

## 🎨 Design Customization

Customize websites using visual controls:

* Theme
* Colors
* Typography
* Corner Radius
* Padding
* Spacing
* Layout Density

---

## 🔄 Undo / Redo History

Safely experiment with design changes while preserving previous states.

---

## 💾 Saved Projects

Store generated projects locally and continue editing later.

---

## 📱 Responsive Design

Generated websites automatically adapt to:

* Desktop
* Tablet
* Mobile

---

## 🌙 Premium Workspace Experience

Modern interface inspired by contemporary developer tools and productivity software.

---

## 🖼️ Smart Image Framework

Multi-layer image handling improves visual consistency and helps reduce broken image experiences.

---

# 🎬 Live Demo & Video

## 🚀 Live Demo

https://antigravity-studio-gules.vercel.app/workspace

## 🎥 Demo Video

https://youtu.be/YDpMD4-2H7k

---

# 📸 Screenshots

## 🔐 Login Page

![Login Page](login-page.png)

---

## 🛠️ Workspace Dashboard

![Workspace Dashboard](workspace-dashboard.png)

---

## 🚀 Generated Website Preview

![Generated Website](generated-website.png)

---

# 🏗️ Architecture Overview

```text
User Prompt / Voice Input
            │
            ▼
      Google Gemini AI
            │
            ▼
     Website Generation
            │
            ▼
      Preview Renderer
            │
            ▼
      Visual Editor UI
            │
            ▼
      Undo / Redo System
            │
            ▼
      Local Project Storage
            │
            ▼
      Responsive Website
```

---

# 🤖 GitHub Copilot Usage

GitHub Copilot was used during development for:

* Code completion
* Refactoring assistance
* Boilerplate generation
* Productivity improvements
* Debugging support

All architecture decisions, UI design, feature implementation, testing, and final project integration were completed by the developer.

---

# 🧠 How It Works

```text
1. Enter Prompt
       ↓
2. Gemini AI Generation
       ↓
3. Website Structure Creation
       ↓
4. Live Preview Rendering
       ↓
5. Visual Editing
       ↓
6. Save Project
       ↓
7. Final Website
```

---

# 📸 Smart Image Framework

AntiGravity Studio uses a layered image-handling strategy.

### Dynamic Keyword Generation

Prompt context is analyzed to create image search keywords.

### Category-Aware Fallbacks

Fallback handling supports categories such as:

* Technology
* AI
* Business
* Finance
* Healthcare
* Travel
* Fitness
* E-Commerce

### Offline Layout Support

When AI services are unavailable, category-specific layouts help maintain usability.

---

# 💻 Tech Stack

| Layer                 | Technology        |
| --------------------- | ----------------- |
| Frontend              | Next.js           |
| UI                    | React             |
| Language              | TypeScript        |
| Styling               | Tailwind CSS      |
| AI                    | Google Gemini API |
| State Management      | React Hooks       |
| Storage               | Local Storage     |
| Deployment            | Vercel            |
| Development Assistant | GitHub Copilot    |

---

# 🛠️ Local Development

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create:

```env
.env.local
```

Add:

```env
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_secret_key
```

## Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3001
```

## Type Checking

```bash
npx tsc --noEmit
```

## Production Build

```bash
npm run build
npm start
```

---

# 📂 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   └── generate-site/
│   ├── workspace/
│   ├── page.tsx
│   └── layout.tsx
│
├── lib/
│
├── public/
│
README.md
package.json
next.config.ts
```

---

# 📊 Why This Project Matters

| Area                 | Impact                                        |
| -------------------- | --------------------------------------------- |
| AI Integration       | Gemini-powered website generation             |
| Productivity         | Faster prototyping                            |
| Responsive Design    | Mobile-friendly layouts                       |
| Visual Editing       | Real-time customization                       |
| Developer Experience | Modern workspace                              |
| Practical Utility    | Useful for developers, startups, and students |

---

# 🏆 Hackathon Information

| Field     | Value                                                 |
| --------- | ----------------------------------------------------- |
| Event     | Microsoft AI Skill Fest — Agent League Hackathon      |
| Category  | AI-Powered Developer Tools                            |
| Developer | Gaurav Kumar                                          |
| Status    | Submission Ready ✅                                    |
| GitHub    | https://github.com/gauravbuildz                       |
| Live Demo | https://antigravity-studio-gules.vercel.app/workspace |

---

# 🚀 Future Roadmap

* Multi-page website generation
* One-click deployment
* Export to additional frameworks
* Cloud project synchronization
* Team collaboration
* Template marketplace
* Enhanced AI customization

---

# 👨‍💻 Author

## Gaurav Kumar

GitHub:

https://github.com/gauravbuildz

Project:

AntiGravity Studio

Built for Microsoft AI Skill Fest — Agent League Hackathon.

---

# 📄 License

MIT License

---

# 🙏 Acknowledgments

* Google Gemini API
* GitHub Copilot
* Next.js
* React
* Tailwind CSS
* Vercel
* Microsoft AI Skill Fest

---

**Built with ❤️ by Gaurav Kumar**
