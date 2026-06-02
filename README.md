# AntiGravity Studio

AntiGravity Studio is an elite, futuristic, obsidian-dark landing page design platform and AI code generator. It enables developers and designers to generate premium, fully responsive web layouts, custom visual components, and landing pages using dynamic design prompts and micro-interactive styling panels.

## 🚀 Key Features

- **Elite Developer Tool Aesthetic**: A gorgeous, Vercel/Linear-inspired workspace UI featuring a glassmorphic top navigation dropdown, custom purple brand glowing sidebar actions, and vertical baseline-aligned control switches.
- **Obsidian-Dark AI Builder**: Instantly generates elite landing pages styled strictly using Tailwind CSS utility classes and modern layout patterns.
- **Visual Editor Canvas**: Allows users to preview layouts instantly and double-click/click text inline to edit copy directly. All edits sync back to the state in real-time.
- **Micro-Interactive Settings**: Real-time control panels to adjust padding, gap spacing, corner radius, fonts, light/dark modes, and color accents.
- **Undo/Redo History**: Preserves layout states during creation and styling cycles so builders can safely experiment.
- **Saved Projects Drawer**: Keeps track of generated historical drafts in localStorage so users can restore and continue refining layouts.

---

## 📸 Photographic Image Logic & Fail-safe Framework

To ensure that layouts always look premium and production-grade without displaying broken images, AntiGravity Studio runs a sophisticated two-tier visual asset framework:

### 1. Dynamic Server-Side Keyword Sanitization
- In the backend `route.ts`, the code maps prompt themes into rich comma-separated keywords and structures them into valid production Unsplash Featured queries: `https://images.unsplash.com/featured/?<KEYWORDS>`.
- Any legacy placeholders, abstract gradients, color blobs, or relative mockup references are automatically converted into valid, high-resolution live photograph requests.

### 2. Client-Side Category Fail-safes
- When the preview iframe encounters a broken URL or network load failure, a global capturing `error` event listener inspects the failed node's `src` and `alt` properties.
- It dynamically maps keywords to specific stock photos in real-time:
  - **Finance / Crypto**: Elegant blockchain and trading setups.
  - **Technology / AI**: Hardware, code editor, and clean software interfaces.
  - **Nature / Landscapes**: Green foliage and forests.
  - **Lifestyle / Fitness / Fashion**: Workout and luxury model photographs.
  - **Luxury Watches / Horology**: Close-up craft detail and luxury timepieces.
  - **Default**: A premium dark abstract texture instead of simple gradient blocks.

### 3. Smart Offline Fallbacks
If the Google Gemini API hits rate limits or safety recitation filters, the system compiles a standalone offline layout matching the user's category context:
- **SaaS & Analytics**: Metric grids and dashboard layouts.
- **Creative Portfolio**: Minimalist photography and service showcases.
- **Fitness & Wellness**: Program lists, stat trackers, and coach profiles.
- **Luxury Watches & E-commerce**: Interactive pre-order countdown timer, watch movement details, and newsletter collector forms.

---

## 🛠️ Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and specify your Gemini API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
JWT_SECRET=antigravity-studio-super-secret-key-12345
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Codebase Compilation Check
Ensure clean TypeScript types and zero syntax errors:
```bash
npx tsc --noEmit
```
