# 🚀 AntiGravity Studio

### AI-Powered Website Generation Platform

Transform natural language prompts into beautiful, responsive, production-ready websites in minutes.

[🌐 Live Demo](https://antigravity-studio-gules.vercel.app/workspace)

---

## ✨ Overview

AntiGravity Studio is an AI-powered website builder that enables users to generate modern, responsive landing pages from simple text prompts.

Powered by **Google Gemini AI**, the platform combines intelligent website generation, live visual editing, responsive layouts, project persistence, and design customization into a unified developer experience.

Whether you're a developer, founder, student, designer, or creator, AntiGravity Studio helps transform ideas into polished web experiences faster than traditional workflows.

---

## 🔥 Key Highlights

* 🤖 AI-powered website generation
* 🎙️ Voice-to-Website workflow
* ✏️ Live visual editing
* 🎨 Real-time customization controls
* 📱 Mobile-first responsive layouts
* 💾 Saved project management
* 🔄 Undo / Redo support
* ⚡ Fast iteration workflow
* 🖼️ Smart image handling system
* 🌙 Premium developer-focused interface

---

## 🎯 Problem Statement

Building landing pages traditionally requires:

* Designing layouts
* Writing frontend code
* Managing responsiveness
* Styling components
* Iterating on content
* Finding suitable visuals

This process often consumes significant development time.

### Our Solution

AntiGravity Studio automates website generation while still providing full visual control through a powerful editing workspace.

Users can generate, customize, preview, and refine websites without manually building every component from scratch.

---

## 🌟 Features

### 🤖 AI Website Generation

Generate complete websites using natural language prompts powered by Google Gemini AI.

Examples:

* SaaS Websites
* Developer Portfolios
* Startup Landing Pages
* Agency Websites
* Product Showcases
* Personal Brands

---

### 🎙️ Voice Prompt Support

Generate websites using voice input for a faster and more accessible workflow.

---

### ✏️ Live Visual Editing

Edit website content directly inside the generated preview.

Changes are reflected instantly without rebuilding the page.

---

### 🎨 Design Customization

Customize:

* Typography
* Theme
* Color Accents
* Border Radius
* Layout Density
* Padding
* Spacing

using visual controls.

---

### 🔄 Undo / Redo History

Safely experiment with layouts while preserving previous states.

---

### 💾 Saved Projects

Store generated websites locally and continue editing later.

---

### 📱 Responsive Design

Generated websites automatically adapt to:

* Desktop
* Tablet
* Mobile

---

### 🖼️ Smart Image Handling

The platform includes category-aware image handling and fallback strategies to improve visual consistency across generated websites.

---

## 🎬 Demo

### 🌐 Live Application

https://antigravity-studio-gules.vercel.app/workspace

---

## 📸 Screenshots

### 🔐 Login Experience

![Login Page](login-page.png)

---

### 🛠️ Workspace Dashboard

![Workspace Dashboard](workspace-dashboard.png)

---

### 🚀 Generated Website Preview

![Generated Website](generated-website.png)

---

## 🏗️ Architecture Overview

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
      Visual Editor
            │
            ▼
      Undo / Redo Engine
            │
            ▼
      Local Storage
            │
            ▼
      Responsive Website
```

---

## ⚙️ How It Works

```text
1. Enter Prompt
        ↓
2. AI Processing
        ↓
3. Website Generation
        ↓
4. Live Preview
        ↓
5. Visual Customization
        ↓
6. Save & Refine
        ↓
7. Final Website
```

---

## 🤖 GitHub Copilot Usage

GitHub Copilot was used during development for:

* Code completion
* Refactoring assistance
* Boilerplate generation
* Debugging support
* Productivity improvements

All architecture decisions, feature implementation, testing, and final integration were completed by the developer.

---

## 💻 Tech Stack

| Layer                 | Technology        |
| --------------------- | ----------------- |
| Frontend              | Next.js           |
| Framework             | React             |
| Language              | TypeScript        |
| Styling               | Tailwind CSS      |
| AI Engine             | Google Gemini API |
| State Management      | React Hooks       |
| Storage               | Local Storage     |
| Deployment            | Vercel            |
| Development Assistant | GitHub Copilot    |

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   └── generate-site/
│   ├── workspace/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── db.ts
│
AGENTS.md
README.md
package.json
next.config.ts
```

---

## 📘 Additional Documentation

The repository includes an `AGENTS.md` file containing project-specific development notes and implementation guidance.

---

## 🛠️ Local Development

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_secret_key
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3001
```

### Type Checking

```bash
npx tsc --noEmit
```

### Production Build

```bash
npm run build
npm start
```

---

## 📈 Impact

| Area                    | Benefit                                       |
| ----------------------- | --------------------------------------------- |
| ⚡ Productivity          | Faster website prototyping                    |
| 🤖 AI Integration       | Prompt-driven generation                      |
| 🎨 UX                   | Real-time customization                       |
| 📱 Accessibility        | Responsive layouts                            |
| 🚀 Developer Experience | Modern workflow                               |
| 💼 Practical Utility    | Useful for startups, developers, and creators |

---

## 🔮 Future Roadmap

* Multi-page website generation
* Exportable production code
* Cloud synchronization
* Team collaboration
* Template marketplace
* One-click deployment
* Advanced AI customization

---

## 👨‍💻 Developer

**Gaurav Kumar**

GitHub: https://github.com/gauravbuildz

Built for **Microsoft AI Skill Fest — Agent League Hackathon**

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

* Google Gemini API
* GitHub Copilot
* Next.js
* React
* Tailwind CSS
* Vercel
* Microsoft AI Skill Fest

---

### ⭐ If you found this project interesting, consider giving it a star on GitHub.


**Built with ❤️ by Gaurav Kumar**
