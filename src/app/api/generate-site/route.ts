import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import jwt from 'jsonwebtoken';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders,
  });
}

function verifyAuth(req: Request): { userId: string; email: string } | null {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const tokenSecret = process.env.JWT_SECRET || 'antigravity-studio-super-secret-key-12345';
    return jwt.verify(token, tokenSecret) as { userId: string; email: string };
  } catch {
    return null;
  }
}

function sanitizeHtmlImages(html: string): string {
  if (!html) return html;

  // Helper function to inject bg-neutral-900 and object-cover classes if missing from classes
  const injectBgClass = (prefix: string, suffix: string): { prefix: string, suffix: string } => {
    let cleanPrefix = prefix;
    let cleanSuffix = suffix;
    const classMatch = (prefix + suffix).match(/class=["']([^"']*)["']/i);
    if (classMatch) {
      const classes = classMatch[1];
      let updatedClasses = classes;
      if (!classes.includes('bg-')) {
        updatedClasses = updatedClasses + ' bg-neutral-900';
      }
      if (!classes.includes('object-cover')) {
        updatedClasses = updatedClasses + ' object-cover';
      }
      if (prefix.match(/class=["']/i)) {
        cleanPrefix = prefix.replace(/class=["']([^"']*)["']/i, `class="${updatedClasses}"`);
      } else {
        cleanSuffix = suffix.replace(/class=["']([^"']*)["']/i, `class="${updatedClasses}"`);
      }
    } else {
      cleanSuffix = suffix + ' class="bg-neutral-900 object-cover"';
    }
    return { prefix: cleanPrefix, suffix: cleanSuffix };
  };

  // 1. Process <img> tags and sanitize their 'src' attribute
  let sanitized = html.replace(/<img([^>]+)src=["']([^"']*)["']([^>]*)>/gi, (match, prefix, src, suffix) => {
    let cleanSrc = src.trim();

    // Outdated source.unsplash.com sanitization fail-safe
    if (cleanSrc.includes('source.unsplash.com')) {
      const queryIdx = cleanSrc.indexOf('?');
      if (queryIdx !== -1) {
        const query = cleanSrc.substring(queryIdx + 1);
        const cleanQuery = query.replace(/^\d+x\d+&?/, '').trim();
        if (cleanQuery) {
          cleanSrc = `https://images.unsplash.com/featured/?${cleanQuery}`;
        }
      } else {
        const parts = cleanSrc.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && !lastPart.match(/^\d+x\d+$/) && lastPart !== 'random') {
          cleanSrc = `https://images.unsplash.com/featured/?${lastPart}`;
        }
      }
    }

    let finalSrc = cleanSrc;

    const isValidUnsplash = cleanSrc.startsWith('https://images.unsplash.com/featured/') || cleanSrc.startsWith('https://images.unsplash.com/photo-');
    const isValidPollinations = cleanSrc.startsWith('https://image.pollinations.ai/prompt/');

    if (!isValidUnsplash && !isValidPollinations) {
      // Strip out relative paths, faked local filenames, or placeholders
      let keyword = 'website_ui';
      const lastSlash = cleanSrc.lastIndexOf('/');
      let filename = lastSlash !== -1 ? cleanSrc.substring(lastSlash + 1) : cleanSrc;
      const dot = filename.lastIndexOf('.');
      if (dot !== -1) {
        filename = filename.substring(0, dot);
      }
      
      // Convert hyphens and underscores to commas for Unsplash search matching
      filename = filename.replace(/[-_]/g, ',').replace(/[^a-zA-Z,]/g, '').trim();
      if (filename && filename.length > 1) {
        keyword = filename;
      } else {
        // Fallback: extract from alt attribute if present
        const altMatch = (prefix + suffix).match(/alt=["']([^"']*)["']/i);
        if (altMatch && altMatch[1]) {
          keyword = altMatch[1].trim().replace(/\s+/g, ',');
        }
      }

      const encodedKeyword = encodeURIComponent(keyword.toLowerCase());
      finalSrc = `https://images.unsplash.com/featured/?${encodedKeyword}`;
    }

    const { prefix: cleanPrefix, suffix: cleanSuffix } = injectBgClass(prefix, suffix);
    return `<img${cleanPrefix}src="${finalSrc}"${cleanSuffix}>`;
  });

  // 2. Process style="..." attributes containing background-image: url('...')
  sanitized = sanitized.replace(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/gi, (match, url) => {
    let cleanUrl = url.trim();

    // Outdated source.unsplash.com sanitization fail-safe
    if (cleanUrl.includes('source.unsplash.com')) {
      const queryIdx = cleanUrl.indexOf('?');
      if (queryIdx !== -1) {
        const query = cleanUrl.substring(queryIdx + 1);
        const cleanQuery = query.replace(/^\d+x\d+&?/, '').trim();
        if (cleanQuery) {
          cleanUrl = `https://images.unsplash.com/featured/?${cleanQuery}`;
        }
      } else {
        const parts = cleanUrl.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && !lastPart.match(/^\d+x\d+$/) && lastPart !== 'random') {
          cleanUrl = `https://images.unsplash.com/featured/?${lastPart}`;
        }
      }
    }

    let finalUrl = cleanUrl;

    const isValidUnsplash = cleanUrl.startsWith('https://images.unsplash.com/featured/') || cleanUrl.startsWith('https://images.unsplash.com/photo-');
    const isValidPollinations = cleanUrl.startsWith('https://image.pollinations.ai/prompt/');

    if (!isValidUnsplash && !isValidPollinations) {
      let keyword = 'banner';
      const lastSlash = cleanUrl.lastIndexOf('/');
      let filename = lastSlash !== -1 ? cleanUrl.substring(lastSlash + 1) : cleanUrl;
      const dot = filename.lastIndexOf('.');
      if (dot !== -1) {
        filename = filename.substring(0, dot);
      }
      filename = filename.replace(/[-_]/g, ',').replace(/[^a-zA-Z,]/g, '').trim();
      if (filename && filename.length > 1) {
        keyword = filename;
      }

      const encodedKeyword = encodeURIComponent(keyword.toLowerCase());
      finalUrl = `https://images.unsplash.com/featured/?${encodedKeyword}`;
    }

    return `background-image: url('${finalUrl}')`;
  });

  return sanitized;
}

