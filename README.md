# 🌌 AntiGravity Studio

<p align="center">
  <a href="https://antigravity-studio-gules.vercel.app/workspace" target="_blank">
    <img src="https://img.shields.io/badge/%E2%9A%A1%20Live%20Demo-Visit%20Workspace-6366F1?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/UI-Vercel%20%2F%20Linear%20Inspired-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="UI Style" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-black?style=for-the-badge&logo=google-gemini&logoColor=blue" alt="Gemini" />
</p>

---

## 🔗 Live Application URL
🚀 **Experience the future of AI web design live here:**  
👉 **[https://antigravity-studio-gules.vercel.app/workspace](https://antigravity-studio-gules.vercel.app/workspace)**

---

## 🛠️ How to Access the Builder
1. Click on the **[Live Demo](https://antigravity-studio-gules.vercel.app/workspace)** link.
2. Scroll down to the **Workspace Section** (or navigate directly to `/workspace`).
3. Enter your prompt and watch the AI compile the layout in real-time!

---

## 📸 Workspace Preview
*Here is a preview of the premium, obsidian-dark visual editor and the AI generation canvas:*

![AntiGravity Studio Workspace Preview](workspace.png)

---

## 🖤 Overview
**AntiGravity Studio** is an elite, futuristic, obsidian-dark landing page design platform and AI code generator. It empowers developers and designers to generate premium, fully responsive web layouts and custom visual components using dynamic design prompts and micro-interactive styling panels in seconds.

---

## 🚀 Key Features
* **Elite Developer Tool Aesthetic:** A gorgeous, Vercel/Linear-inspired workspace UI featuring a glassmorphic top navigation dropdown, custom purple brand glowing sidebar actions, and vertical baseline-aligned control switches.
* **Obsidian-Dark AI Builder:** Instantly generates elite landing pages styled strictly using Tailwind CSS utility classes and modern layout patterns.
* **Visual Editor Canvas:** Allows users to preview layouts instantly and double-click/click text inline to edit copy directly. All edits sync back to the state in real-time.
* **Micro-Interactive Settings:** Real-time control panels to adjust padding, gap spacing, corner radius, fonts, light/dark modes, and color accents effortlessly.
* **Undo/Redo History:** Preserves layout states during creation and styling cycles so builders can safely experiment without losing their progress.
* **Saved Projects Drawer:** Keeps track of generated historical drafts in localStorage so users can restore and continue refining layouts anytime.

---

## 📸 Photographic Image Logic & Fail-safe Framework

### 1. Dynamic Server-Side Keyword Sanitization
In the backend code, the system maps prompt themes into rich comma-separated keywords and structures them into valid production Unsplash Featured queries: `https://images.unsplash.com/featured/?<KEYWORDS>`. Legacy placeholders or abstract gradients are automatically converted into high-resolution live photograph requests.

### 2. Client-Side Category Fail-safes
When the preview iframe encounters a broken URL, a global capturing error event listener inspects the failed node's src and alt properties to map keywords to specific stock photos in real-time:
* **Finance / Crypto:** Elegant blockchain and trading setups.
* **Technology / AI:** Hardware, code editor, and clean software interfaces.
* **Nature / Landscapes:** Green foliage and forests.
* **Lifestyle / Fitness:** Workout and luxury model photographs.
* **Luxury Watches:** Close-up craft detail and luxury timepieces.
* **Default:** A premium dark abstract texture instead of simple gradient blocks.

### 3. Smart Offline Fallbacks
If the Google Gemini API hits rate limits or safety filters, the system compiles a standalone offline layout matching the user's category context:
* **SaaS & Analytics:** Metric grids and dashboard layouts.
* **Creative Portfolio:** Minimalist photography and service showcases.
* **Fitness & Wellness:** Program lists, stat trackers, and coach profiles.
* **Luxury Watches & E-commerce:** Interactive pre-order countdown timer, watch movement details, and newsletter forms.

---

## 📁 Project Structure

├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # Backend API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/      # User Login Authentication (route.ts)
│   │   │   │   └── signup/     # User Signup Authentication (route.ts)
│   │   │   └── generate-site/  # AI Site Generation & Sanitization Engine
│   │   ├── workspace/          # Main Obsidian-Dark Visual Builder UI
│   │   ├── globals.css         # Tailwind & Global Styles
│   │   ├── layout.tsx          # Root Layout with State Providers
│   │   └── page.tsx            # Application Landing Page
│   └── lib/
│       └── db.ts               # Database Connection & Configuration
├── AGENTS.md                   # AI Agents workflows and system prompts
├── next.config.ts              # Next.js Framework Configurations
├── package.json                # Project Dependencies & Scripts

---

## 🛠️ Setup & Local Development

### 1. Install Dependencies
Run the command: npm install

### 2. Configure Environment Variables
Create a .env.local file in the root directory and add your credentials:
GEMINI_API_KEY=your_google_gemini_api_key_here
JWT_SECRET=antigravity-studio-super-secret-key-12345

### 3. Run Development Server
Run the command: npm run dev
Open http://localhost:3001 in your browser to view the application.

### 4. Codebase Compilation Check
Run the command: npx tsc --noEmit

---

## 🎨 Tech Stack & Architecture
> **Frontend:** React, Next.js (App Router), Tailwind CSS  
> **AI Engine:** Google Gemini API  
> **Database Configuration:** Knex / Prisma Backend Support (db.ts)  
> **State Management:** Local History Tracking with Undo/Redo  
> **Styling System:** Fluid Glassmorphism & Obsidian Dark Theme  

---
<p align="center">Crafted with 💜 by the AntiGravity Team.</p>
