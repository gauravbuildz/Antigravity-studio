'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Code, 
  Eye, 
  Download, 
  AlertTriangle, 
  Copy, 
  Check, 
  Cpu, 
  Globe, 
  ArrowRight,
  Code2,
  Terminal,
  Monitor,
  Smartphone,
  Tablet,
  History,
  Trash2,
  Plus,
  Send,
  ChevronDown,
  Sliders,
  Undo,
  Mic
} from 'lucide-react';

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  onresult: (event: { resultIndex: number; results: { isFinal: boolean; [key: number]: { transcript: string } }[] }) => void;
  start: () => void;
  stop: () => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface SavedProject {
  id: string;
  title: string;
  prompt: string;
  html: string;
  chatHistory: ChatMessage[];
  timestamp: number;
}

// Helper function to inject inline contenteditable scripts and initial theme settings
const injectEditableScript = (
  htmlString: string, 
  initialDarkMode: boolean, 
  initialAccent: string,
  initialPadding: number,
  initialGap: number,
  initialRadius: number,
  initialFont: string,
  initialThemeTint: string
) => {
  if (!htmlString) return '';
  
  let processedHtml = htmlString;
  const earlyFallbackScript = `
<script id="antigravity-img-fallback">
  (function() {
    const CATEGORICAL_IMAGES = {
      fashion: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8d?q=80&w=800',
        'https://images.unsplash.com/photo-1544441893-675973731853?q=80&w=800',
        'https://images.unsplash.com/photo-1509631179647-0177334093ab?q=80&w=800'
      ],
      finance: [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200',
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200',
        'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200'
      ],
      tech: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200'
      ],
      nature: [
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1472214222541-d510753a49d9?q=80&w=1200',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200'
      ],
      fitness: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200'
      ],
      watch: [
        'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200',
        'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1200',
        'https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=1200'
      ],
      food: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200',
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200',
        'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200',
        'https://images.unsplash.com/photo-1493770308161-fd81a649fbb6?q=80&w=1200'
      ],
      travel: [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200'
      ],
      fallback: [
        'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
        'https://images.unsplash.com/photo-1618005198143-e528346d9a59?q=80&w=1200',
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200'
      ]
    };

    window.addEventListener('error', function(event) {
      if (event && event.target && event.target.tagName === 'IMG') {
        const img = event.target;
        const altText = img.getAttribute('alt') || 'Visual Asset';
        
        if (!img.dataset.unsplashFallbackTried) {
          img.dataset.unsplashFallbackTried = "true";
          const src = img.getAttribute('src') || '';
          const checkStr = (src + ' ' + altText).toLowerCase();
          
          let category = 'fallback';
          if (checkStr.includes('crypto') || checkStr.includes('blockchain') || checkStr.includes('coin') || checkStr.includes('bitcoin') || checkStr.includes('finance') || checkStr.includes('trading') || checkStr.includes('money') || checkStr.includes('market') || checkStr.includes('wallet')) {
            category = 'finance';
          } else if (checkStr.includes('watch') || checkStr.includes('time') || checkStr.includes('clock') || checkStr.includes('luxury') || checkStr.includes('horology') || checkStr.includes('caliber')) {
            category = 'watch';
          } else if (checkStr.includes('fashion') || checkStr.includes('apparel') || checkStr.includes('clothing') || checkStr.includes('wear') || checkStr.includes('dress') || checkStr.includes('model') || checkStr.includes('editorial')) {
            category = 'fashion';
          } else if (checkStr.includes('fitness') || checkStr.includes('workout') || checkStr.includes('gym') || checkStr.includes('health') || checkStr.includes('sport') || checkStr.includes('running') || checkStr.includes('athlete') || checkStr.includes('yoga')) {
            category = 'fitness';
          } else if (checkStr.includes('tech') || checkStr.includes('ai') || checkStr.includes('software') || checkStr.includes('digital') || checkStr.includes('quantum') || checkStr.includes('computer') || checkStr.includes('code') || checkStr.includes('developer') || checkStr.includes('data') || checkStr.includes('network') || checkStr.includes('analytics') || checkStr.includes('dashboard') || checkStr.includes('graph')) {
            category = 'tech';
          } else if (checkStr.includes('nature') || checkStr.includes('plant') || checkStr.includes('eco') || checkStr.includes('garden') || checkStr.includes('landscape') || checkStr.includes('forest') || checkStr.includes('tree') || checkStr.includes('green')) {
            category = 'nature';
          } else if (checkStr.includes('food') || checkStr.includes('restaurant') || checkStr.includes('gourmet') || checkStr.includes('meal') || checkStr.includes('eat') || checkStr.includes('cooking') || checkStr.includes('recipe')) {
            category = 'food';
          } else if (checkStr.includes('travel') || checkStr.includes('tour') || checkStr.includes('adventure') || checkStr.includes('trip') || checkStr.includes('scenery') || checkStr.includes('beach') || checkStr.includes('vacation')) {
            category = 'travel';
          } else if (checkStr.includes('portfolio') || checkStr.includes('agency') || checkStr.includes('designer') || checkStr.includes('studio') || checkStr.includes('creative') || checkStr.includes('minimalist') || checkStr.includes('design') || checkStr.includes('aesthetic') || checkStr.includes('banner')) {
            category = 'fallback';
          }
          
          const arr = CATEGORICAL_IMAGES[category] || CATEGORICAL_IMAGES.fallback;
          const randomIndex = Math.floor(Math.random() * arr.length);
          img.src = arr[randomIndex];
        } else {
          // Second failure: replace with icon + premium typography container
          const parent = img.parentNode;
          if (parent) {
            const container = document.createElement('div');
            container.className = (img.className || '') + ' flex flex-col items-center justify-center bg-neutral-900 border border-neutral-800 p-6 min-h-[12rem] text-center';
            container.style.cssText = img.style.cssText;
            container.style.padding = '24px';
            container.style.gap = '12px';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            
            const svgIcon = \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>\`;
            container.innerHTML = \`
              \${svgIcon}
              <span class="text-[10px] font-mono text-neutral-400 tracking-wider uppercase font-semibold">\${altText}</span>
            \`;
            parent.replaceChild(container, img);
          }
        }
      }
    }, true);
  })();
</script>
`;

  if (processedHtml.includes('<head>')) {
    processedHtml = processedHtml.replace('<head>', `<head>${earlyFallbackScript}`);
  } else if (processedHtml.includes('<body>')) {
    processedHtml = processedHtml.replace('<body>', `<body>${earlyFallbackScript}`);
  } else {
    processedHtml = earlyFallbackScript + processedHtml;
  }
  
  const scriptContent = `
<script>
  (function() {
    const initialDarkMode = ${initialDarkMode};
    const initialAccent = "${initialAccent}";
    const initialPadding = ${initialPadding};
    const initialGap = ${initialGap};
    const initialRadius = ${initialRadius};
    const initialFont = "${initialFont}";
    const initialThemeTint = "${initialThemeTint}";

    function applyThemeSettings(darkMode, accent, padding, gap, radius, font, themeTint) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
        const lightStyle = document.getElementById('light-mode-override');
        if (lightStyle) lightStyle.remove();
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        
        let lightStyle = document.getElementById('light-mode-override');
        if (!lightStyle) {
          lightStyle = document.createElement('style');
          lightStyle.id = 'light-mode-override';
          document.head.appendChild(lightStyle);
        }
        lightStyle.innerHTML = \`
          html, body {
            background-color: #f8fafc !important;
            color: #0f172a !important;
          }
          .bg-slate-950, .bg-slate-900, .bg-gray-950, .bg-black, .bg-zinc-950, .bg-slate-900\\\\/40, .bg-slate-955\\\\/40, .bg-slate-950\\\\/40 {
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          .bg-slate-900\\\\/50, .bg-slate-900\\\\/80, .bg-slate-955\\\\/85, .bg-slate-950\\\\/80 {
            background-color: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(12px) !important;
          }
          .border-slate-900, .border-slate-800, .border-gray-900, .border-slate-800\\\\/80 {
            border-color: #e2e8f0 !important;
          }
          .text-slate-400, .text-gray-400, .text-zinc-400, .text-slate-500 {
            color: #475569 !important;
          }
          .text-slate-300, .text-gray-300, .text-zinc-300 {
            color: #334155 !important;
          }
          .text-slate-100, .text-white, .text-slate-50 {
            color: #0f172a !important;
          }
          .bg-gradient-to-tr, .bg-gradient-to-r {
            color: #ffffff !important;
          }
          .bg-gradient-to-tr .text-slate-100, .bg-gradient-to-r .text-white {
            color: #ffffff !important;
          }
        \`;
      }
      
      if (accent === 'none') {
        document.documentElement.style.filter = 'none';
      } else if (accent === 'emerald') {
        document.documentElement.style.filter = 'hue-rotate(120deg) saturate(1.1)';
      } else if (accent === 'cyan') {
        document.documentElement.style.filter = 'hue-rotate(180deg) saturate(1.2)';
      } else if (accent === 'orange') {
        document.documentElement.style.filter = 'hue-rotate(30deg) saturate(1.2)';
      }

      // Spacing & Corner Radius & Font overrides
      let layoutStyle = document.getElementById('studio-layout-override');
      if (!layoutStyle) {
        layoutStyle = document.createElement('style');
        layoutStyle.id = 'studio-layout-override';
        document.head.appendChild(layoutStyle);
      }

      let fontImport = '';
      let fontFamilyRule = '';
      if (font === 'outfit') {
        fontImport = '@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap");';
        fontFamilyRule = 'font-family: "Outfit", sans-serif !important;';
      } else if (font === 'space-grotesk') {
        fontImport = '@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap");';
        fontFamilyRule = 'font-family: "Space Grotesk", sans-serif !important;';
      } else if (font === 'playfair') {
        fontImport = '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap");';
        fontFamilyRule = 'font-family: "Playfair Display", serif !important;';
      } else {
        fontImport = '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");';
        fontFamilyRule = 'font-family: "Inter", sans-serif !important;';
      }

      // Apply theme tint styles
      let tintStyle = '';
      if (themeTint === 'emerald-tint') {
        tintStyle = \`
          body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
            pointer-events: none;
            z-index: 9999;
          }
        \`;
      } else if (themeTint === 'neon-sunset') {
        tintStyle = \`
          body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 90% 10%, rgba(244, 114, 182, 0.06) 0%, rgba(249, 115, 22, 0.03) 40%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
          }
        \`;
      } else if (themeTint === 'obsidian') {
        tintStyle = \`
          body {
            background-color: #050507 !important;
          }
          .bg-slate-950, .bg-black, .bg-zinc-950 {
            background-color: #0c0c0e !important;
          }
          .border-slate-900, .border-slate-800, .border-neutral-900 {
            border-color: rgba(255, 255, 255, 0.05) !important;
          }
        \`;
      }

      layoutStyle.innerHTML = \`
        \${fontImport}
        body {
          \${fontFamilyRule}
        }
        /* Spacing Padding overrides */
        section, header, footer, .py-12, .py-16, .py-20, .py-24, .py-32 {
          padding-top: max(20px, calc(\${padding}px * 2.5)) !important;
          padding-bottom: max(20px, calc(\${padding}px * 2.5)) !important;
        }
        .px-6, .px-8, .px-12 {
          padding-left: max(8px, \${padding}px) !important;
          padding-right: max(8px, \${padding}px) !important;
        }
        /* Gap / Spacing overrides */
        .gap-6, .gap-8, .gap-10, .gap-12, .space-x-6, .space-y-6, .gap-4, .gap-5 {
          gap: \${gap}px !important;
        }
        /* Border Radius overrides */
        button, .rounded-lg, .rounded-xl, .rounded-2xl, .rounded-3xl, .rounded-md, img, .card, select, input {
          border-radius: \${radius}px !important;
        }
        \${tintStyle}
      \`;
    }

    function initEditable() {
      // Global Image Fallback captured by earlyFallbackScript on window

      applyThemeSettings(initialDarkMode, initialAccent, initialPadding, initialGap, initialRadius, initialFont, initialThemeTint);

      window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'UPDATE_THEME') {
          applyThemeSettings(
            e.data.darkMode, 
            e.data.accent,
            e.data.padding !== undefined ? e.data.padding : initialPadding,
            e.data.gap !== undefined ? e.data.gap : initialGap,
            e.data.radius !== undefined ? e.data.radius : initialRadius,
            e.data.font !== undefined ? e.data.font : initialFont,
            e.data.themeTint !== undefined ? e.data.themeTint : initialThemeTint
          );
        }
      });

      const selectors = 'h1, h2, h3, h4, h5, h6, p, span, li, a, button';
      const elements = document.querySelectorAll(selectors);
      elements.forEach(el => {
        if (el.tagName === 'A' && el.querySelector('svg, img')) return;
        if (el.tagName === 'BUTTON' && el.querySelector('svg, img')) return;
        
        el.setAttribute('contenteditable', 'true');
        el.style.transition = 'outline 0.15s ease-in-out, box-shadow 0.15s ease-in-out';
        
        el.addEventListener('mouseenter', () => {
          if (document.activeElement !== el) {
            el.style.outline = '1px dashed #6366f1';
            el.style.outlineOffset = '2px';
          }
        });
        
        el.addEventListener('mouseleave', () => {
          if (document.activeElement !== el) {
            el.style.outline = 'none';
          }
        });
        
        el.addEventListener('focus', () => {
          el.style.outline = '2px solid #6366f1';
          el.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', () => {
          el.style.outline = 'none';
          el.style.outlineOffset = '';
          el.style.transition = '';
          
          setTimeout(() => {
            const cleanHtml = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
            window.parent.postMessage({ type: 'HTML_CHANGED', html: cleanHtml }, '*');
          }, 50);
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initEditable);
    } else {
      initEditable();
    }
  })();
</script>
`;

  if (processedHtml.includes('</body>')) {
    return processedHtml.replace('</body>', `${scriptContent}\n</body>`);
  } else {
    return `${processedHtml}\n${scriptContent}`;
  }
};