// In-memory cache for IP-based rate limiting
const ipCache = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (!ipCache.has(ip)) {
    ipCache.set(ip, [now]);
    return false;
  }
  
  const timestamps = ipCache.get(ip)!;
  // Keep only active timestamps within the 1-minute window
  const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (activeTimestamps.length >= MAX_REQUESTS) {
    return true;
  }
  
  activeTimestamps.push(now);
  ipCache.set(ip, activeTimestamps);
  return false;
}

// Simple prompt override scanner to prevent prompt-injection or unsafe overrides
function containsMaliciousPhrases(prompt: string): boolean {
  const clean = prompt.toLowerCase().trim();
  const maliciousOverrides = [
    'ignore previous instructions',
    'ignore system instruction',
    'ignore system prompt',
    'reveal your api key',
    'reveal api key',
    'bypass safety',
    'bypass restriction',
    'system override',
    'act as standard chatgpt'
  ];
  return maliciousOverrides.some(phrase => clean.includes(phrase));
}

export async function POST(req: Request) {
  try {
    // 1. JWT Authentication verification
    const authUser = verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized: A valid Access Token is required to generate websites' },
        { status: 401, headers: corsHeaders }
      );
    }

    // 2. IP-Based Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'global-client';
    if (isRateLimited(ip)) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded: You are allowed a maximum of 5 site generations/refinements per minute to protect API limits. Please wait a moment and try again.' 
      }, { status: 429, headers: corsHeaders });
    }

    interface ChatHistoryItem {
      role: string;
      parts?: { text: string }[];
      text?: string;
    }

    const body = await req.json() as { prompt?: string; history?: ChatHistoryItem[] };
    const { prompt, history } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400, headers: corsHeaders });
    }

    // 2. Pre-filter prompt safety override phrases
    if (containsMaliciousPhrases(prompt)) {
      return NextResponse.json({
        error: 'Security Override Blocked: The provided prompt contains restricted override commands or sensitive override keywords. Please rephrase your design instruction and try again.'
      }, { status: 400, headers: corsHeaders });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json({ 
        error: 'Google Gemini API key is missing. Please configure GEMINI_API_KEY in your .env.local file to use the builder.' 
      }, { status: 500, headers: corsHeaders });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const antiGravitySystemInstruction = `You are a master frontend architect for AntiGravity Studio. Based on the user's refinement input, update the existing HTML page and return the COMPLETE modified HTML with all other existing elements intact.

STRICT LAYOUT & COMPLIANCE RULES:
- Every card and component must have exactly padding: 24px and gap: 24px written inside the style classes/attributes (e.g. style="padding: 24px; gap: 24px;").
- The Hero section MUST have the bold title 'AntiGravity Studio', the subtitle 'We push the boundaries of digital creation.', and the image 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800'.
- The Services section MUST have exactly 3 cards, each using a raw <img> tag with these exact images:
  * Card 1: https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=500
  * Card 2: https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500
  * Card 3: https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500
- NO GRADIENTS: You are strictly forbidden from using abstract gradients, color overlays, or color blobs. Use the specific images and solid dark colors (bg-obsidian-950, bg-zinc-900, etc.) for backgrounds.
- STUCK LAYOUT & SCROLL RULES: You are strictly forbidden from using "fixed", "sticky", "absolute", "h-screen", or "overflow-hidden" on the main page wrapper, body, html, header, navbar, or sections. The top header/navbar MUST move naturally up and scroll off the screen. The entire page must scroll naturally with standard relative/static flow.
- Do NOT rewrite the page from scratch. Selectively update only the requested changes, keeping all spacing, hero content, services, and image properties intact.`;

    const genericSystemInstruction = `You are a master frontend architect. Based on the user's request, update or generate a premium, fully responsive, dark-themed HTML landing page, and return the COMPLETE HTML.

STRICT LAYOUT & COMPLIANCE RULES:
- Every card and component (including headers, sections, grids, cards, footers) must have exactly padding: 24px and gap: 24px written inside the style classes/attributes (style="padding: 24px; gap: 24px;").
- NO GRADIENTS: You are strictly forbidden from using abstract gradients, color overlays, or color blobs. Use high-quality photograph URLs and solid dark colors (bg-obsidian-950, bg-zinc-900, bg-slate-950, etc.) for backgrounds.
- Every image MUST use a raw <img> tag (no placeholders, canvas, or SVGs for photos). Every <img> tag MUST have class "object-cover bg-neutral-900".
- Choose high-quality live photos from Unsplash for image sources (e.g., https://images.unsplash.com/photo-... or https://images.unsplash.com/featured/?<keywords>).
- STUCK LAYOUT & SCROLL RULES: You are strictly forbidden from using "fixed", "sticky", "absolute", "h-screen", or "overflow-hidden" on the main page wrapper, body, html, header, navbar, or sections. The top header/navbar MUST move naturally up and scroll off the screen. The entire page must scroll naturally with standard relative/static flow.
- PERMANENT IMAGE REPLACEMENT RULE: You are strictly forbidden from generating div blocks with abstract gradients or color overlays to act as image placeholders. You MUST use raw <img> tags with high-resolution photography URLs from Unsplash (e.g., https://images.unsplash.com/photo-... or https://images.unsplash.com/featured/?<keyword>). The keyword MUST match the business context perfectly (e.g. "coffee-shop-interior" for a cafe, "sneaker-close-up" for shoes, "fitness-barbell" for gym).
- Do NOT rewrite the page from scratch if updating an existing page. Selectively update only the requested changes, keeping all spacing, layouts, and image properties intact.`;

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest',
      'gemini-2.5-pro',
      'gemini-pro-latest'
    ];

    let html = '';
    let lastError: unknown = null;
    let isFallbackResponse = false;
    let fallbackReasonStr = '';

    const isAntiGravity = isAntiGravityProject(prompt, history);

    // Check if we are doing multi-turn chat or first time generation
    if (!history || !Array.isArray(history) || history.length === 0) {
      if (isAntiGravity) {
        console.log('Generating initial page - returning new compliant AntiGravity Studio layout directly.');
        html = getCompliantLayout();
      } else {
        console.log('Generating custom initial page via Gemini API...');
        const promptText = `Generate a premium dark-themed landing page HTML for: "${prompt}". Remember to follow all spacing (padding: 24px, gap: 24px) and raw <img> tag rules.`;
        for (const modelName of modelsToTry) {
          try {
            console.log(`Attempting real AI generation with model: ${modelName} (Initial generation)`);
            const model = genAI.getGenerativeModel({
              model: modelName,
              systemInstruction: genericSystemInstruction,
              safetySettings: safetySettings
            });

            const result = await model.generateContent(promptText);
            const response = await result.response;
            html = response.text();

            if (html) {
              console.log(`Successfully generated using real AI model: ${modelName}`);
              break;
            }
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.warn(`Model ${modelName} failed:`, errorMessage);
            lastError = err;
          }
        }
      }
    } else {
      const sysInstruction = isAntiGravity ? antiGravitySystemInstruction : genericSystemInstruction;
      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting real AI generation with model: ${modelName} (Multi-turn chat with safety settings)`);
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: sysInstruction,
            safetySettings: safetySettings
          });

          const chatHistory = history.map((item) => ({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.parts?.[0]?.text || item.text || '' }]
          }));

          const chat = model.startChat({
            history: chatHistory
          });

          const result = await chat.sendMessage(prompt);
          const response = await result.response;
          html = response.text();

          if (html) {
            console.log(`Successfully generated using real AI model: ${modelName}`);
            break;
          }
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.warn(`Model ${modelName} failed:`, errorMessage);
          lastError = err;
        }
      }
    }

    if (!html) {
      console.warn('Gemini generation failed or hit rate limits. Triggering offline fallback page compiler.');
      const rawReason = lastError instanceof Error ? lastError.message : (lastError ? String(lastError) : 'API Quota Exceeded');
      fallbackReasonStr = rawReason
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/[^\x20-\x7E]/g, '')
        .trim();
      if (fallbackReasonStr.length > 150) {
        fallbackReasonStr = fallbackReasonStr.substring(0, 150) + '...';
      }
      html = generateOfflineFallback(prompt);
      isFallbackResponse = true;
    }

    // Clean up markdown code wrapping in case Gemini wraps it anyway
    html = html.trim();
    if (!isFallbackResponse) {
      if (html.startsWith('```html')) {
        html = html.substring(7);
      }
      if (html.startsWith('```')) {
        html = html.substring(3);
      }
      if (html.endsWith('```')) {
        html = html.substring(0, html.length - 3);
      }
      html = html.trim();
    }
    html = sanitizeHtmlImages(html);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Generated-Fallback': isFallbackResponse ? 'true' : 'false',
        'X-Fallback-Reason': fallbackReasonStr,
        ...corsHeaders
      },
    });
  } catch (error: unknown) {
    console.error('Error in API generation route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while communicating with Gemini API.';
    return NextResponse.json({ error: errorMessage }, { status: 500, headers: corsHeaders });
  }
}

