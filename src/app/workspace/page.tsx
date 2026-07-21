'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { convertHtmlToReact } from '@/lib/reactConverter';
import { cleanExportHtml } from '@/lib/cleaner';
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
  Mic,
  Upload,
  User,
  LogOut,
  Settings,
  ShieldCheck
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
  pages?: Array<{ name: string; path: string; html: string }>;
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
      medical: [
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200'
      ],
      education: [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200',
        'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200'
      ],
      realestate: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200'
      ],
      automobile: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200'
      ],
      beauty: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200'
      ],
      petcare: [
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1200',
        'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200'
      ],
      ecommerce: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200'
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
          } else if (checkStr.includes('food') || checkStr.includes('restaurant') || checkStr.includes('gourmet') || checkStr.includes('meal') || checkStr.includes('eat') || checkStr.includes('cooking') || checkStr.includes('recipe') || checkStr.includes('bakery') || checkStr.includes('coffee') || checkStr.includes('cafe')) {
            category = 'food';
          } else if (checkStr.includes('travel') || checkStr.includes('tour') || checkStr.includes('adventure') || checkStr.includes('trip') || checkStr.includes('scenery') || checkStr.includes('beach') || checkStr.includes('vacation') || checkStr.includes('hotel') || checkStr.includes('resort')) {
            category = 'travel';
          } else if (checkStr.includes('medical') || checkStr.includes('hospital') || checkStr.includes('doctor') || checkStr.includes('nurse') || checkStr.includes('clinic') || checkStr.includes('health') || checkStr.includes('therapy') || checkStr.includes('surgery') || checkStr.includes('patient')) {
            category = 'medical';
          } else if (checkStr.includes('education') || checkStr.includes('school') || checkStr.includes('university') || checkStr.includes('student') || checkStr.includes('class') || checkStr.includes('learn') || checkStr.includes('study') || checkStr.includes('campus') || checkStr.includes('library')) {
            category = 'education';
          } else if (checkStr.includes('estate') || checkStr.includes('house') || checkStr.includes('apartment') || checkStr.includes('villa') || checkStr.includes('building') || checkStr.includes('construction') || checkStr.includes('property') || checkStr.includes('architecture') || checkStr.includes('home')) {
            category = 'realestate';
          } else if (checkStr.includes('car') || checkStr.includes('vehicle') || checkStr.includes('automobile') || checkStr.includes('drive') || checkStr.includes('motor') || checkStr.includes('engine') || checkStr.includes('wheel')) {
            category = 'automobile';
          } else if (checkStr.includes('beauty') || checkStr.includes('salon') || checkStr.includes('spa') || checkStr.includes('cosmetics') || checkStr.includes('make') || checkStr.includes('hair') || checkStr.includes('grooming') || checkStr.includes('skin')) {
            category = 'beauty';
          } else if (checkStr.includes('pet') || checkStr.includes('animal') || checkStr.includes('dog') || checkStr.includes('cat') || checkStr.includes('vet') || checkStr.includes('veterinary') || checkStr.includes('canine')) {
            category = 'petcare';
          } else if (checkStr.includes('shop') || checkStr.includes('store') || checkStr.includes('retail') || checkStr.includes('ecommerce') || checkStr.includes('product') || checkStr.includes('cart') || checkStr.includes('checkout') || checkStr.includes('packaging')) {
            category = 'ecommerce';
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
      if (themeTint === 'emerald' || themeTint === 'emerald-tint') {
        tintStyle = \`
          body {
            background-color: #022c22 !important;
            color: #f0fdf4 !important;
          }
          .bg-slate-950, .bg-black, .bg-zinc-950, .bg-neutral-950 {
            background-color: #064e3b !important;
          }
          .border-slate-900, .border-slate-800, .border-neutral-900, .border-white/10 {
            border-color: rgba(16, 185, 129, 0.15) !important;
          }
          body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
            pointer-events: none;
            z-index: 9999;
          }
        \`;
      } else if (themeTint === 'midnight') {
        tintStyle = \`
          body {
            background-color: #020617 !important;
            color: #f8fafc !important;
          }
          .bg-slate-950, .bg-black, .bg-zinc-950, .bg-neutral-950 {
            background-color: #0f172a !important;
          }
          .border-slate-900, .border-slate-800, .border-neutral-900, .border-white/10 {
            border-color: rgba(255, 255, 255, 0.05) !important;
          }
          body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
            pointer-events: none;
            z-index: 9999;
          }
        \`;
      } else if (themeTint === 'ocean') {
        tintStyle = \`
          body {
            background-color: #030712 !important;
            color: #f0f9ff !important;
          }
          .bg-slate-950, .bg-black, .bg-zinc-950, .bg-neutral-950 {
            background-color: #07152b !important;
          }
          .border-slate-900, .border-slate-800, .border-neutral-900, .border-white/10 {
            border-color: rgba(14, 165, 233, 0.15) !important;
          }
          body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 90% 10%, rgba(14, 165, 233, 0.08) 0%, transparent 60%);
            pointer-events: none;
            z-index: 9999;
          }
        \`;
      } else if (themeTint === 'royal-blue') {
        tintStyle = \`
          body {
            background-color: #0a0f1d !important;
            color: #e0e7ff !important;
          }
          .bg-slate-950, .bg-black, .bg-zinc-950, .bg-neutral-950 {
            background-color: #111827 !important;
          }
          .border-slate-900, .border-slate-800, .border-neutral-900, .border-white/10 {
            border-color: rgba(99, 102, 241, 0.15) !important;
          }
        \`;
      } else if (themeTint === 'minimal-white') {
        tintStyle = \`
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          .bg-slate-950, .bg-black, .bg-zinc-950, .bg-neutral-950 {
            background-color: #f8fafc !important;
          }
          .text-white, .text-neutral-100, .text-slate-100 {
            color: #0f172a !important;
          }
          .text-neutral-400, .text-slate-400 {
            color: #475569 !important;
          }
          .border-slate-900, .border-slate-800, .border-neutral-900, .border-white/5, .border-white/10 {
            border-color: #e2e8f0 !important;
          }
        \`;
      } else if (themeTint === 'luxury-black') {
        tintStyle = \`
          body {
            background-color: #000000 !important;
            color: #f5f5f7 !important;
          }
          .bg-slate-950, .bg-black, .bg-zinc-950, .bg-neutral-950 {
            background-color: #0a0a0a !important;
          }
          .border-slate-900, .border-slate-800, .border-neutral-900, .border-white/10 {
            border-color: #171717 !important;
          }
        \`;
      } else if (themeTint === 'cyber') {
        tintStyle = \`
          body {
            background-color: #050505 !important;
            color: #00ffcc !important;
          }
          .bg-slate-950, .bg-black, .bg-zinc-950, .bg-neutral-950 {
            background-color: #0d0d0d !important;
          }
          .border-slate-900, .border-slate-800, .border-neutral-900, .border-white/10 {
            border-color: #00ffcc !important;
          }
          body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(255, 0, 128, 0.05) 0%, transparent 70%);
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
      } else {
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
        html, body {
          \${fontFamilyRule}
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: auto !important;
          min-height: 100vh !important;
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
        } else if (e.data && e.data.type === 'UPDATE_IMAGE') {
          const targetImg = document.querySelector("img[data-antigravity-img-idx='" + e.data.index + "']");
          if (targetImg) {
            targetImg.setAttribute('src', e.data.src);
            if (e.data.alt !== undefined) {
              targetImg.setAttribute('alt', e.data.alt);
            }
            setTimeout(() => {
              const cleanHtml = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
              window.parent.postMessage({ type: 'HTML_CHANGED', html: cleanHtml }, '*');
            }, 50);
          }
        }
      });



      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && href.endsWith('.html')) {
            e.preventDefault();
            e.stopPropagation();
            window.parent.postMessage({
              type: 'PAGE_NAVIGATED',
              path: href
            }, '*');
          }
        });
      });

      // --- Intercept Form Submissions dynamically ---
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const action = form.getAttribute('action') || '';
          const method = (form.getAttribute('method') || 'POST').toUpperCase();
          const formData = new FormData(form);
          const data = {};
          formData.forEach((value, key) => {
            data[key] = value;
          });

          // Show loading state on the button
          const submitBtn = form.querySelector('[type="submit"]') || form.querySelector('button');
          const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Loading...';
          }

          // Let's create an inline success or error toast/alert element
          let alertBox = form.querySelector('.antigravity-form-alert');
          if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.className = 'antigravity-form-alert text-xs mt-3 p-3 rounded-lg border hidden';
            alertBox.style.cssText = 'padding: 12px; font-size: 12px; margin-top: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background-color: rgba(0,0,0,0.4);';
            form.appendChild(alertBox);
          } else {
            alertBox.style.display = 'none';
          }

          try {
            let responseData;
            let ok = false;
            
            // Support local auth sandbox APIs or mock any other actions
            const isLocalAuth = action.includes('/api/auth/login') || action.includes('/api/auth/signup');
            const fetchUrl = isLocalAuth ? action : '/api/auth/login';
            
            const res = await fetch(fetchUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            ok = res.ok;
            responseData = await res.json().catch(() => ({}));
            
            alertBox.style.display = 'block';
            if (ok) {
              alertBox.style.borderColor = 'rgba(16, 185, 129, 0.3)';
              alertBox.style.backgroundColor = 'rgba(4, 120, 87, 0.15)';
              alertBox.style.color = '#34d399';
              alertBox.innerHTML = '✦ Success: ' + (responseData.message || 'Submission completed successfully!');
              form.reset();
            } else {
              alertBox.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              alertBox.style.backgroundColor = 'rgba(185, 28, 28, 0.15)';
              alertBox.style.color = '#f87171';
              alertBox.innerHTML = '⚠️ Error: ' + (responseData.error || 'Failed to submit form.');
            }
          } catch (fetchErr) {
            alertBox.style.display = 'block';
            alertBox.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            alertBox.style.backgroundColor = 'rgba(185, 28, 28, 0.15)';
            alertBox.style.color = '#f87171';
            alertBox.innerHTML = '⚠️ Error: Connection request failed.';
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
            }
          }
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

  // Image Customizer states
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);
  const [selectedImgSrc, setSelectedImgSrc] = useState<string>('');
  const [selectedImgAlt, setSelectedImgAlt] = useState<string>('');
  const [unsplashKeyword, setUnsplashKeyword] = useState<string>('');

  // Sidebar Refinement states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  // Saved Projects states
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [showProjectsDrawer, setShowProjectsDrawer] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Multi-page Site states
  const [pages, setPages] = useState<Array<{ name: string; path: string; html: string }>>([
    { name: 'Home', path: 'index.html', html: '' }
  ]);
  const [activePagePath, setActivePagePath] = useState<string>('index.html');

  // Deployment states
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [netlifyToken, setNetlifyToken] = useState('');
  const [deployedLocalUrl, setDeployedLocalUrl] = useState('');
  const [deployedLiveUrl, setDeployedLiveUrl] = useState('');
  const [deployError, setDeployError] = useState<string | null>(null);

  // Undo/Redo stack history states
  const [undoStack, setUndoStack] = useState<Array<{ html: string; pages: Array<{ name: string; path: string; html: string }> }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ html: string; pages: Array<{ name: string; path: string; html: string }> }>>([]);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [diffOriginalText, setDiffOriginalText] = useState('');
  const [diffModifiedText, setDiffModifiedText] = useState('');

  const executeUndo = () => {
    if (undoStack.length === 0) return;
    const current = { html: generatedHtml, pages: [...pages] };
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));
    setRedoStack(r => [...r, current]);
    setGeneratedHtml(prev.html);
    setPages(prev.pages);
    
    const active = prev.pages.find(p => p.path === activePagePath);
    if (active) {
      setGeneratedHtml(active.html);
    }
  };

  const executeRedo = () => {
    if (redoStack.length === 0) return;
    const current = { html: generatedHtml, pages: [...pages] };
    const next = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));
    setUndoStack(u => [...u, current]);
    setGeneratedHtml(next.html);
    setPages(next.pages);

    const active = next.pages.find(p => p.path === activePagePath);
    if (active) {
      setGeneratedHtml(active.html);
    }
  };

  const pushStateToUndo = (html: string, currentPages: typeof pages) => {
    setUndoStack(prev => [...prev, { html, pages: currentPages }]);
    setRedoStack([]);
  };

  // Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [isRefineListening, setIsRefineListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const refineRecognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Save/Update projects inside SQLite database via API
  const saveProject = async (
    htmlContent: string, 
    originalPrompt: string, 
    idToUpdate?: string | null, 
    activeHistory?: ChatMessage[],
    updatedPagesList?: Array<{ name: string; path: string; html: string }>
  ) => {
    try {
      const token = localStorage.getItem('antigravity_token');
      if (!token) return;

      const historyToSave = activeHistory || [];

      // Determine the list of pages to send
      let pagesToSend = updatedPagesList || pages;
      
      // Update the active page HTML content inside the pages array if we are passing new HTML
      if (htmlContent) {
        pagesToSend = pagesToSend.map(p => 
          p.path === activePagePath ? { ...p, html: htmlContent } : p
        );
      }

      const payload = {
        id: idToUpdate || undefined,
        title: originalPrompt.trim().split(' ').slice(0, 5).join(' '),
        prompt: originalPrompt,
        pages: pagesToSend,
        chatHistory: historyToSave
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('antigravity_token');
          localStorage.removeItem('antigravity_user_email');
          window.location.href = '/';
          return;
        }
        throw new Error('Failed to save project to server');
      }

      const resData = await response.json();
      const savedProj = resData.project as SavedProject;

      // Sync local pages state
      if (savedProj.pages) {
        setPages(savedProj.pages);
      }

      // Update local state list
      setSavedProjects(prev => {
        const exists = prev.some(p => p.id === savedProj.id);
        if (exists) {
          return prev.map(p => p.id === savedProj.id ? savedProj : p);
        } else {
          return [savedProj, ...prev];
        }
      });

      if (!idToUpdate) {
        setCurrentProjectId(savedProj.id);
      }
    } catch (e) {
      console.error('Failed to save project:', e);
      setError('Connection Alert: Failed to sync changes with SQLite database.');
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

  // Load projects from SQLite database on mount or auth shift
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('antigravity_token');
        if (!token) return;

        const response = await fetch('/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('antigravity_token');
            localStorage.removeItem('antigravity_user_email');
            window.location.href = '/';
          }
          return;
        }
        const data = await response.json();
        setSavedProjects(data);
      } catch (e) {
        console.error('Failed to load projects from server:', e);
      }
    };

    fetchProjects();
  }, [isAuthenticated]);

  // Auto-hide warning toast after 8 seconds
  useEffect(() => {
    if (showKeyWarning) {
      const timer = setTimeout(() => setShowKeyWarning(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showKeyWarning]);

  // Synchronize Live editable updates back into parent React state
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'HTML_CHANGED') {
        const updatedHtml = event.data.html;
        pushStateToUndo(generatedHtml, pages);
        setGeneratedHtml(current => {
          setCodeHistory(prev => [...prev, current]);
          return updatedHtml;
        });
        
        if (currentProjectId) {
          saveProject(updatedHtml, prompt, currentProjectId, chatHistory);
        }
      } else if (event.data && event.data.type === 'IMAGE_CLICKED') {
        setSelectedImgIndex(event.data.index);
        setSelectedImgSrc(event.data.src);
        setSelectedImgAlt(event.data.alt);
      } else if (event.data && event.data.type === 'PAGE_NAVIGATED') {
        const targetPath = event.data.path;
        const targetPage = pages.find(p => p.path === targetPath);
        if (targetPage) {
          setActivePagePath(targetPath);
          setGeneratedHtml(targetPage.html);
        } else {
          generateSubpage(targetPath);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentProjectId, prompt, chatHistory, pages, activePagePath]);

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

  // Delete a project from database
  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('antigravity_token');
      if (!token) return;

      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project from server');
      }

      setSavedProjects(prev => prev.filter(p => p.id !== id));
      
      if (currentProjectId === id) {
        setGeneratedHtml('');
        setCurrentProjectId(null);
        setChatHistory([]);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError('Connection Alert: Failed to delete project from SQLite database.');
    }
  };

  // Select a past project
  const loadProject = (project: SavedProject) => {
    const projectPages = project.pages || [
      { name: 'Home', path: 'index.html', html: project.html }
    ];
    setPages(projectPages);
    const activePage = projectPages.find(p => p.path === 'index.html') || projectPages[0];
    const activePath = activePage ? activePage.path : 'index.html';
    const activeHtml = activePage ? activePage.html : '';

    setActivePagePath(activePath);
    setGeneratedHtml(activeHtml);
    setPrompt(project.prompt);
    setCurrentProjectId(project.id);
    setChatHistory(project.chatHistory || [
      { role: 'user', parts: [{ text: `Create a landing page for: ${project.prompt}` }] },
      { role: 'model', parts: [{ text: activeHtml }] }
    ]);
    setShowProjectsDrawer(false);
    setGenerationCount(prev => prev + 1);
  };

  // Post image source updates back into the iframe
  const handleApplyImage = () => {
    if (selectedImgIndex === null || !iframeRef.current || !iframeRef.current.contentWindow) return;
    
    let finalSrc = selectedImgSrc.trim();
    if (unsplashKeyword.trim()) {
      const keywordEncoded = encodeURIComponent(unsplashKeyword.trim().toLowerCase());
      finalSrc = `https://images.unsplash.com/featured/?${keywordEncoded}`;
    }

    iframeRef.current.contentWindow.postMessage({
      type: 'UPDATE_IMAGE',
      index: selectedImgIndex,
      src: finalSrc,
      alt: selectedImgAlt
    }, '*');

    // Reset editor panel state
    setSelectedImgIndex(null);
    setSelectedImgSrc('');
    setSelectedImgAlt('');
    setUnsplashKeyword('');
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setSelectedImgSrc(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleImagePaste = (e: React.ClipboardEvent) => {
    const item = e.clipboardData.items?.[0];
    if (item && item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        processImageFile(file);
      }
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
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
        body: JSON.stringify({ 
          prompt,
          themeSettings: {
            darkMode: previewDarkMode,
            accent: selectedAccent,
            padding: spacingPadding,
            gap: spacingGap,
            radius: cornerRadius,
            font: selectedFont,
            themeTint: selectedThemeTint
          }
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const htmlContent = await response.text();
      const initialPages = [{ name: 'Home', path: 'index.html', html: htmlContent }];
      setPages(initialPages);
      setActivePagePath('index.html');

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

      saveProject(htmlContent, prompt, null, initialHistory, initialPages);

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

  const generateSubpage = async (
    pagePath: string, 
    customName?: string, 
    existingPages?: Array<{ name: string; path: string; html: string }>
  ) => {
    setIsGenerating(true);
    setError(null);
    try {
      const activePages = existingPages || pages;
      const pageName = customName || pagePath.replace('.html', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      const homePage = activePages.find(p => p.path === 'index.html') || activePages[0];
      const homeHtml = homePage ? homePage.html : '';

      const token = localStorage.getItem('antigravity_token');
      
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          prompt: `For the website "${prompt}", generate the subpage "${pageName}" (file path: "${pagePath}"). Replicate the layout styles, header navigation, and footer from this home page: \n\n ${homeHtml} \n\n but change the body section elements to match the "${pageName}" page contents.`,
          themeSettings: {
            darkMode: previewDarkMode,
            accent: selectedAccent,
            padding: spacingPadding,
            gap: spacingGap,
            radius: cornerRadius,
            font: selectedFont,
            themeTint: selectedThemeTint
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate subpage via AI');
      }

      const subpageHtml = await response.text();
      const newPage = { name: pageName, path: pagePath, html: subpageHtml };
      const pageExists = activePages.some(p => p.path === pagePath);
      const newPages = pageExists
        ? activePages.map(p => p.path === pagePath ? newPage : p)
        : [...activePages, newPage];
      
      pushStateToUndo(generatedHtml, pages);
      setPages(newPages);
      setActivePagePath(pagePath);
      setGeneratedHtml(subpageHtml);
      
      saveProject(subpageHtml, prompt, currentProjectId, chatHistory, newPages);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to automatically generate subpage: ${err.message}`);
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
          history: formattedHistory,
          themeSettings: {
            darkMode: previewDarkMode,
            accent: selectedAccent,
            padding: spacingPadding,
            gap: spacingGap,
            radius: cornerRadius,
            font: selectedFont,
            themeTint: selectedThemeTint
          }
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

  const exportReactComponent = () => {
    if (!generatedHtml) return;
    const cleanHtml = cleanExportHtml(generatedHtml);
    const reactComponentCode = convertHtmlToReact(cleanHtml);
    const blob = new Blob([reactComponentCode], { type: 'text/typescript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'GeneratedPage.tsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployError(null);
    setDeployedLocalUrl('');
    setDeployedLiveUrl('');

    try {
      const token = localStorage.getItem('antigravity_token');
      if (!token) throw new Error('Unauthorized');

      // Make sure we have the latest visual changes in the active page object
      const currentPagesList = pages.map(p => 
        p.path === activePagePath ? { ...p, html: generatedHtml } : p
      );

      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pages: currentPagesList,
          netlifyToken: netlifyToken.trim() || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to deploy the site.');
      }

      const resData = await response.json();
      setDeployedLocalUrl(resData.localUrl || '');
      setDeployedLiveUrl(resData.liveUrl || '');
    } catch (err: any) {
      console.error(err);
      setDeployError(err.message || 'An error occurred during deployment.');
    } finally {
      setIsDeploying(false);
    }
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

              {/* Undo/Redo State Controls */}
              <div className="flex items-center space-x-1.5 bg-[#050507] border border-white/5 p-1 rounded-lg h-8">
                <button
                  type="button"
                  onClick={executeUndo}
                  disabled={undoStack.length === 0}
                  className="p-1 rounded-md text-neutral-450 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-neutral-450 transition-colors cursor-pointer border-none bg-transparent"
                  title="Undo last change"
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={executeRedo}
                  disabled={redoStack.length === 0}
                  className="p-1 rounded-md text-neutral-450 hover:text-slate-100 disabled:opacity-30 disabled:hover:text-neutral-450 transition-colors cursor-pointer border-none bg-transparent"
                  title="Redo undone change"
                >
                  <Undo className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>

              {/* Diff Viewer Trigger */}
              <button
                type="button"
                onClick={() => {
                  const homePage = pages.find(p => p.path === 'index.html');
                  setDiffOriginalText(homePage ? homePage.html : '');
                  setDiffModifiedText(generatedHtml);
                  setShowDiffModal(true);
                }}
                className="h-8 px-3 rounded-lg bg-[#050507] border border-white/5 hover:border-slate-500 hover:bg-[#121214] text-neutral-350 font-medium text-[10px] flex items-center justify-center space-x-1 transition-all shadow-sm cursor-pointer"
                title="Compare visual layout differences"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Diff</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(prev => !prev)}
                  className="h-8 px-3 rounded-lg bg-[#050507] border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-neutral-100 font-medium text-[10px] flex items-center justify-center space-x-1 transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-455" />
                  <span>Export</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${showExportDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showExportDropdown && (
                  <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-white/5 bg-[#0C0C0E]/95 backdrop-blur-lg p-1.5 shadow-2xl z-50 flex flex-col space-y-0.5 animate-slide-down">
                    <button
                      onClick={() => {
                        exportHtml();
                        setShowExportDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-[10px] text-neutral-350 hover:text-white font-medium transition-colors flex items-center space-x-2 border-none bg-transparent cursor-pointer"
                    >
                      <span className="text-emerald-400 font-mono text-[9px] font-bold">HTML</span>
                      <span>Export Static HTML</span>
                    </button>
                    <button
                      onClick={() => {
                        exportReactComponent();
                        setShowExportDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-[10px] text-neutral-350 hover:text-white font-medium transition-colors flex items-center space-x-2 border-none bg-transparent cursor-pointer"
                    >
                      <span className="text-purple-400 font-mono text-[9px] font-bold">TSX</span>
                      <span>Export React Component</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowDeployModal(true)}
                className="h-8 px-3 rounded-lg bg-indigo-650 hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] text-white font-medium text-[10px] flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer border-none"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-200" />
                <span>Deploy</span>
              </button>
            </div>
          )}
          
          <div className="h-5 w-px bg-white/5"></div>

          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(prev => !prev)}
              className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl border border-white/5 bg-[#050507]/60 hover:bg-[#121214] transition-all cursor-pointer select-none"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'G'}
              </div>
              <span className="text-[10px] text-neutral-300 font-medium hidden md:inline truncate max-w-[100px]">
                {userEmail ? userEmail.split('@')[0] : 'Developer'}
              </span>
              <ChevronDown className={`w-3 h-3 text-neutral-500 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/5 bg-[#0C0C0E]/95 backdrop-blur-xl p-4 shadow-2xl z-50 flex flex-col space-y-4 animate-slide-down">
                {/* Header profile details */}
                <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {userEmail ? userEmail.split('@')[0] : 'Developer'}
                    </p>
                    <p className="text-[10px] text-neutral-450 truncate" title={userEmail}>
                      {userEmail || 'developer@antigravity.studio'}
                    </p>
                  </div>
                </div>

                {/* Account badge */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/20 border border-purple-500/10">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[9px] font-bold text-purple-300 uppercase tracking-wider">Premium Account</span>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold font-mono">
                    PRO
                  </span>
                </div>

                {/* Quick actions list */}
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => {
                      setShowProjectsDrawer(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-[10px] text-neutral-450 hover:text-white transition-colors flex items-center space-x-2 border-none bg-transparent cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-neutral-500" />
                    <span>My Saved Projects ({savedProjects.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDeployModal(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-[10px] text-neutral-455 hover:text-white transition-colors flex items-center space-x-2 border-none bg-transparent cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Deployments Manager</span>
                  </button>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 font-bold text-[10px] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
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
          
          {/* SLIDEOUT OFFLINE FALLBACK BANNER */}
          {showKeyWarning && (
            <div className="absolute top-6 left-6 right-6 z-35 rounded-2xl bg-amber-950/70 border border-amber-500/30 backdrop-blur-md p-4 text-amber-200 shadow-2xl flex items-start space-x-3 transition-all animate-slide-down">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-300">Offline Fallback Engine Triggered</h4>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Gemini API limits/errors occurred. System fell back to the local offline layouts compiler to construct your site layout. Please review your <code className="bg-amber-950/90 px-1 py-0.5 rounded font-mono text-[10px]">GEMINI_API_KEY</code> key inside the <code className="bg-amber-950/90 px-1 py-0.5 rounded font-mono text-[10px]">.env.local</code> configuration file.
                </p>
              </div>
              <button 
                onClick={() => setShowKeyWarning(false)}
                className="text-xs text-amber-400 hover:text-amber-200 transition-colors font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

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

            {/* PAGE MANAGER CARD */}
            {generatedHtml && (
              <div className="p-4 bg-[#08080A] border border-white/5 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Page Manager</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newPageName = window.prompt("Enter page name (e.g. Pricing, About Us, Features):");
                      if (!newPageName) return;
                      const path = newPageName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.html';
                      if (pages.some(p => p.path === path)) {
                        alert("Page path already exists!");
                        return;
                      }

                      // Clone the home page content or a simple layout starting point
                      const homePage = pages.find(p => p.path === 'index.html') || pages[0];
                      const newPageHtml = homePage ? homePage.html : '<html><body><h1>New Page</h1></body></html>';
                      
                      const newPages = [...pages, { name: newPageName, path, html: newPageHtml }];
                      
                      const autoGenerate = window.confirm(`Would you like AntiGravity AI to automatically generate custom content and layouts for the "${newPageName}" subpage?`);
                      if (autoGenerate) {
                        generateSubpage(path, newPageName, newPages);
                      } else {
                        setPages(newPages);
                        setActivePagePath(path);
                        setGeneratedHtml(newPageHtml);
                        if (currentProjectId) {
                          saveProject(newPageHtml, prompt, currentProjectId, chatHistory, newPages);
                        }
                      }
                    }}
                    className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold border-none bg-transparent cursor-pointer flex items-center space-x-1 p-0"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>Add Page</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2 bg-[#050507] border border-white/5 p-2 rounded-xl justify-between">
                  <span className="text-[10px] text-neutral-450">Active:</span>
                  <select
                    value={activePagePath}
                    onChange={(e) => {
                      const selectedPath = e.target.value;
                      const page = pages.find(p => p.path === selectedPath);
                      if (page) {
                        setActivePagePath(selectedPath);
                        setGeneratedHtml(page.html);
                      }
                    }}
                    className="bg-transparent text-[10px] text-slate-200 border-none outline-none focus:ring-0 max-w-[140px] cursor-pointer"
                  >
                    {pages.map((p) => (
                      <option key={p.path} value={p.path} className="bg-[#0C0C0E]">
                        {p.name} ({p.path})
                      </option>
                    ))}
                  </select>
                </div>

                {pages.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (activePagePath === 'index.html') {
                          alert("Cannot delete the home page (index.html)!");
                          return;
                        }
                        if (confirm(`Are you sure you want to delete the page "${activePagePath}"?`)) {
                          const newPages = pages.filter(p => p.path !== activePagePath);
                          const fallbackPage = newPages.find(p => p.path === 'index.html') || newPages[0];
                          setPages(newPages);
                          setActivePagePath(fallbackPage.path);
                          setGeneratedHtml(fallbackPage.html);
                          
                          if (currentProjectId) {
                            saveProject(fallbackPage.html, prompt, currentProjectId, chatHistory, newPages);
                          }
                        }
                      }}
                      className="text-[9px] text-red-450 hover:text-red-400 font-medium flex items-center space-x-1 cursor-pointer bg-transparent border-none p-0"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Delete Current Page</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* IMAGE EDITOR CONTEXT CARD */}
            {selectedImgIndex !== null && (
              <div className="p-4.5 rounded-xl border border-purple-500/20 bg-purple-950/10 space-y-3.5 animate-slide-down">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    <span>Image Editor (Active)</span>
                  </span>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedImgIndex(null);
                      setUnsplashKeyword('');
                    }}
                    className="text-[10px] text-neutral-500 hover:text-white cursor-pointer font-bold border-none bg-transparent p-0"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-neutral-455 uppercase block">Custom URL</label>
                    <input
                      type="text"
                      value={selectedImgSrc}
                      onChange={(e) => setSelectedImgSrc(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-lg bg-[#050507] border border-white/5 p-2 text-[10px] text-slate-200 placeholder-neutral-700 focus:outline-none focus:border-purple-500 transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-neutral-455 uppercase block">Unsplash search</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={unsplashKeyword}
                        onChange={(e) => setUnsplashKeyword(e.target.value)}
                        placeholder="e.g. coffee shop cup, fitness barbell"
                        className="w-full rounded-lg bg-[#050507] border border-white/5 p-2 pr-16 text-[10px] text-slate-200 placeholder-neutral-700 focus:outline-none focus:border-purple-500 transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleApplyImage}
                        disabled={!selectedImgSrc.trim() && !unsplashKeyword.trim()}
                        className="absolute right-1 top-1 bottom-1 px-2.5 rounded bg-purple-650 hover:bg-purple-500 hover:scale-[1.01] active:scale-[0.99] text-white text-[9px] font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-transparent"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Local Image Upload / Drop / Paste zone */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-neutral-455 uppercase block">Local Image (Upload / Paste)</label>
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleImageDrop}
                      onPaste={handleImagePaste}
                      className="border border-dashed border-white/10 rounded-lg p-3 text-center bg-[#050507] hover:border-purple-500/50 hover:bg-purple-950/5 transition-all cursor-pointer relative group flex flex-col items-center justify-center space-y-1"
                    >
                      <Upload className="w-5 h-5 text-neutral-500 group-hover:text-purple-400 transition-colors" />
                      <span className="text-[9px] text-neutral-400 group-hover:text-neutral-250">
                        Drag file, paste image, or <span className="text-purple-400 underline font-semibold">browse</span>
                      </span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    
                    {selectedImgSrc && selectedImgSrc.startsWith('data:') && (
                      <span className="text-[8px] text-emerald-400 block font-semibold animate-pulse mt-1">
                        ✓ Local Image Loaded (Ready to Apply)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                    <option value="midnight">Midnight Slate</option>
                    <option value="ocean">Ocean Dream</option>
                    <option value="emerald">Emerald Glass</option>
                    <option value="royal-blue">Royal Blue</option>
                    <option value="minimal-white">Minimal White</option>
                    <option value="luxury-black">Luxury Black</option>
                    <option value="cyber">Cyber Neon</option>
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

      {/* CODE DIFF MODAL */}
      {showDiffModal && (
        <div className="fixed inset-0 bg-[#050507]/85 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-6">
          <div className="w-full max-w-5xl h-[85vh] bg-[#0C0C0E]/95 border border-white/5 p-6 rounded-2xl shadow-2xl flex flex-col space-y-4 font-sans relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Code Changes Diff Viewer</span>
              </span>
              <button
                type="button"
                onClick={() => setShowDiffModal(false)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer text-xs font-bold border-none bg-transparent"
              >
                Close
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
              <div className="flex flex-col h-full overflow-hidden">
                <span className="text-[10px] font-bold text-neutral-450 uppercase mb-2">Original State</span>
                <pre className="flex-1 p-4 bg-[#050507] border border-white/5 rounded-xl text-xs text-neutral-400 overflow-auto font-mono whitespace-pre-wrap">
                  {diffOriginalText || 'No original source state recorded yet.'}
                </pre>
              </div>

              <div className="flex flex-col h-full overflow-hidden">
                <span className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Modified State</span>
                <pre className="flex-1 p-4 bg-[#050507] border border-white/5 rounded-xl text-xs text-indigo-200 overflow-auto font-mono whitespace-pre-wrap">
                  {diffModifiedText || 'No changes made.'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEPLOYMENT MODAL */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-[#050507]/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="w-full max-w-md bg-[#0C0C0E]/90 border border-white/5 p-6 rounded-2xl shadow-2xl space-y-4 font-sans relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>One-Click Deploy</span>
              </span>
              <button
                onClick={() => {
                  setShowDeployModal(false);
                  setDeployError(null);
                  setDeployedLocalUrl('');
                  setDeployedLiveUrl('');
                }}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer text-xs font-bold border-none bg-transparent"
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            {!deployedLocalUrl && !deployedLiveUrl && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Generate a standalone public URL for your site! By default, the builder hosts it in a local public sandbox.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-450 uppercase block">Netlify Token (Optional)</label>
                  <input
                    type="password"
                    value={netlifyToken}
                    onChange={(e) => setNetlifyToken(e.target.value)}
                    placeholder="Enter Netlify Personal Access Token"
                    className="w-full rounded-xl bg-[#050507] border border-white/5 p-3 text-xs text-slate-200 placeholder-neutral-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 transition-all font-sans"
                  />
                  <span className="text-[9px] text-neutral-555 block">
                    If supplied, we will deploy directly to a production server on your Netlify account.
                  </span>
                </div>

                {deployError && (
                  <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-[10px] text-red-400 leading-relaxed font-mono">
                    {deployError}
                  </div>
                )}

                <button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="w-full py-3 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg border-none"
                >
                  {isDeploying ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Deploying site assets...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Deployment</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Success State */}
            {(deployedLocalUrl || deployedLiveUrl) && (
              <div className="space-y-4 py-2 text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Deployment Successful!</h4>
                  <p className="text-xs text-neutral-450">
                    Your layout resources have been compiled and hosted.
                  </p>
                </div>

                <div className="space-y-2 pt-2 text-left">
                  {deployedLiveUrl && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-purple-400 uppercase block tracking-wider">Production Link (Netlify)</span>
                      <a
                        href={deployedLiveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-200 hover:text-white font-mono font-medium block truncate p-3 bg-[#050507] border border-white/5 rounded-xl transition-all"
                      >
                        {deployedLiveUrl}
                      </a>
                    </div>
                  )}

                  {deployedLocalUrl && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase block tracking-wider">Local Sandbox Link</span>
                      <a
                        href={deployedLocalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-200 hover:text-white font-mono font-medium block truncate p-3 bg-[#050507] border border-white/5 rounded-xl transition-all"
                      >
                        {window.location.origin + deployedLocalUrl}
                      </a>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-neutral-550 leading-relaxed">
                  Tip: Share the local link with other devices on your same Wi-Fi network!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