// Strips the editing script and contenteditable properties to return perfect clean output
const cleanExportHtml = (html: string) => {
  if (!html) return '';
  let clean = html.replace(/<script id="antigravity-img-fallback">[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/<script>\s*\(function\(\)\s*\{\s*const\s+initialDarkMode[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/\s*contenteditable="true"/gi, '');
  return clean.trim();
};

export default function WebsiteBuilder() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [codeHistory, setCodeHistory] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKeyWarning, setShowKeyWarning] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  // States
  const [deviceWidth, setDeviceWidth] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewDarkMode, setPreviewDarkMode] = useState<boolean>(true);
  const [selectedAccent, setSelectedAccent] = useState<'none' | 'emerald' | 'cyan' | 'orange'>('none');
  const [spacingPadding, setSpacingPadding] = useState<number>(16);
  const [spacingGap, setSpacingGap] = useState<number>(16);
  const [cornerRadius, setCornerRadius] = useState<number>(8);
  const [selectedFont, setSelectedFont] = useState<string>('sans');
  const [selectedThemeTint, setSelectedThemeTint] = useState<string>('obsidian');

  // Sidebar Refinement states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  // Saved Projects states
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [showProjectsDrawer, setShowProjectsDrawer] = useState(false);

  // Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [isRefineListening, setIsRefineListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const refineRecognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Save/Update projects inside LocalStorage
  const saveProject = (html: string, originalPrompt: string, idToUpdate?: string | null, activeHistory?: ChatMessage[]) => {
    try {
      const projectsJson = localStorage.getItem('antigravity_projects');
      let projects: SavedProject[] = projectsJson ? JSON.parse(projectsJson) : [];
      
      const historyToSave = activeHistory || [];

      if (idToUpdate) {
        projects = projects.map(p => {
          if (p.id === idToUpdate) {
            return {
              ...p,
              html: html,
              chatHistory: historyToSave,
              timestamp: Date.now()
            };
          }
          return p;
        });
      } else {
        let title = originalPrompt.trim().split(' ').slice(0, 5).join(' ');
        if (title.length > 30) title = title.substring(0, 30) + '...';
        
        const newId = Math.random().toString(36).substring(2, 9);
        const newProject: SavedProject = {
          id: newId,
          title: title || 'Untitled Project',
          prompt: originalPrompt,
          html: html,
          chatHistory: historyToSave,
          timestamp: Date.now()
        };
        projects.unshift(newProject);
        setCurrentProjectId(newId);
        idToUpdate = newId;
      }
      
      localStorage.setItem('antigravity_projects', JSON.stringify(projects));
      setSavedProjects(projects);
    } catch (e) {
      console.error('Failed to save project:', e);
    }
  };

  // Suggested prompts
  const suggestions = [
    {
      title: 'SaaS Platform Dashboard',
      description: 'Quantum Analytics with clean dark tables, metric cards, and charts.',
      prompt: 'A modern SaaS landing page for an AI Analytics tool called AetherMetrics, featuring dark glassmorphism, animated metric blocks, interactive sliders, clear pricing grid, and FAQs.'
    },
    {
      title: 'Elite Agency Portfolio',
      description: 'Stunning designer portfolio with sleek headers and project grids.',
      prompt: 'A breathtaking portfolio landing page for a creative design agency called NovaStudio, showcasing interactive project cards, team grid, contact form, and smooth typography.'
    },
    {
      title: 'Fitness & Health WebApp',
      description: 'Vibrant green accent health trackers and routine calculators.',
      prompt: 'A premium landing page for a health & fitness tracking platform named PulseFit, with rich emerald color palettes, routine grids, trainer profile showcases, and pricing.'
    }
  ];

  // Auth Guard verification on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('antigravity_token');
      const storedEmail = localStorage.getItem('antigravity_user_email');
      if (!token) {
        router.push('/');
      } else {
        setTimeout(() => {
          setIsAuthenticated(true);
          if (storedEmail) setUserEmail(storedEmail);
        }, 0);
      }
    }
  }, [router]);

  // Speech Recognition management
  const startSpeechRecognition = (
    setListening: React.Dispatch<React.SetStateAction<boolean>>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    recRef: React.MutableRefObject<SpeechRecognitionInstance | null>
  ) => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI = 
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition || 
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert('Your browser does not support the Web Speech API. Please use Google Chrome or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onerror = (event: { error: string }) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'network') {
          setError('Speech Recognition Network Error: Web Speech API requires internet access to connect to transcription servers. Please verify your connection or try Google Chrome.');
        } else if (event.error === 'not-allowed') {
          setError('Speech Recognition Permission Error: Microphone access was blocked. Please grant microphone permissions in your browser.');
        } else if (event.error !== 'no-speech') {
          setError(`Speech Recognition Error: ${event.error}`);
        }
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.onresult = (event: { resultIndex: number; results: { isFinal: boolean; [key: number]: { transcript: string } }[] }) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setValue(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript.trim()}` : transcript.trim();
          });
        }
      };

      recRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
    }
  };

  const stopSpeechRecognition = (
    setListening: React.Dispatch<React.SetStateAction<boolean>>,
    recRef: React.MutableRefObject<SpeechRecognitionInstance | null>
  ) => {
    if (recRef.current) {
      recRef.current.stop();
    }
    setListening(false);
  };

  const handleMicClick = () => {
    if (isListening) {
      stopSpeechRecognition(setIsListening, recognitionRef);
    } else {
      if (isRefineListening) {
        stopSpeechRecognition(setIsRefineListening, refineRecognitionRef);
      }
      startSpeechRecognition(setIsListening, setPrompt, recognitionRef);
    }
  };

  const handleRefineMicClick = () => {
    if (isRefineListening) {
      stopSpeechRecognition(setIsRefineListening, refineRecognitionRef);
    } else {
      if (isListening) {
        stopSpeechRecognition(setIsListening, recognitionRef);
      }
      startSpeechRecognition(setIsRefineListening, setRefinePrompt, refineRecognitionRef);
    }
  };

  // Clean up speech recognition on unmount
  useEffect(() => {
    const currentRec = recognitionRef.current;
    const currentRefineRec = refineRecognitionRef.current;
    return () => {
      if (currentRec) currentRec.stop();
      if (currentRefineRec) currentRefineRec.stop();
    };
  }, []);

  // Load projects from local storage on mount
  useEffect(() => {
    try {
      const projectsJson = localStorage.getItem('antigravity_projects');
      if (projectsJson) {
        setTimeout(() => {
          setSavedProjects(JSON.parse(projectsJson));
        }, 0);
      }
    } catch (e) {
      console.error('Failed to load projects:', e);
    }
  }, []);

  // Auto-hide warning toast after 8 seconds
  useEffect(() => {
    if (showKeyWarning) {
      const timer = setTimeout(() => setShowKeyWarning(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showKeyWarning]);

  // Synchronize Live editable text updates back into parent React state
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'HTML_CHANGED') {
        const updatedHtml = event.data.html;
        setGeneratedHtml(current => {
          setCodeHistory(prev => [...prev, current]);
          return updatedHtml;
        });
        
        if (currentProjectId) {
          saveProject(updatedHtml, prompt, currentProjectId, chatHistory);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentProjectId, prompt, chatHistory]);

  // Post real-time theme shifts (Dark/Light and Color Accents) directly to the iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_THEME',
        darkMode: previewDarkMode,
        accent: selectedAccent,
        padding: spacingPadding,
        gap: spacingGap,
        radius: cornerRadius,
        font: selectedFont,
        themeTint: selectedThemeTint
      }, '*');
    }
  }, [previewDarkMode, selectedAccent, spacingPadding, spacingGap, cornerRadius, selectedFont, selectedThemeTint, generationCount, viewMode]);

  // saveProject declaration was moved to states section above

  // Delete a project from history
  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const projectsJson = localStorage.getItem('antigravity_projects');
      let projects: SavedProject[] = projectsJson ? JSON.parse(projectsJson) : [];
      projects = projects.filter(p => p.id !== id);
      localStorage.setItem('antigravity_projects', JSON.stringify(projects));
      setSavedProjects(projects);
      
      if (currentProjectId === id) {
        setGeneratedHtml('');
        setCurrentProjectId(null);
        setChatHistory([]);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  // Select a past project
  const loadProject = (project: SavedProject) => {
    setGeneratedHtml(project.html);
    setPrompt(project.prompt);
    setCurrentProjectId(project.id);
    setChatHistory(project.chatHistory || [
      { role: 'user', parts: [{ text: `Create a landing page for: ${project.prompt}` }] },
      { role: 'model', parts: [{ text: project.html }] }
    ]);
    setShowProjectsDrawer(false);
    setGenerationCount(prev => prev + 1);
  };

  // Initial generation submission
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    // Stop listening before submitting
    if (isListening) stopSpeechRecognition(setIsListening, recognitionRef);

    setIsGenerating(true);
    setError(null);
    setShowKeyWarning(false);
    setViewMode('preview');

    try {
      const token = localStorage.getItem('antigravity_token');
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const htmlContent = await response.text();
      setGeneratedHtml(current => {
        setCodeHistory(prev => [...prev, current]);
        return htmlContent;
      });
      setGenerationCount(prev => prev + 1);

      const initialHistory: ChatMessage[] = [
        { role: 'user', parts: [{ text: `Create a landing page for: ${prompt}` }] },
        { role: 'model', parts: [{ text: htmlContent }] }
      ];
      setChatHistory(initialHistory);

      saveProject(htmlContent, prompt, null, initialHistory);

      const fallbackHeader = response.headers.get('X-Generated-Fallback');
      if (fallbackHeader === 'true') {
        setShowKeyWarning(true);
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while compiling your site. Please check your network and configuration.';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Refine / Chat revision submission
  const handleRefine = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!refinePrompt.trim() || isRefining || !generatedHtml) return;

    // Stop listening before submitting
    if (isRefineListening) stopSpeechRecognition(setIsRefineListening, refineRecognitionRef);

    setIsRefining(true);
    setError(null);
    setViewMode('preview');

    const promptToSend = refinePrompt;
    setRefinePrompt('');

    const nextHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', parts: [{ text: promptToSend }] }
    ];
    setChatHistory(nextHistory);

    try {
      const token = localStorage.getItem('antigravity_token');
      const formattedHistory = nextHistory.map((item, idx) => {
        if (item.role === 'model' && idx === nextHistory.length - 2) {
          return {
            role: 'model',
            parts: [{ text: generatedHtml }]
          };
        }
        return item;
      });

      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: promptToSend,
          history: formattedHistory
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const updatedHtml = await response.text();
      setGeneratedHtml(current => {
        setCodeHistory(prev => [...prev, current]);
        return updatedHtml;
      });
      setGenerationCount(prev => prev + 1);

      const updatedHistory: ChatMessage[] = [
        ...nextHistory,
        { role: 'model', parts: [{ text: updatedHtml }] }
      ];
      setChatHistory(updatedHistory);

      if (currentProjectId) {
        saveProject(updatedHtml, prompt, currentProjectId, updatedHistory);
      }

    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while refining your website. Please check your network.';
      setError(errorMessage);
      setChatHistory(chatHistory);
    } finally {
      setIsRefining(false);
    }
  };

  const handleUndo = () => {
    if (codeHistory.length > 0) {
      const previousHtml = codeHistory[codeHistory.length - 1];
      setCodeHistory(prev => prev.slice(0, -1));
      setGeneratedHtml(previousHtml);
      setGenerationCount(prev => prev + 1);

      let nextChatHistory = chatHistory;
      if (chatHistory.length > 2) {
        const lastMessage = chatHistory[chatHistory.length - 1];
        if (lastMessage && lastMessage.role === 'model' && lastMessage.parts?.[0]?.text === generatedHtml) {
          nextChatHistory = chatHistory.slice(0, -2);
          setChatHistory(nextChatHistory);
        }
      }

      if (currentProjectId) {
        saveProject(previousHtml, prompt, currentProjectId, nextChatHistory);
      }
    }
  };

  const resetWorkspace = () => {
    setGeneratedHtml('');
    setPrompt('');
    setRefinePrompt('');
    setCurrentProjectId(null);
    setChatHistory([]);
    setCodeHistory([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleRefineKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRefine();
    }
  };

  const copyToClipboard = () => {
    if (!generatedHtml) return;
    const cleanHtml = cleanExportHtml(generatedHtml);
    navigator.clipboard.writeText(cleanHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportHtml = () => {
    if (!generatedHtml) return;
    const cleanHtml = cleanExportHtml(generatedHtml);
    const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'index.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('antigravity_token');
    localStorage.removeItem('antigravity_user_email');
    router.push('/');
  };

  const getDeviceWidthClass = () => {
    switch (deviceWidth) {
      case 'mobile':
        return 'w-[375px] max-w-full';
      case 'tablet':
        return 'w-[768px] max-w-full';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const lines = cleanExportHtml(generatedHtml).split('\n');

  return (
    <div className="min-h-screen bg-[#050507] text-[#f8fafc] flex flex-col relative overflow-hidden bg-dot-grid font-sans animate-fade-in">
      
      {/* Glowing backdrop elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none"></div>

      {/* TOP NAVBAR */}
      <nav className="h-16 border-b border-white/5 bg-[#0C0C0E] flex items-center justify-between px-6 sticky top-0 z-50 select-none">
        {/* Left Side: Projects dropdown button */}
        <div className="w-1/3 flex items-center justify-start">
          <button
            onClick={() => setShowProjectsDrawer(prev => !prev)}
            className="h-8 px-3 rounded-lg border border-neutral-800 bg-neutral-900/60 backdrop-blur-md hover:bg-neutral-900/80 text-neutral-400 hover:text-white transition-all flex items-center space-x-1.5 text-[11px] font-normal tracking-wide shadow-sm cursor-pointer"
            title="My Saved Projects History"
          >
            <History className="w-3 h-3 text-neutral-500" />
            <span>My Saved Projects</span>
            {savedProjects.length > 0 && (
              <span className="text-neutral-500 font-mono text-[9px] font-normal">
                ({savedProjects.length})
              </span>
            )}
            <ChevronDown className={`w-3 h-3 text-neutral-500 transition-transform duration-200 ${showProjectsDrawer ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Center Side: Logo & Name */}
        <div className="w-1/3 flex items-center justify-center">
          <div className="flex items-center space-x-2.5 cursor-default">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-[10px] bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full pulse-dot"></div>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              AntiGravity Studio
            </span>
          </div>
        </div>

        {/* Right Side: Actions, User Email & Logout */}
        <div className="w-1/3 flex items-center justify-end space-x-4">
          {generatedHtml && (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative bg-[#050507] border border-white/5 p-0.5 rounded-lg flex items-center h-8">
                <button 
                  onClick={() => setViewMode('preview')}
                  className={`relative h-full px-3 rounded-md text-[10px] font-medium flex items-center justify-center space-x-1.5 transition-all z-10 cursor-pointer ${
                    viewMode === 'preview' ? 'text-white' : 'text-neutral-450 hover:text-neutral-250'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button 
                  onClick={() => setViewMode('code')}
                  className={`relative h-full px-3 rounded-md text-[10px] font-medium flex items-center justify-center space-x-1.5 transition-all z-10 cursor-pointer ${
                    viewMode === 'code' ? 'text-white font-medium' : 'text-neutral-450 hover:text-neutral-250'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code</span>
                </button>
                <div 
                  className="absolute top-0.5 bottom-0.5 left-0.5 rounded-md bg-[#121214] border border-white/5 transition-transform duration-300 ease-out"
                  style={{
                    width: 'calc(50% - 1px)',
                    transform: viewMode === 'code' ? 'translateX(100%)' : 'translateX(0)'
                  }}
                />
              </div>

              <button
                onClick={exportHtml}
                className="h-8 px-3.5 rounded-lg bg-[#050507] border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-neutral-100 font-medium text-[10px] flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-455" />
                <span>Export</span>
              </button>
            </div>
          )}
          
          <div className="h-5 w-px bg-white/5"></div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-neutral-400 hidden md:inline truncate max-w-[120px] font-normal tracking-tight" title={userEmail}>
              {userEmail || 'gaurav@1234'}
            </span>
            <div className="h-3 w-px bg-neutral-800 hidden md:inline"></div>
            <button
              onClick={handleLogout}
              className="text-[10px] text-neutral-455 hover:text-white transition-opacity duration-150 opacity-75 hover:opacity-100 cursor-pointer border-none bg-transparent p-0 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* SPLIT-SCREEN WORKSPACE */}
      <div className="flex-1 flex flex-row overflow-hidden relative">

        {/* PROJECTS HISTORY DRAWER */}
        {showProjectsDrawer && (
          <div className="absolute inset-y-0 left-0 w-80 bg-[#0C0C0E]/95 border-r border-white/5 backdrop-blur-lg z-45 p-6 flex flex-col justify-between shadow-2xl animate-slide-in">
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-350">My Saved Projects</h3>
                </div>
                <button 
                  onClick={() => setShowProjectsDrawer(false)}
                  className="text-xs text-neutral-500 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {savedProjects.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-white/5 rounded-2xl bg-[#050507]/40">
                  <span className="text-xs text-neutral-500 block mb-2">No projects saved yet.</span>
                  <button
                    onClick={() => {
                      setGeneratedHtml('');
                      setPrompt('');
                      setCurrentProjectId(null);
                      setChatHistory([]);
                      setShowProjectsDrawer(false);
                    }}
                    className="text-[10px] font-bold text-indigo-455 hover:text-indigo-400 flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create New</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => loadProject(project)}
                      className={`p-3 rounded-xl border transition-all text-left cursor-pointer group flex items-start justify-between ${
                        currentProjectId === project.id
                          ? 'bg-indigo-650/10 border-indigo-500/50 shadow-lg shadow-indigo-650/5'
                          : 'bg-[#050507] border-white/5 hover:bg-[#121214]/40 hover:border-neutral-800'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-neutral-300 truncate group-hover:text-indigo-400 transition-colors">
                          {project.title}
                        </h4>
                        <span className="text-[9px] text-neutral-550 block mt-1 font-mono">
                          {new Date(project.timestamp).toLocaleDateString()} at {new Date(project.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <button
                        onClick={(e) => deleteProject(project.id, e)}
                        className="text-neutral-550 hover:text-red-405 p-1 rounded hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5">
              <button
                onClick={() => {
                  setGeneratedHtml('');
                  setPrompt('');
                  setCurrentProjectId(null);
                  setChatHistory([]);
                  setShowProjectsDrawer(false);
                }}
                className="w-full py-2.5 rounded-xl border border-white/5 bg-[#050507] hover:bg-[#121214] text-xs font-bold flex items-center justify-center space-x-1 text-neutral-200 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>New Design Work</span>
              </button>
            </div>
          </div>
        )}

        {/* LEFT/CENTER AREA: THE CANVAS WORKSPACE */}
        <div className="flex-1 flex flex-col relative overflow-hidden p-6 bg-[#050507]">
          
          {/* SLIDEOUT ERROR BANNER */}
          {error && (
            <div className="absolute top-6 left-6 right-6 z-35 rounded-2xl bg-red-955/70 border border-red-500/30 backdrop-blur-md p-4 text-red-200 shadow-2xl flex items-start space-x-3 transition-all animate-slide-down">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-300">Generation Failure</h4>
                <p className="text-xs text-red-200/80 mt-1 leading-relaxed">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-xs text-red-400 hover:text-red-200 transition-colors font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* CANVAS CONTENT AREA */}
          <div className="flex-1 relative w-full h-full rounded-2xl border border-white/5 bg-[#0C0C0E]/40 backdrop-blur-sm overflow-hidden flex flex-col justify-between">
            
            {/* PREVIEW/EDITOR HEADER BANNER */}
            {generatedHtml && !isGenerating && !isRefining && (
              <div className="h-14 border-b border-white/5 px-4 bg-[#0C0C0E]/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
                {/* Left Side: Active Status */}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-neutral-455 font-mono flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{viewMode === 'preview' ? 'Visual Editor (Click text inline to edit)' : 'Production Code Explorer'}</span>
                  </span>
                </div>

                {/* Right Side: Active Settings info */}
                <div className="flex items-center space-x-3 text-[10px] text-neutral-400 font-mono">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px]">Active Settings:</span>
                  
                  {/* Padding Control Card */}
                  <div className="bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 rounded-lg p-1 px-2 flex items-center space-x-2 transition-all shadow-sm">
                    <span className="text-neutral-455 font-bold">Pad:</span>
                    <span className="text-white font-bold min-w-[20px] text-center">{spacingPadding}px</span>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => setSpacingPadding(prev => Math.max(8, prev - 1))}
                        className="w-4 h-4 rounded bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-650 text-white flex items-center justify-center font-bold text-xs cursor-pointer select-none transition-colors border border-white/5"
                        title="Decrease padding"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setSpacingPadding(prev => Math.min(48, prev + 1))}
                        className="w-4 h-4 rounded bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-650 text-white flex items-center justify-center font-bold text-xs cursor-pointer select-none transition-colors border border-white/5"
                        title="Increase padding"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Gap Control Card */}
                  <div className="bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 rounded-lg p-1 px-2 flex items-center space-x-2 transition-all shadow-sm">
                    <span className="text-neutral-455 font-bold">Gap:</span>
                    <span className="text-white font-bold min-w-[20px] text-center">{spacingGap}px</span>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => setSpacingGap(prev => Math.max(4, prev - 1))}
                        className="w-4 h-4 rounded bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-650 text-white flex items-center justify-center font-bold text-xs cursor-pointer select-none transition-colors border border-white/5"
                        title="Decrease gap"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setSpacingGap(prev => Math.min(32, prev + 1))}
                        className="w-4 h-4 rounded bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-650 text-white flex items-center justify-center font-bold text-xs cursor-pointer select-none transition-colors border border-white/5"
                        title="Increase gap"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {!generatedHtml && !isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto z-10 animate-fade-in">
                <div className="relative w-20 h-20 rounded-2xl bg-[#0C0C0E] border border-white/5 flex items-center justify-center mb-6 shadow-xl">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-30 animate-pulse"></div>
                  <div className="w-10 h-10 rounded-xl bg-[#050507] border border-white/5 flex items-center justify-center shadow-inner">
                    <Code2 className="w-5 h-5 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-indigo-200 tracking-tight mb-2 font-sans">
                  Your Digital Masterpiece Awaits
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed mb-6">
                  Input a query in the Right Sidebar panel, select a quick suggestion, or load an existing project inside the history drawer. Use the voice button to prompt naturally!
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-[9px] text-neutral-550 font-mono">
                  <span className="px-2 py-1 rounded-md bg-[#0C0C0E] border border-white/5 flex items-center space-x-1 shadow">
                    <Globe className="w-3 h-3 text-indigo-455" />
                    <span>CDN Tailwinds</span>
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#0C0C0E] border border-white/5 flex items-center space-x-1 shadow">
                    <Cpu className="w-3 h-3 text-purple-455" />
                    <span>Gemini Sandbox</span>
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[#0C0C0E] border border-white/5 flex items-center space-x-1 shadow">
                    <Terminal className="w-3 h-3 text-emerald-455" />
                    <span>Voice Prompts</span>
                  </span>
                </div>
              </div>
            )}

            {/* GENERATING LOADING STATE */}
            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10 animate-fade-in bg-[#050507]/40">
                <div className="relative w-16 h-16 rounded-2xl bg-[#0C0C0E] border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-300 animate-pulse">
                  Assembling DOM Tree & Compiling Responsive Grid...
                </h3>
                <p className="text-[11px] text-neutral-550 max-w-xs mx-auto mt-2 leading-relaxed font-light">
                  Our lead AI compiler is parsing configurations, styling modern typography, and embedding clean interactive scripts.
                </p>
              </div>
            )}

            {/* REFINING LOADING STATE */}
            {isRefining && viewMode === 'preview' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10 animate-fade-in bg-[#050507]/60 backdrop-blur-sm">
                <div className="relative w-16 h-16 rounded-2xl bg-[#0C0C0E] border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Send className="w-5 h-5 text-indigo-400 animate-bounce" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-300 animate-pulse">
                  Refining Components & Applying Changes...
                </h3>
                <p className="text-[11px] text-neutral-550 max-w-xs mx-auto mt-2 leading-relaxed font-light">
                  Instructing Gemini to selectively update components, preserving layout content and custom interactive elements.
                </p>
              </div>
            )}

            {/* LIVE PREVIEW STATE */}
            {generatedHtml && !isGenerating && !isRefining && viewMode === 'preview' && (
              <div className="flex-1 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#050507]/20 p-4 animate-fade-in">
                <div 
                  className={`h-full transition-all duration-300 ease-in-out border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-[#050507] flex flex-col mx-auto ${getDeviceWidthClass()}`}
                >
                  {/* Mock Device Header Address Bar */}
                  <div className="h-8 border-b border-white/5 bg-[#0C0C0E] px-4 flex items-center justify-between shrink-0 select-none">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30"></div>
                    </div>
                    <div className="px-16 py-0.5 rounded bg-[#050507] text-[9px] text-neutral-550 font-mono truncate max-w-xs sm:max-w-md border border-white/5">
                      http://localhost:3001/sandbox
                    </div>
                    <div className="w-8"></div>
                  </div>

                  {/* Sandbox Frame */}
                  <iframe
                    ref={iframeRef}
                    key={generationCount}
                    title="AI Generated Website Preview"
                    srcDoc={injectEditableScript(
                      generatedHtml, 
                      previewDarkMode, 
                      selectedAccent,
                      spacingPadding,
                      spacingGap,
                      cornerRadius,
                      selectedFont,
                      selectedThemeTint
                    )}
                    className="w-full flex-1 border-none bg-white"
                    sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                  />
                </div>
              </div>
            )}

            {/* SOURCE CODE STATE */}
            {generatedHtml && !isGenerating && !isRefining && viewMode === 'code' && (
              <div className="flex-1 flex overflow-hidden">
                
                {/* Side Explorer Bar */}
                <div className="w-48 border-r border-white/5 bg-[#0C0C0E]/80 hidden lg:flex flex-col shrink-0 animate-fade-in select-none">
                  <div className="p-3 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-neutral-550 uppercase tracking-widest">Explorer</span>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="text-[10px] font-bold text-neutral-450 flex items-center space-x-1.5 px-2 py-1 rounded bg-[#050507]">
                      <span>📁</span>
                      <span>antigravity-project</span>
                    </div>
                    <div className="text-[10px] text-neutral-200 flex items-center space-x-1.5 pl-6 pr-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 font-semibold">
                      <span className="text-emerald-455">🌐</span>
                      <span className="truncate">index.html</span>
                    </div>
                  </div>
                </div>

                {/* VS Code Core Code Block Editor */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0C] animate-fade-in">
                  {/* File Tabs */}
                  <div className="h-9 border-b border-white/5 bg-[#0C0C0E] flex items-center justify-between px-4 shrink-0 select-none">
                    <div className="flex items-center space-x-0.5 h-full">
                      <div className="h-full px-4 bg-[#0A0A0C] border-t-2 border-indigo-500 flex items-center space-x-2 text-xs font-semibold text-neutral-200">
                        <span className="text-emerald-400">🌐</span>
                        <span>index.html</span>
                      </div>
                    </div>
                    
                    {/* Copy button */}
                    <button
                      onClick={copyToClipboard}
                      className="px-2.5 py-0.5 rounded bg-[#121214] hover:bg-[#1C1C1F] border border-white/5 text-[9px] text-neutral-405 hover:text-white font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-455" />
                          <span className="text-emerald-455">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Editor Window pane */}
                  <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed flex bg-[#0A0A0C]">
                    {/* Gutter numbers */}
                    <div className="text-right select-none text-neutral-600 pr-4 border-r border-white/5 shrink-0 text-[10px] leading-relaxed font-mono">
                      {lines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    {/* Actual Code content */}
                    <pre className="pl-4 text-left select-all whitespace-pre text-neutral-300 font-mono text-[11px] leading-relaxed overflow-x-auto flex-1">
                      {lines.join('\n')}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* RIGHT SIDEBAR: AI PROMPT BUILDER / CHAT & VISUAL EDITOR */}
        <div className="w-96 border-l border-white/5 bg-[#0C0C0E] flex flex-col shrink-0 h-full overflow-hidden relative select-none z-30">
          
          {/* Global New Project Button */}
          <div className="p-3 border-b border-white/5 bg-[#0C0C0E]/50 shrink-0 flex justify-center">
            <button
              onClick={resetWorkspace}
              className="px-4 py-1.5 rounded-full text-[9px] font-semibold tracking-widest uppercase bg-[#0d0d11]/80 hover:bg-[#121218]/90 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-500/60 shadow-[inset_0_1px_1px_rgba(168,85,247,0.1),_0_0_8px_rgba(168,85,247,0.05)] hover:shadow-[inset_0_1px_1px_rgba(168,85,247,0.2),_0_0_12px_rgba(168,85,247,0.15)] transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-3 h-3 text-purple-400" />
              <span>+ NEW PROJECT</span>
            </button>
          </div>
          
          {/* REFINE & CHAT (TOP PANEL) / INITIAL PROMPT BUILDER */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-[380px] border-b border-white/5 bg-[#0C0C0E]">
            <div className="p-4 border-b border-neutral-800 pb-2 mb-2 flex items-center justify-between shrink-0 bg-[#0C0C0E]/50">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                  {generatedHtml ? 'Refine & Chat' : 'New Design Work'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={codeHistory.length === 0}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#050507] border border-white/5 text-neutral-450 hover:text-white hover:border-neutral-700 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo last modification"
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (generatedHtml) {
                      handleRefineMicClick();
                    } else {
                      handleMicClick();
                    }
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                    isListening || isRefineListening
                      ? 'bg-red-655 border-red-505 text-white animate-pulse'
                      : 'bg-[#050507] border-white/5 text-neutral-450 hover:text-white hover:border-neutral-700'
                  }`}
                  title="Voice commands mic"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!generatedHtml ? (
              /* INITIAL PROMPT BUILDER FORM */
              <form onSubmit={handleGenerate} className="flex-1 flex flex-col p-4 justify-between overflow-y-auto space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block">What are we building today?</label>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                        rows={4}
                        placeholder="Describe your landing page... (e.g. 'A developer portfolio with dark glassmorphism, responsive cards, and FAQs')"
                        className="w-full rounded-xl bg-[#050507] border border-white/5 p-3 pr-10 pb-8 text-xs text-slate-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all resize-none font-sans leading-relaxed"
                      />
                      
                      {/* Voice Mic icon inside textarea */}
                      <button
                        type="button"
                        onClick={handleMicClick}
                        className={`absolute bottom-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-md transition-colors cursor-pointer border ${
                          isListening 
                            ? 'bg-red-655 border-red-505 text-white animate-pulse' 
                            : 'bg-[#121214] border-white/5 text-neutral-450 hover:bg-[#1E1E22] hover:text-white'
                        }`}
                        title={isListening ? "Listening... Click to stop" : "Voice input"}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick design suggestions list */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-neutral-505 uppercase tracking-widest block">Design Suggestions</span>
                    <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {suggestions.map((item, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setPrompt(item.prompt)}
                          className="w-full text-left p-2.5 rounded-lg border border-white/5 bg-[#050507]/40 hover:bg-[#121214]/60 hover:border-neutral-850 transition-all flex flex-col space-y-0.5 group cursor-pointer"
                        >
                          <span className="text-[10px] font-bold text-neutral-350 group-hover:text-indigo-455 transition-colors flex items-center justify-between">
                            {item.title}
                            <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-all" />
                          </span>
                          <span className="text-[9px] text-neutral-550 truncate leading-none">{item.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-xs text-white flex items-center justify-center space-x-1.5 transition-all duration-300 cursor-pointer ${
                    isGenerating 
                      ? 'bg-indigo-700/80 generating-shimmer cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] hover:opacity-95 hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  {isGenerating ? (
                    <span>Compiling Canvas...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate UI Magic</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ITERATIVE CHAT REFINER THREAD */
              <div className="flex-1 flex flex-col overflow-hidden justify-between">
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0C0C0E]/20">
                  {chatHistory.filter((_, idx) => idx > 1).map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col space-y-1 text-xs max-w-[85%] ${
                        msg.role === 'user' ? 'ml-auto items-end' : 'items-start'
                      }`}
                    >
                      <span className="text-[9px] text-neutral-550 font-bold uppercase tracking-wider px-1">
                        {msg.role === 'user' ? 'You' : 'Architect'}
                      </span>
                      <div className={`p-3 rounded-xl leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-650 text-white rounded-tr-none'
                          : 'bg-[#050507] border border-white/5 text-neutral-350 rounded-tl-none font-sans'
                      }`}>
                        {msg.role === 'user' ? (
                          msg.parts?.[0]?.text
                        ) : (
                          <div className="flex flex-col space-y-1">
                            <span>Successfully updated and applied changes to the layout.</span>
                            <span className="text-[9px] text-emerald-450 font-mono flex items-center space-x-1 pt-1.5 border-t border-white/5 mt-1">
                              <Check className="w-3 h-3 text-emerald-455" />
                              <span>Live Canvas Refreshed</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isRefining && (
                    <div className="flex flex-col space-y-1 text-xs max-w-[85%] items-start animate-pulse">
                      <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider px-1">Architect</span>
                      <div className="p-3 rounded-xl bg-[#050507] border border-white/5 text-neutral-450 rounded-tl-none flex items-center space-x-2">
                        <svg className="animate-spin h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-[10px]">Refining components...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Refine input box */}
                <form onSubmit={handleRefine} className="p-3 border-t border-white/5 bg-[#0C0C0E] space-y-2 shrink-0">
                  <div className="relative">
                    <textarea
                      value={refinePrompt}
                      onChange={(e) => setRefinePrompt(e.target.value)}
                      onKeyDown={handleRefineKeyDown}
                      disabled={isRefining}
                      placeholder="Ask Gemini to refine layout..."
                      rows={2}
                      className="w-full rounded-xl bg-[#050507] border border-white/5 p-3 pr-20 pb-8 text-xs text-slate-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all resize-none disabled:opacity-40 font-sans leading-relaxed"
                    />
                    
                    {/* Voice Mic and Send */}
                    <div className="absolute right-2 bottom-2 flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={handleRefineMicClick}
                        disabled={isRefining}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer border ${
                          isRefineListening 
                            ? 'bg-red-655 border-red-500 text-white animate-pulse' 
                            : 'bg-[#121214] border-white/5 text-neutral-450 hover:bg-[#1E1E22] hover:text-white'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title={isRefineListening ? "Listening... Click to stop" : "Voice input"}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isRefining || !refinePrompt.trim()}
                        className="w-7 h-7 rounded-lg bg-indigo-650 hover:bg-indigo-500 disabled:bg-[#121214] disabled:text-neutral-650 text-white transition-all cursor-pointer flex items-center justify-center border border-transparent disabled:border-white/5"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* VISUAL EDITOR PANEL (BOTTOM PANEL) */}
          <div className="p-5 space-y-4 bg-[#0C0C0E] shrink-0">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
              <div className="flex items-center space-x-2"> 
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-400">Visual Editor</span>
              </div>
              <span className="text-[9px] text-neutral-500 font-mono">Live Sync</span>
            </div>     

            {/* Accent selection (Color Palette) */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-neutral-505 uppercase tracking-wider block">Accent Palette</span>
              <div className="flex items-center space-x-3 bg-[#050507] border border-white/5 p-2 rounded-xl justify-between">
                <div className="flex items-center space-x-2">
                  {[
                    { id: 'none', colorClass: 'bg-neutral-450', title: 'Original' },
                    { id: 'emerald', colorClass: 'bg-emerald-500', title: 'Emerald' },
                    { id: 'cyan', colorClass: 'bg-cyan-400', title: 'Cyan' },
                    { id: 'orange', colorClass: 'bg-amber-500', title: 'Orange' }
                  ].map((accent) => (
                    <button
                      key={accent.id}
                      type="button"
                      onClick={() => setSelectedAccent(accent.id as 'none' | 'emerald' | 'cyan' | 'orange')}
                      title={accent.title}
                      className={`w-5 h-5 rounded-full transition-all border relative flex items-center justify-center cursor-pointer ${accent.colorClass} ${
                        selectedAccent === accent.id
                          ? 'ring-2 ring-white/20 border-white/60 scale-105 shadow-md shadow-white/5'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      {selectedAccent === accent.id && (
                        <div className="w-1 h-1 rounded-full bg-white shadow-sm"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => setPreviewDarkMode(prev => !prev)}
                  className="px-2 py-0.5 rounded-lg bg-[#121214] border border-white/5 text-neutral-450 hover:text-white transition-all text-[9px] font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span>{previewDarkMode ? '🌙 Dark' : '☀️ Light'}</span>
                </button>
              </div>
            </div>

            {/* Dropdowns: Font Family & Theme Tint */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Font Family</span>
                <div className="relative">
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full appearance-none bg-[#0C0C0E]/95 border border-white/5 rounded-xl px-2.5 py-1.5 text-[9px] font-semibold text-neutral-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 backdrop-blur-md cursor-pointer pr-7 leading-none"
                  >
                    <option value="sans">Inter (Sans)</option>
                    <option value="outfit">Outfit (Modern)</option>
                    <option value="space-grotesk">Space Grotesk</option>
                    <option value="playfair">Playfair Display</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-neutral-505 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-505 uppercase tracking-wider block">Theme Tint</span>
                <div className="relative">
                  <select
                    value={selectedThemeTint}
                    onChange={(e) => setSelectedThemeTint(e.target.value)}
                    className="w-full appearance-none bg-[#0C0C0E]/95 border border-white/5 rounded-xl px-2.5 py-1.5 text-[9px] font-semibold text-neutral-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 backdrop-blur-md cursor-pointer pr-7 leading-none"
                  >
                    <option value="obsidian">Obsidian Dark</option>
                    <option value="emerald-tint">Emerald Glass</option>
                    <option value="neon-sunset">Neon Sunset</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-neutral-505 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Advanced/Element Spacing Sliders */}
            <div className="space-y-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-neutral-550 uppercase tracking-wider">Section Padding</span>
                  <span className="text-neutral-400 font-mono">{spacingPadding}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={spacingPadding}
                  onChange={(e) => setSpacingPadding(parseInt(e.target.value))}
                  className="custom-slider cursor-pointer"
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-neutral-550 uppercase tracking-wider">Element Gap</span>
                  <span className="text-neutral-400 font-mono">{spacingGap}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={spacingGap}
                  onChange={(e) => setSpacingGap(parseInt(e.target.value))}
                  className="custom-slider cursor-pointer"
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-neutral-555 uppercase tracking-wider">Corner Radius</span>
                  <span className="text-neutral-400 font-mono">{cornerRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(parseInt(e.target.value))}
                  className="custom-slider cursor-pointer"
                />
              </div>
            </div>

            {/* Apple iOS-Style Toggle Segmented switch viewport switcher */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-neutral-550 uppercase tracking-wider block">Preview Viewport</span>
              <div className="relative bg-[#050507] border border-white/5 p-0.5 rounded-xl flex items-center w-full">
                <button
                  type="button"
                  onClick={() => setDeviceWidth('desktop')}
                  className={`relative flex-1 py-1.5 rounded-lg text-[9px] font-bold flex items-center justify-center space-x-1 transition-all z-10 cursor-pointer ${
                    deviceWidth === 'desktop' ? 'text-white' : 'text-neutral-450 hover:text-neutral-250'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceWidth('tablet')}
                  className={`relative flex-1 py-1.5 rounded-lg text-[9px] font-bold flex items-center justify-center space-x-1 transition-all z-10 cursor-pointer ${
                    deviceWidth === 'tablet' ? 'text-white' : 'text-neutral-450 hover:text-neutral-250'
                  }`}
                >
                  <Tablet className="w-3 h-3" />
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceWidth('mobile')}
                  className={`relative flex-1 py-1.5 rounded-lg text-[9px] font-bold flex items-center justify-center space-x-1 transition-all z-10 cursor-pointer ${
                    deviceWidth === 'mobile' ? 'text-white' : 'text-neutral-450 hover:text-neutral-250'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
                
                <div
                  className="absolute top-0.5 bottom-0.5 left-0.5 rounded-lg bg-[#121214] border border-white/5 transition-transform duration-300 ease-out"
                  style={{
                    width: 'calc(33.333% - 1px)',
                    transform: deviceWidth === 'desktop' 
                      ? 'translateX(0)' 
                      : deviceWidth === 'tablet' 
                        ? 'translateX(100%)' 
                        : 'translateX(200%)'
                  }}
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