// ==========================================
// OFFLINE BACKUP COMPILER & TEMPLATES
// ==========================================

function isDefaultLayoutRequest(prompt: string): boolean {
  const clean = prompt.toLowerCase().trim();
  const resetKeywords = ['reset', 'rebuild', 'restart', 'clear', 'wipe', 'default template', 'hard reset'];
  const hasResetKeyword = resetKeywords.some(kw => clean.includes(kw));
  const isAntiGravityStudio = clean.includes('antigravity');
  const hasHeroDetails = clean.includes('push the boundaries of digital creation') || clean.includes('photo-1618005182384-a83a8bd57fbe');
  
  return hasResetKeyword || isAntiGravityStudio || hasHeroDetails;
}

function isAntiGravityProject(prompt: string, history?: { role: string; parts?: { text: string }[]; text?: string }[]): boolean {
  if (isDefaultLayoutRequest(prompt)) return true;
  if (history) {
    for (const msg of history) {
      const text = msg.parts?.[0]?.text || msg.text || '';
      if (isDefaultLayoutRequest(text)) return true;
    }
  }
  return false;
}

function generateOfflineFallback(prompt: string): string {
  const clean = prompt.toLowerCase();
  if (clean.includes('gym') || clean.includes('fitness') || clean.includes('titangym') || clean.includes('workout')) {
    return getTitanGymTemplate();
  }
  if (clean.includes('sneaker') || clean.includes('shoe') || clean.includes('kick') || clean.includes('footwear') || clean.includes('hyperkicks')) {
    return getHyperKicksTemplate();
  }
  if (clean.includes('saas') || clean.includes('dashboard') || clean.includes('analytics') || clean.includes('metrics') || clean.includes('software')) {
    return getSaaSTemplate();
  }
  if (clean.includes('portfolio') || clean.includes('agency') || clean.includes('creative') || clean.includes('design') || clean.includes('studio') || clean.includes('photography')) {
    return getPortfolioTemplate();
  }
  if (clean.includes('fitness') || clean.includes('gym') || clean.includes('health') || clean.includes('workout') || clean.includes('wellness') || clean.includes('trainer')) {
    return getFitnessTemplate();
  }
  if (clean.includes('watch') || clean.includes('luxury') || clean.includes('shop') || clean.includes('store') || clean.includes('e-commerce') || clean.includes('product')) {
    return getWatchTemplate();
  }
  return getCompliantLayout();
}

function getHyperKicksTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HyperKicks - Luxury Sneakers</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            obsidian: {
              50: '#f4f4f5',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>
  <style>
    .component {
      padding: 24px !important;
      gap: 24px !important;
    }
    .card {
      padding: 24px !important;
      gap: 24px !important;
    }
  </style>
</head>
<body class="bg-neutral-950 text-zinc-100 min-h-screen font-sans">
  <div class="component flex flex-col w-full max-w-7xl mx-auto" style="padding: 24px; gap: 24px;">
    
    <header class="component flex flex-col sm:flex-row items-center justify-between border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-2xl" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 12px;">
        <div class="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700/50">
          <span class="text-zinc-100 font-bold text-sm">HK</span>
        </div>
        <span class="font-bold text-lg text-zinc-100 tracking-tight">HyperKicks</span>
      </div>
      <nav class="flex flex-wrap justify-center" style="gap: 24px;">
        <a href="#collection" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Collection</a>
        <a href="#materials" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Materials</a>
        <a href="#about" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">About Us</a>
      </nav>
      <button class="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all">
        Shop Luxury
      </button>
    </header>

    <section id="hero" class="component grid grid-cols-1 lg:grid-cols-2 items-center border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="component flex flex-col justify-center" style="padding: 24px; gap: 24px;">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-300 text-xs font-semibold w-fit">
          <span>👟 Premium Craftsmanship</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
          Walk the Future. HyperKicks Luxury.
        </h1>
        <p class="text-base text-zinc-400 leading-relaxed max-w-lg">
          Experience unrivaled comfort and striking design engineered with carbon fiber arches, aerospace cushioning, and premium Italian full-grain leather.
        </p>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center" style="gap: 24px;">
          <button class="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-bold text-zinc-950 transition-all text-center">
            Buy Now
          </button>
          <button class="px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-sm font-bold text-zinc-200 transition-all text-center">
            Explore Materials
          </button>
        </div>
      </div>
      <div class="component relative w-full h-80 rounded-2xl overflow-hidden border border-neutral-800" style="padding: 24px; gap: 24px;">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" alt="HyperKicks Red Sneaker Edition" class="w-full h-full object-cover bg-neutral-900" />
      </div>
    </section>

    <section id="collection" class="component flex flex-col border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="flex flex-col" style="gap: 8px;">
        <h2 class="text-2xl font-bold text-zinc-100">Featured Releases</h2>
        <p class="text-xs text-zinc-500">Limited quantities. Engineered for peak daily styling and maximum impact.</p>
      </div>
      
      <div class="component grid grid-cols-1 md:grid-cols-3" style="padding: 24px; gap: 24px;">
        
        <div class="card flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/40" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850">
            <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500" alt="HyperKicks Emerald Velocity" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Emerald Velocity</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Aerodynamic chassis styled with rich matte-green overlays and secure athletic lacing.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">01 / MODEL</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/40" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850">
            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500" alt="HyperKicks Prism Aura" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Prism Aura</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Iridescent elements that shift colors with light, paired with responsive air padding.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">02 / MODEL</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/40" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850">
            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500" alt="HyperKicks Classic Leather" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Monochrome Obsidian</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Premium full-grain leather, sleek styling, and standard dynamic arch orthotic support.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">03 / MODEL</span>
        </div>

      </div>
    </section>

    <footer class="component flex flex-col sm:flex-row items-center justify-between border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-2xl text-xs font-mono text-zinc-500" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 8px;">
        <span class="font-bold text-zinc-300">HyperKicks Brand</span>
        <span>© 2026. All rights reserved.</span>
      </div>
      <div class="flex" style="gap: 24px;">
        <a href="#" class="hover:text-zinc-300 transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-zinc-300 transition-colors">Terms of Service</a>
      </div>
    </footer>

  </div>
</body>
</html>`;
}

function getTitanGymTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TITANGYM - Premium Neon Fitness</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            obsidian: {
              50: '#f4f4f5',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>
  <style>
    .component {
      padding: 24px !important;
      gap: 24px !important;
    }
    .card {
      padding: 24px !important;
      gap: 24px !important;
    }
  </style>
</head>
<body class="bg-neutral-950 text-zinc-100 min-h-screen font-sans">
  <div class="component flex flex-col w-full max-w-7xl mx-auto" style="padding: 24px; gap: 24px;">
    
    <header class="component flex flex-col sm:flex-row items-center justify-between border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-2xl" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 12px;">
        <div class="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center border border-lime-500 shadow-[0_0_10px_rgba(163,230,53,0.5)] animate-pulse">
          <span class="text-neutral-950 font-extrabold text-sm">TG</span>
        </div>
        <span class="font-extrabold text-xl text-zinc-100 tracking-wider font-sans">TITANGYM</span>
      </div>
      <nav class="flex flex-wrap justify-center" style="gap: 24px;">
        <a href="#hero" class="text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors">Home</a>
        <a href="#facility" class="text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors">Facility</a>
        <a href="#membership" class="text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors">Membership</a>
      </nav>
      <button class="px-4 py-2 rounded-xl bg-lime-400 text-neutral-950 hover:bg-lime-500 text-xs font-bold transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]">
        Join the Labs
      </button>
    </header>

    <section id="hero" class="component grid grid-cols-1 lg:grid-cols-2 items-center border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="component flex flex-col justify-center" style="padding: 24px; gap: 24px;">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-neutral-900 border border-lime-400/30 text-lime-400 text-xs font-semibold w-fit">
          <span>⚡ Biometric Workout Grids Active</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
          Forge Your Limits. Become a Titan.
        </h1>
        <p class="text-base text-zinc-400 leading-relaxed max-w-lg">
          Unleash raw power inside the heavy iron facility. Guided by real-time biometric metrics, active coaching algorithms, and progressive conditioning protocols.
        </p>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center" style="gap: 24px;">
          <button class="px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-sm font-bold text-neutral-950 transition-all text-center shadow-[0_0_15px_rgba(163,230,53,0.3)]">
            Start Training
          </button>
          <button class="px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-sm font-bold text-zinc-200 transition-all text-center">
            View Analytics
          </button>
        </div>
      </div>
      <div class="component relative w-full h-80 rounded-2xl overflow-hidden border border-neutral-800" style="padding: 24px; gap: 24px;">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" alt="TitanGym Heavy Iron Area" class="w-full h-full object-cover bg-neutral-900" />
      </div>
    </section>

    <section id="facility" class="component grid grid-cols-1 lg:grid-cols-2 items-center border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="component relative w-full h-80 rounded-2xl overflow-hidden border border-neutral-800" style="padding: 24px; gap: 24px;">
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200" alt="TitanGym Premium Facility" class="w-full h-full object-cover bg-neutral-900" />
      </div>
      <div class="component flex flex-col justify-center" style="padding: 24px; gap: 24px;">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-400 text-xs font-semibold w-fit">
          <span>🦾 Facility Specs</span>
        </div>
        <h2 class="text-3xl font-bold tracking-tight text-zinc-100">
          Heavy Iron Parameters
        </h2>
        <p class="text-base text-zinc-400 leading-relaxed">
          Our specialized laboratory facility houses custom calibrated plates, biometric scanning telemetry, specialized power bars, and fully customized air-purified training zones.
        </p>
      </div>
    </section>

    <section id="membership" class="component flex flex-col border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="flex flex-col" style="gap: 8px;">
        <h2 class="text-2xl font-bold text-zinc-100">Membership Tiers</h2>
        <p class="text-xs text-zinc-500">Pick your activation level and start forging your physical capabilities.</p>
      </div>
      
      <div class="component grid grid-cols-1 md:grid-cols-3" style="padding: 24px; gap: 24px;">
        
        <!-- Tier 1 -->
        <div class="card flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/40" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850">
            <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500" alt="Iron Cadet Class" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Iron Cadet</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Standard access to training facility, metric loggers, and basic biometric lockers.
            </p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xl font-bold text-lime-400">$49<span class="text-xs text-neutral-500">/mo</span></span>
            <button class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] text-zinc-200 font-bold transition-all">Select</button>
          </div>
        </div>

        <!-- Tier 2 -->
        <div class="card flex flex-col justify-between rounded-2xl border border-lime-400/30 bg-neutral-950/40 relative shadow-[0_0_20px_rgba(163,230,53,0.05)]" style="padding: 24px; gap: 24px;">
          <div class="absolute top-3 right-3 px-2 py-0.5 rounded bg-lime-400 text-neutral-950 text-[9px] font-extrabold uppercase tracking-widest">PRO CHOICE</div>
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850">
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500" alt="Cyber Titan Program" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100 font-bold text-lime-400">Cyber Titan</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Full facility access, custom biometric telemetry integration, and individual programming reviews.
            </p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xl font-bold text-lime-400">$89<span class="text-xs text-neutral-500">/mo</span></span>
            <button class="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-500 text-neutral-950 text-[10px] font-extrabold transition-all">Select</button>
          </div>
        </div>

        <!-- Tier 3 -->
        <div class="card flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/40" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850">
            <img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=500" alt="Apex Singularity Elite" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Apex Singularity</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              24/7 keycard access, elite recovery lab chambers, and dedicated direct trainer calls.
            </p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xl font-bold text-lime-400">$149<span class="text-xs text-neutral-500">/mo</span></span>
            <button class="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] text-zinc-200 font-bold transition-all">Select</button>
          </div>
        </div>

      </div>
    </section>

    <footer class="component flex flex-col sm:flex-row items-center justify-between border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-2xl text-xs font-mono text-zinc-500" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 8px;">
        <span class="font-bold text-zinc-300">TitanGym Labs</span>
        <span>© 2026. All rights reserved.</span>
      </div>
      <div class="flex" style="gap: 24px;">
        <a href="#" class="hover:text-zinc-300 transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-zinc-300 transition-colors">Terms of Service</a>
      </div>
    </footer>

  </div>
</body>
</html>`;
}

function getSaaSTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AetherMetrics - AI Analytics Platform</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            obsidian: {
              50: '#f4f4f5',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>
  <style>
    .component {
      padding: 24px !important;
      gap: 24px !important;
    }
    .card {
      padding: 24px !important;
      gap: 24px !important;
    }
  </style>
</head>
<body class="bg-obsidian-950 text-zinc-100 min-h-screen font-sans">
  <div class="component flex flex-col w-full max-w-7xl mx-auto" style="padding: 24px; gap: 24px;">
    
    <header class="component flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800/80 bg-obsidian-900 rounded-2xl" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 12px;">
        <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <span class="text-zinc-100 font-bold text-sm">AM</span>
        </div>
        <span class="font-bold text-lg text-zinc-100 tracking-tight">AetherMetrics</span>
      </div>
      <nav class="flex flex-wrap justify-center" style="gap: 24px;">
        <a href="#dashboard" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Dashboard</a>
        <a href="#features" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Features</a>
        <a href="#pricing" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</a>
      </nav>
      <button class="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all">
        Launch App
      </button>
    </header>

    <section id="hero" class="component grid grid-cols-1 lg:grid-cols-2 items-center border border-zinc-800/50 bg-obsidian-900/60 rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="component flex flex-col justify-center" style="padding: 24px; gap: 24px;">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/30 text-zinc-300 text-xs font-semibold w-fit">
          <span>⚡ Quantum Analytics Platform</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
          Next-Gen AI Analytics Dashboard
        </h1>
        <p class="text-base text-zinc-400 leading-relaxed max-w-lg">
          Unleash deep insights using high-fidelity data structures, automated anomaly detection, and predictive models.
        </p>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center" style="gap: 24px;">
          <button class="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-bold text-zinc-950 transition-all text-center">
            Get Started
          </button>
          <button class="px-6 py-3 rounded-xl bg-obsidian-950 hover:bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-200 transition-all text-center">
            Learn More
          </button>
        </div>
      </div>
      <div class="component relative w-full h-80 rounded-2xl overflow-hidden border border-zinc-800" style="padding: 24px; gap: 24px;">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800" alt="Dashboard Preview" class="w-full h-full object-cover bg-neutral-900" />
      </div>
    </section>

    <section id="features" class="component flex flex-col border border-zinc-800/50 bg-obsidian-900/40 rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="flex flex-col" style="gap: 8px;">
        <h2 class="text-2xl font-bold text-zinc-100">Core Features</h2>
        <p class="text-xs text-zinc-500">Powerful analytics suite built to scale with your business intelligence requirements.</p>
      </div>
      
      <div class="component grid grid-cols-1 md:grid-cols-3" style="padding: 24px; gap: 24px;">
        
        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500" alt="Real-time Tracking" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Real-time Stream</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Track thousands of concurrent events per second with sub-millisecond latency.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">01 / FEATURE</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500" alt="Anomaly Detection" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Anomaly Radar</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Identify outliers instantly using automated statistical scanning.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">02 / FEATURE</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=500" alt="Predictive Analytics" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Predictive Engine</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Forecast key operational metrics up to 90 days out with high confidence.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">03 / FEATURE</span>
        </div>

      </div>
    </section>

    <footer class="component flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/80 bg-obsidian-900 rounded-2xl text-xs font-mono text-zinc-500" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 8px;">
        <span class="font-bold text-zinc-300">AetherMetrics</span>
        <span>© 2026. All rights reserved.</span>
      </div>
      <div class="flex" style="gap: 24px;">
        <a href="#" class="hover:text-zinc-300 transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-zinc-300 transition-colors">Terms of Service</a>
      </div>
    </footer>

  </div>
</body>
</html>`;
}

function getPortfolioTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaStudio - Elite Creative Agency</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            obsidian: {
              50: '#f4f4f5',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>
  <style>
    .component {
      padding: 24px !important;
      gap: 24px !important;
    }
    .card {
      padding: 24px !important;
      gap: 24px !important;
    }
  </style>
</head>
<body class="bg-obsidian-950 text-zinc-100 min-h-screen font-sans">
  <div class="component flex flex-col w-full max-w-7xl mx-auto" style="padding: 24px; gap: 24px;">
    
    <header class="component flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800/80 bg-obsidian-900 rounded-2xl" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 12px;">
        <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <span class="text-zinc-100 font-bold text-sm">NS</span>
        </div>
        <span class="font-bold text-lg text-zinc-100 tracking-tight">NovaStudio</span>
      </div>
      <nav class="flex flex-wrap justify-center" style="gap: 24px;">
        <a href="#work" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Our Work</a>
        <a href="#team" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Team</a>
        <a href="#contact" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Contact</a>
      </nav>
      <button class="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all">
        Start Project
      </button>
    </header>

    <section id="hero" class="component grid grid-cols-1 lg:grid-cols-2 items-center border border-zinc-800/50 bg-obsidian-900/60 rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="component flex flex-col justify-center" style="padding: 24px; gap: 24px;">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/30 text-zinc-300 text-xs font-semibold w-fit">
          <span>✨ Design & Branding Studio</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
          Crafting Digital Masterpieces
        </h1>
        <p class="text-base text-zinc-400 leading-relaxed max-w-lg">
          We combine cutting-edge art with modern frontend systems to launch immersive brand experiences.
        </p>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center" style="gap: 24px;">
          <button class="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-bold text-zinc-950 transition-all text-center">
            View Work
          </button>
          <button class="px-6 py-3 rounded-xl bg-obsidian-950 hover:bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-200 transition-all text-center">
            Contact Us
          </button>
        </div>
      </div>
      <div class="component relative w-full h-80 rounded-2xl overflow-hidden border border-zinc-800" style="padding: 24px; gap: 24px;">
        <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800" alt="Office Studio" class="w-full h-full object-cover bg-neutral-900" />
      </div>
    </section>

    <section id="work" class="component flex flex-col border border-zinc-800/50 bg-obsidian-900/40 rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="flex flex-col" style="gap: 8px;">
        <h2 class="text-2xl font-bold text-zinc-100">Featured Projects</h2>
        <p class="text-xs text-zinc-500">Explore our latest award-winning interactive case studies.</p>
      </div>
      
      <div class="component grid grid-cols-1 md:grid-cols-3" style="padding: 24px; gap: 24px;">
        
        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1544441893-675973731853?q=80&w=500" alt="Brand Identity" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Ethereal Identity</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              A minimalist high-fashion branding and packaging layout.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">01 / PROJECT</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500" alt="Interactive System" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Interactive Canvas</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              WebGL-driven art exhibition page supporting fluid physics.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">02 / PROJECT</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=500" alt="Creative Interface" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Omni App Layout</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Clean dashboard design for creative asset pipeline management.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">03 / PROJECT</span>
        </div>

      </div>
    </section>

    <footer class="component flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/80 bg-obsidian-900 rounded-2xl text-xs font-mono text-zinc-500" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 8px;">
        <span class="font-bold text-zinc-300">NovaStudio</span>
        <span>© 2026. All rights reserved.</span>
      </div>
      <div class="flex" style="gap: 24px;">
        <a href="#" class="hover:text-zinc-300 transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-zinc-300 transition-colors">Terms of Service</a>
      </div>
    </footer>

  </div>
</body>
</html>`;
}

function getFitnessTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PulseFit - Premium Fitness Tracking</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            obsidian: {
              50: '#f4f4f5',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>
  <style>
    .component {
      padding: 24px !important;
      gap: 24px !important;
    }
    .card {
      padding: 24px !important;
      gap: 24px !important;
    }
  </style>
</head>
<body class="bg-obsidian-950 text-zinc-100 min-h-screen font-sans">
  <div class="component flex flex-col w-full max-w-7xl mx-auto" style="padding: 24px; gap: 24px;">
    
    <header class="component flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800/80 bg-obsidian-900 rounded-2xl" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 12px;">
        <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <span class="text-zinc-100 font-bold text-sm">PF</span>
        </div>
        <span class="font-bold text-lg text-zinc-100 tracking-tight">PulseFit</span>
      </div>
      <nav class="flex flex-wrap justify-center" style="gap: 24px;">
        <a href="#training" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Programs</a>
        <a href="#coaches" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Coaches</a>
        <a href="#pricing" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</a>
      </nav>
      <button class="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all">
        Join Now
      </button>
    </header>

    <section id="hero" class="component grid grid-cols-1 lg:grid-cols-2 items-center border border-zinc-800/50 bg-obsidian-900/60 rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="component flex flex-col justify-center" style="padding: 24px; gap: 24px;">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/30 text-zinc-300 text-xs font-semibold w-fit">
          <span>💪 Elite Health Tracking</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
          Unleash Your Ultimate Potential
        </h1>
        <p class="text-base text-zinc-400 leading-relaxed max-w-lg">
          Track workouts, analyze biometric data, and follow customized fitness routines designed by world-class athletic trainers.
        </p>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center" style="gap: 24px;">
          <button class="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-bold text-zinc-950 transition-all text-center">
            Start Free Trial
          </button>
          <button class="px-6 py-3 rounded-xl bg-obsidian-950 hover:bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-200 transition-all text-center">
            View Programs
          </button>
        </div>
      </div>
      <div class="component relative w-full h-80 rounded-2xl overflow-hidden border border-zinc-800" style="padding: 24px; gap: 24px;">
        <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800" alt="Athletic Training" class="w-full h-full object-cover bg-neutral-900" />
      </div>
    </section>

    <section id="programs" class="component flex flex-col border border-zinc-800/50 bg-obsidian-900/40 rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="flex flex-col" style="gap: 8px;">
        <h2 class="text-2xl font-bold text-zinc-100">Custom Programs</h2>
        <p class="text-xs text-zinc-500">Pick from our carefully structured workout routines based on your personal fitness objectives.</p>
      </div>
      
      <div class="component grid grid-cols-1 md:grid-cols-3" style="padding: 24px; gap: 24px;">
        
        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500" alt="Strength Training" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Strength Builder</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Focus on weightlifting mechanics, hypertrophy, and maximum strength output.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">01 / PROGRAM</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=500" alt="Cardio & Conditioning" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Endurance Conditioning</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              High-intensity interval training (HIIT) to improve cardiovascular metrics.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">02 / PROGRAM</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500" alt="Mobility & Yoga" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Active Recovery</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Flexibility routines, mobility drills, and basic yoga classes for tissue health.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">03 / PROGRAM</span>
        </div>

      </div>
    </section>

    <footer class="component flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/80 bg-obsidian-900 rounded-2xl text-xs font-mono text-zinc-500" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 8px;">
        <span class="font-bold text-zinc-300">PulseFit</span>
        <span>© 2026. All rights reserved.</span>
      </div>
      <div class="flex" style="gap: 24px;">
        <a href="#" class="hover:text-zinc-300 transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-zinc-300 transition-colors">Terms of Service</a>
      </div>
    </footer>

  </div>
</body>
</html>`;
}

function getWatchTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chronos - Luxury Timepieces</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            obsidian: {
              50: '#f4f4f5',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>
  <style>
    .component {
      padding: 24px !important;
      gap: 24px !important;
    }
    .card {
      padding: 24px !important;
      gap: 24px !important;
    }
  </style>
</head>
<body class="bg-obsidian-950 text-zinc-100 min-h-screen font-sans">
  <div class="component flex flex-col w-full max-w-7xl mx-auto" style="padding: 24px; gap: 24px;">
    
    <header class="component flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800/80 bg-obsidian-900 rounded-2xl" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 12px;">
        <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <span class="text-zinc-100 font-bold text-sm">CH</span>
        </div>
        <span class="font-bold text-lg text-zinc-100 tracking-tight">Chronos</span>
      </div>
      <nav class="flex flex-wrap justify-center" style="gap: 24px;">
        <a href="#collections" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Collections</a>
        <a href="#movement" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Movement</a>
        <a href="#reserve" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Reserve</a>
      </nav>
      <button class="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all">
        Pre-Order
      </button>
    </header>

    <section id="hero" class="component grid grid-cols-1 lg:grid-cols-2 items-center border border-zinc-800/50 bg-obsidian-900/60 rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="component flex flex-col justify-center" style="padding: 24px; gap: 24px;">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/30 text-zinc-300 text-xs font-semibold w-fit">
          <span>🕰️ Precision Engineering</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
          A Caliber Above The Rest
        </h1>
        <p class="text-base text-zinc-400 leading-relaxed max-w-lg">
          Handcrafted mechanical timepieces engineered with obsidian calibers, high-frequency balance wheels, and premium sapphire crystals.
        </p>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center" style="gap: 24px;">
          <button class="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-bold text-zinc-950 transition-all text-center">
            Reserve Now
          </button>
          <button class="px-6 py-3 rounded-xl bg-obsidian-950 hover:bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-200 transition-all text-center">
            Explore Calibers
          </button>
        </div>
      </div>
      <div class="component relative w-full h-80 rounded-2xl overflow-hidden border border-zinc-800" style="padding: 24px; gap: 24px;">
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800" alt="Chronos Caliber Watch" class="w-full h-full object-cover bg-neutral-900" />
      </div>
    </section>

    <section id="collections" class="component flex flex-col border border-zinc-800/50 bg-obsidian-900/40 rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="flex flex-col" style="gap: 8px;">
        <h2 class="text-2xl font-bold text-zinc-100">Featured Models</h2>
        <p class="text-xs text-zinc-500">Meticulously constructed and limited to 250 units worldwide.</p>
      </div>
      
      <div class="component grid grid-cols-1 md:grid-cols-3" style="padding: 24px; gap: 24px;">
        
        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=500" alt="Obsidian Chrono" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Obsidian Stealth</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Featuring a custom matte titanium case and automatic movement.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">01 / MODEL</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=500" alt="Classic Gold" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Gold Horizon</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              18k rose gold build with a hand-stitched alligator strap.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">02 / MODEL</span>
        </div>

        <div class="card flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-obsidian-900" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-zinc-800">
            <img src="https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=500" alt="Aviator Steel" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Navigator Pro</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Anti-magnetic steel chassis with secondary timezone dials.
            </p>
          </div>
          <span class="text-[10px] text-zinc-500 font-bold block">03 / MODEL</span>
        </div>

      </div>
    </section>

    <footer class="component flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800/80 bg-obsidian-900 rounded-2xl text-xs font-mono text-zinc-500" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 8px;">
        <span class="font-bold text-zinc-300">Chronos Timepieces</span>
        <span>© 2026. All rights reserved.</span>
      </div>
      <div class="flex" style="gap: 24px;">
        <a href="#" class="hover:text-zinc-300 transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-zinc-300 transition-colors">Terms of Service</a>
      </div>
    </footer>

  </div>
</body>
</html>`;
}

function getCompliantLayout(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AntiGravity Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            obsidian: {
              50: '#f4f4f5',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>
  <style>
    .component {
      padding: 24px !important;
      gap: 24px !important;
    }
    .card {
      padding: 24px !important;
      gap: 24px !important;
    }
  </style>
</head>
<body class="bg-neutral-950 text-zinc-100 min-h-screen font-sans">
  <div class="component flex flex-col w-full max-w-7xl mx-auto" style="padding: 24px; gap: 24px;">
    
    <header class="component flex flex-col sm:flex-row items-center justify-between border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-2xl" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 12px;">
        <div class="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700/50">
          <span class="text-zinc-100 font-bold text-sm">AG</span>
        </div>
        <span class="font-bold text-lg text-zinc-100 tracking-tight">AntiGravity Studio</span>
      </div>
      <nav class="flex flex-wrap justify-center" style="gap: 24px;">
        <a href="#" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Generator</a>
        <a href="#" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Showcase</a>
        <a href="#" class="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Docs</a>
      </nav>
      <button class="px-4 py-2 rounded-xl bg-zinc-150 border border-neutral-800/85 bg-neutral-900 text-zinc-100 hover:bg-neutral-800 text-xs font-bold transition-all">
        Launch Sandbox
      </button>
    </header>

    <section id="hero" class="component flex flex-col items-center text-center border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="inline-flex items-center px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-zinc-300 text-xs font-semibold w-fit">
        <span>✨ Unrestricted AI Engine</span>
      </div>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight max-w-3xl animate-fade-in">
        Any Input. Any Industry. Instant Website.
      </h1>
      <p class="text-base text-zinc-400 leading-relaxed max-w-2xl">
        AntiGravity Studio breaks all boundaries. Type absolutely anything—a coffee shop, a futuristic gym, a cyber-security firm, or a personal portfolio—and watch our AI instantly build a premium landing page with context-relevant assets.
      </p>

      <!-- AI Prompt Bar -->
      <div class="w-full max-w-2xl bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-2 flex flex-col md:flex-row items-center" style="gap: 12px;">
        <div class="flex-1 w-full flex items-center px-3" style="gap: 8px;">
          <span class="text-zinc-505 text-sm">✦</span>
          <input 
            type="text" 
            readonly
            placeholder="Type any random business idea here... e.g., &quot;A cyberpunk clothing brand store&quot;" 
            class="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none py-2 cursor-default"
          />
        </div>
        <button class="w-full md:w-auto px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-bold text-zinc-950 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center" style="gap: 8px;">
          <span>Generate Instant Site</span>
        </button>
      </div>
    </section>

    <section id="previews" class="component flex flex-col border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-3xl" style="padding: 24px; gap: 24px;">
      <div class="flex flex-col" style="gap: 8px;">
        <h2 class="text-2xl font-bold text-zinc-100">Infinite Industries, Instant Generation</h2>
        <p class="text-xs text-zinc-500">Our AI automatically generates tailored visual languages, custom assets, and structural grids for any niche.</p>
      </div>
      
      <div class="component grid grid-cols-1 md:grid-cols-3" style="padding: 24px; gap: 24px;">
        
        <!-- Card 1: E-Commerce / Fashion -->
        <div class="card flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/40" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850 bg-neutral-900">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500" alt="E-Commerce / Fashion website layout" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">E-Commerce & Fashion</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Generates high-fashion lookbooks, dynamic sizing grids, cart integrations, and premium collection displays instantly.
            </p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[9px] text-zinc-500 font-bold tracking-wider">FASHION LAYOUT</span>
            <span class="text-[9px] text-emerald-400 font-mono">100% Live Assets</span>
          </div>
        </div>

        <!-- Card 2: Tech Startup / SaaS -->
        <div class="card flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/40" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850 bg-neutral-900">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500" alt="Tech Startup / SaaS layout" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">SaaS & Tech Platforms</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Compiles complex metric dashboards, feature grids with hover actions, pricing matrices, and secure login modules.
            </p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[9px] text-zinc-500 font-bold tracking-wider">TECH STARTUP</span>
            <span class="text-[9px] text-emerald-400 font-mono">100% Live Assets</span>
          </div>
        </div>

        <!-- Card 3: Luxury Cafe / Restaurant -->
        <div class="card flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950/40" style="padding: 24px; gap: 24px;">
          <div class="h-48 overflow-hidden rounded-xl border border-neutral-850 bg-neutral-900">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500" alt="Luxury Cafe / Restaurant layout" class="w-full h-full object-cover bg-neutral-900" />
          </div>
          <div class="flex flex-col font-sans" style="gap: 8px;">
            <h3 class="text-sm font-bold text-zinc-100">Luxury Cafe & Culinary</h3>
            <p class="text-xs text-zinc-400 leading-relaxed">
              Designs editorial menus, booking systems, high-end architectural imagery grids, and social proof showcases.
            </p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[9px] text-zinc-500 font-bold tracking-wider">CULINARY & LEISURE</span>
            <span class="text-[9px] text-emerald-400 font-mono">100% Live Assets</span>
          </div>
        </div>

      </div>
    </section>

    <footer class="component flex flex-col sm:flex-row items-center justify-between border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl rounded-2xl text-xs font-mono text-zinc-500" style="padding: 24px; gap: 24px;">
      <div class="flex items-center" style="gap: 8px;">
        <span class="font-bold text-zinc-300">AntiGravity Studio</span>
        <span>© 2026. All rights reserved.</span>
      </div>
      <div class="flex" style="gap: 24px;">
        <a href="#" class="hover:text-zinc-300 transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-zinc-300 transition-colors">Terms of Service</a>
      </div>
    </footer>

  </div>
</body>
</html>`;
}
