"use client";
 
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
 
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model_used?: string;
}
 
interface QuickBtn {
  label: string;
  icon: string;
  query: string;
}
 
const quickButtons: QuickBtn[] = [
  { label: "Best crops for black soil", icon: "🌱", query: "What are the best crops for black soil?" },
  { label: "Delhi weather today",        icon: "🌤️", query: "What is the weather in Delhi today?" },
  { label: "PM Kisan scheme 2025",       icon: "🏛️", query: "What are the latest PM Kisan scheme benefits 2025?" },
  { label: "Wheat farming guide",        icon: "🌾", query: "How to grow wheat crop? Complete guide." },
];
 
const FarmerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Farmer">
    <ellipse cx="18" cy="10" rx="11" ry="3" fill="#3b6d11" />
    <rect x="13" y="7" width="10" height="5" rx="2" fill="#4a8a1a" />
    <circle cx="18" cy="14.5" r="4.5" fill="#c8a97a" />
    <rect x="16.5" y="18.5" width="3" height="2" fill="#c8a97a" />
    <path d="M11 20 Q18 18 25 20 L26 30 Q18 32 10 30 Z" fill="#4a8a1a" />
    <path d="M11 21 Q7 24 8 28" stroke="#4a8a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M25 21 Q29 24 28 28" stroke="#4a8a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="8" cy="28.5" r="1.5" fill="#c8a97a" />
    <circle cx="28" cy="28.5" r="1.5" fill="#c8a97a" />
    <path d="M13 30 L12 35 M23 30 L24 35" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
 
const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <line x1="3" y1="7"  x2="21" y2="7"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
 
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
 
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
 
const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "🙏 Namaste! I'm AgriBot, your smart farming assistant. Ask me anything about crops, soil health, pest management, weather, or mandi prices!",
  timestamp: new Date(),
};
 
const SIDEBAR_WIDTH = 270;
const HEADER_H = 62;
 
// ── Themed markdown renderer ──────────────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  const parts = content.split("---");
  const mainText = parts[0].trim();
  const sourceSection = parts[1];
 
  return (
    <div>
      <div className="agri-markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p style={{ margin: "0 0 10px", lineHeight: 1.75, color: "#1a1a1a" }}>{children}</p>
            ),
            h1: ({ children }) => (
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a3a0a", margin: "14px 0 8px", borderBottom: "1.5px solid #bbf7d0", paddingBottom: 4 }}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a3a0a", margin: "12px 0 6px", borderBottom: "1px solid #d1fae5", paddingBottom: 3 }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#2d5a2d", margin: "10px 0 5px" }}>{children}</h3>
            ),
            strong: ({ children }) => (
              <strong style={{ fontWeight: 700, color: "#1a3a0a" }}>{children}</strong>
            ),
            em: ({ children }) => (
              <em style={{ fontStyle: "italic", color: "#3b5a1a" }}>{children}</em>
            ),
            ul: ({ children }) => (
              <ul style={{ margin: "6px 0 10px", paddingLeft: 0, listStyle: "none" }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol style={{ margin: "6px 0 10px", paddingLeft: 20 }}>{children}</ol>
            ),
            li: ({ children }) => (
              <li style={{ margin: "5px 0", lineHeight: 1.65, color: "#1a1a1a", display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#3b6d11", marginTop: 8, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{children}</span>
              </li>
            ),
            code: ({ children, className }) => {
              const isBlock = !!className?.startsWith("language-");
              if (isBlock) return (
                <pre style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", overflowX: "auto", margin: "8px 0", fontSize: 13 }}>
                  <code style={{ fontFamily: "'Fira Code','Courier New',monospace", color: "#14532d", lineHeight: 1.6 }}>{children}</code>
                </pre>
              );
              return (
                <code style={{ background: "#dcfce7", color: "#14532d", borderRadius: 4, padding: "1px 6px", fontSize: "0.88em", fontFamily: "'Fira Code','Courier New',monospace", border: "0.5px solid #bbf7d0" }}>{children}</code>
              );
            },
            blockquote: ({ children }) => (
              <blockquote style={{ borderLeft: "3px solid #4ade80", margin: "8px 0", background: "#f0fdf4", borderRadius: "0 6px 6px 0", padding: "8px 12px", color: "#374151" }}>{children}</blockquote>
            ),
            hr: () => <hr style={{ border: "none", borderTop: "1px solid #d1fae5", margin: "12px 0" }} />,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#3b6d11", textDecoration: "underline", textDecorationColor: "#86efac", textUnderlineOffset: 2 }}>{children}</a>
            ),
            table: ({ children }) => (
              <div style={{ overflowX: "auto", margin: "10px 0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, border: "1px solid #d1fae5", borderRadius: 8, overflow: "hidden" }}>{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead style={{ background: "#dcfce7" }}>{children}</thead>,
            th: ({ children }) => (
              <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#14532d", borderBottom: "1.5px solid #86efac", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{children}</th>
            ),
            td: ({ children }) => (
              <td style={{ padding: "7px 12px", borderBottom: "0.5px solid #e8faf0", color: "#1a1a1a", verticalAlign: "top" }}>{children}</td>
            ),
            tr: ({ children }) => (
              <tr onMouseEnter={e => (e.currentTarget.style.background = "#f0fdf4")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>{children}</tr>
            ),
          }}
        >
          {mainText}
        </ReactMarkdown>
      </div>
 
      {sourceSection && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "0.5px solid #d1fae5" }}>
          {sourceSection.split("\n").filter(Boolean).map((line, i) => {
            if (line.includes("📚")) return <p key={i} style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{line.trim()}</p>;
            const urlMatch = line.match(/\[(.+?)\]\((.+?)\)/);
            if (urlMatch) return (
              <a key={i} href={urlMatch[2]} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: 12, color: "#3b6d11", textDecoration: "none", marginBottom: 3 }}>🔗 {urlMatch[1]}</a>
            );
            return <p key={i} style={{ fontSize: 12, color: "#6b7280" }}>{line.trim()}</p>;
          })}
        </div>
      )}
    </div>
  );
}
 
// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} title="Copy response" style={{ display: "flex", alignItems: "center", gap: 4, background: copied ? "#dcfce7" : "transparent", border: `0.5px solid ${copied ? "#86efac" : "#e5e7eb"}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 11, color: copied ? "#14532d" : "#9ca3af", transition: "all 0.2s ease" }}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
 
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [messages, setMessages]       = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile]       = useState(false);
 
  // ── FIX: track the real usable viewport height on mobile ──────────────────
  const [viewportH, setViewportH]     = useState<number | null>(null);
 
  const chatEndRef   = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    const checkSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);
 
  // ── FIX: Use window.visualViewport to get the REAL visible height on mobile.
  //    On Android Chrome when keyboard opens:
  //      visualViewport.height  → shrinks (excludes keyboard)
  //      visualViewport.offsetTop → shifts (non-zero when page scrolled)
  //    We directly update the app-root top + height so the layout always
  //    fits exactly the visible area — input bar never hidden behind keyboard.
  useEffect(() => {
    const updateVh = () => {
      const vv = window.visualViewport;
      const h = vv?.height ?? window.innerHeight;
      const offsetTop = vv?.offsetTop ?? 0;
      setViewportH(h);
      document.documentElement.style.setProperty("--app-height", `${h}px`);
      // Directly reposition the fixed root to follow the visual viewport
      const root = document.querySelector(".app-root") as HTMLElement | null;
      if (root) {
        root.style.top = `${offsetTop}px`;
        root.style.height = `${h}px`;
      }
    };
    updateVh();
 
    window.visualViewport?.addEventListener("resize", updateVh);
    window.visualViewport?.addEventListener("scroll", updateVh);
    window.addEventListener("resize", updateVh);
    window.addEventListener("orientationchange", updateVh);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateVh);
      window.visualViewport?.removeEventListener("scroll", updateVh);
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
    };
  }, []);
 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  const isEmptyChat = messages.length === 1 && messages[0].role === "assistant";
 
  const sendMessage = async (text?: string) => {
    const query = text || input.trim();
    if (!query || loading) return;
    const userMsg: Message = { role: "user", content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    if (isMobile) setSidebarOpen(false);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, chat_history: history }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer || "Sorry, something went wrong.",
        timestamp: new Date(),
        model_used: data.model_used || undefined,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Error connecting to backend. Make sure the backend is running.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };
 
  // ── Compute the actual app height to use ─────────────────────────────────
  // On mobile we use the measured real viewport height; on desktop we use 100vh
  const appHeight = isMobile && viewportH ? `${viewportH}px` : "100vh";
 
  return (
    <>
      <style>{`
        .agri-markdown > *:last-child { margin-bottom: 0 !important; }
 
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
 
        .sidebar-transition {
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1),
                      margin  0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .quick-chip:hover { background: #dcfce7 !important; border-color: #86efac !important; transform: translateY(-1px); box-shadow: 0 3px 10px rgba(45,90,45,0.12); }
        .quick-chip { transition: all 0.18s ease; }
        .send-btn:hover:not(:disabled) { background: #3b6d11 !important; transform: scale(1.04); }
        .send-btn { transition: all 0.18s ease; }
        .overlay-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 40; animation: fadeIn 0.2s ease; }
        .hamburger-btn { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; background: none; border: 0.5px solid #e5e7eb; border-radius: 8px; cursor: pointer; color: #3b6d11; flex-shrink: 0; transition: background 0.15s ease; }
        .hamburger-btn:hover { background: #f0fdf4; }
 
        /*
         * ── ROOT FIX ─────────────────────────────────────────────────────────
         * We pin the entire app to the real visible viewport using position:fixed
         * + the --app-height CSS variable we set from visualViewport in JS.
         * This prevents the layout from ever being taller than what's actually
         * visible on screen, which is what caused the input bar to get hidden
         * behind the browser's bottom navigation bar on Android Chrome.
         *
         * IMPORTANT: We do NOT use height:100vh on mobile because on Android
         * Chrome, 100vh = full screen including the browser chrome, so the
         * bottom of the app ends up underneath the navigation bar.
         */
        .app-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          /* The JS effect sets --app-height accurately via visualViewport */
          height: var(--app-height, 100vh);
          overflow: hidden;
        }
 
        @media (max-width: 767px) {
          /* Extra padding for iOS notch / Android punch-hole cameras */
          .app-root {
            padding-top: env(safe-area-inset-top);
          }
 
          /* Hide chip labels ONLY inside the bottom input bar on mobile.
             Landing page chips (.landing-chip-label) always stay visible. */
          .chip-label { display: none; }
          .landing-chip-label { display: inline !important; }
 
          /* Full-width messages on mobile — no wasted side margins */
          .messages-inner { max-width: 100% !important; padding: 0 !important; }
 
          /* User bubbles use more width on mobile; assistant bubbles are already 100% */
          .bubble { max-width: 88% !important; }
          .bubble[data-role="assistant"] { max-width: 100% !important; flex: 1; }
 
          /* Input bar full width */
          .input-inner { max-width: 100% !important; }
 
          /* Reduce chat area horizontal padding on mobile */
          .messages-scroll { padding: 14px 10px !important; }
          .input-bar-wrap  { padding: 8px 10px 0 !important; }
        }
      `}</style>
 
      {/*
        * ── APP ROOT ───────────────────────────────────────────────────────────
        * height is driven by the JS-measured real viewport (appHeight).
        * display:flex + flexDirection:column means the header stays fixed at
        * the top, the body (sidebar + chat) fills the middle, and the input
        * bar is always anchored at the bottom — never pushed off screen.
        */}
      <div
        className="app-root"
        style={{
          display: "flex",
          flexDirection: "column",
          height: appHeight,           // ← real viewport height, not 100vh
          fontFamily: "'Inter',sans-serif",
          overflow: "hidden",
        }}
      >
 
        {/* ══ HEADER — always visible ══ */}
        <div style={{
          width: "100%",
          height: HEADER_H,
          minHeight: HEADER_H,
          padding: "0 16px",
          borderBottom: "0.5px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          flexShrink: 0,              // ← never shrink
          zIndex: 30,
          boxSizing: "border-box",
        }}>
          <button className="hamburger-btn" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            <HamburgerIcon />
          </button>
          <div style={{ width: 36, height: 36, background: "#eaf3de", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🌱</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap" }}>AgriBot Assistant</div>
            <div style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Ask about crops, soil, weather &amp; mandi prices</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, background: "#4CAF50", borderRadius: "50%" }} />
            <span style={{ fontSize: 12, color: "#6b7280" }}>Online</span>
          </div>
        </div>
 
        {/* ══ BODY ══ */}
        <div style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",         // ← critical: prevents body from growing past available space
          position: "relative",
          minHeight: 0,               // ← FIX: flex children need minHeight:0 to allow shrinking
        }}>
 
          {isMobile && sidebarOpen && <div className="overlay-backdrop" onClick={() => setSidebarOpen(false)} />}
 
          {/* ── Sidebar ── */}
          <div className="sidebar-transition" style={{
            width: SIDEBAR_WIDTH,
            background: "#1a3a1a",
            color: "#e8f5e8",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            ...(isMobile
              ? {
                  position: "fixed",
                  top: HEADER_H,
                  left: 0,
                  height: `calc(${appHeight} - ${HEADER_H}px)`,  // ← use real height
                  zIndex: 50,
                  transform: sidebarOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
                }
              : {
                  position: "relative",
                  transform: sidebarOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
                  marginRight: sidebarOpen ? 0 : -SIDEBAR_WIDTH,
                }),
          }}>
            <div style={{ padding: "20px 16px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, background: "#2d5a2d", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌾</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>AgriBot</div>
                  <div style={{ fontSize: 11, color: "rgba(232,245,232,0.6)" }}>Smart Farming Assistant</div>
                </div>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 10, color: "rgba(232,245,232,0.4)", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Capabilities</div>
              {[
                { icon: "📚", label: "PDF knowledge base" },
                { icon: "🌤️", label: "Live weather info" },
                { icon: "💹", label: "Mandi prices" },
                { icon: "🔍", label: "Web search fallback" },
                { icon: "💬", label: "Chat with memory" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", borderRadius: 8, marginBottom: 2, fontSize: 13, color: "rgba(232,245,232,0.8)" }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
                </div>
              ))}
            </div>
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ fontSize: 10, color: "rgba(232,245,232,0.4)", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Powered by</div>
              {["Groq LLaMA 3.3 70b", "Pinecone Vector DB", "BGE Embeddings + Reranker", "LangChain Agent"].map(item => (
                <div key={item} style={{ fontSize: 12, color: "rgba(232,245,232,0.6)", padding: "4px 8px", marginBottom: 2 }}>· {item}</div>
              ))}
            </div>
            <div style={{ marginTop: "auto", padding: 16, borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
              <button
                onClick={() => {
                  setMessages([{ ...INITIAL_MESSAGE, timestamp: new Date() }]);
                  if (isMobile) setSidebarOpen(false);
                }}
                style={{ width: "100%", padding: "8px 0", background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "rgba(232,245,232,0.7)", fontSize: 13, cursor: "pointer" }}
              >
                🗑️ Clear conversation
              </button>
            </div>
          </div>
 
          {/* ── Chat area ── */}
          {/*
            * This is a flex column that must fill the remaining horizontal space.
            * The key fix is:  flex:1  +  minWidth:0  +  overflow:hidden  on this
            * container, plus  flex:1  +  minHeight:0  +  overflowY:auto  on the
            * messages scroll area, and  flexShrink:0  on the input bar.
            * Together these ensure:
            *   • Messages area takes all available vertical space and scrolls
            *   • Input bar is ALWAYS rendered at the bottom, never pushed off screen
            */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#fafaf8",
            minWidth: 0,
            minHeight: 0,             // ← allow the flex child to shrink
            overflow: "hidden",       // ← clip, don't scroll the whole chat area
          }}>
 
            {isEmptyChat ? (
              /* ── Landing page ── */
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px 16px",
                animation: "fadeSlideUp 0.4s ease",
                overflowY: "auto",
                minHeight: 0,
              }}>
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                  <div style={{ width: 72, height: 72, background: "#2d5a2d", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(45,90,45,0.2)" }}>🌾</div>
                  <h1 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Namaste! I&apos;m AgriBot 🙏</h1>
                  <p style={{ fontSize: "clamp(13px,2vw,15px)", color: "#6b7280", maxWidth: 480, lineHeight: 1.6 }}>Your AI-powered smart farming assistant. Ask me about crops, soil health, pest management, mandi prices, or government schemes.</p>
                </div>
                <div style={{ width: "100%", maxWidth: 620, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", marginBottom: 20 }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ask your farming question..."
                    autoFocus
                    style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, color: "#1a1a1a" }}
                  />
                  <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}
                    style={{ width: 38, height: 38, background: input.trim() ? "#2d5a2d" : "#e5e7eb", border: "none", borderRadius: 10, color: "white", cursor: input.trim() ? "pointer" : "not-allowed", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 640 }}>
                  {quickButtons.map(btn => (
                    <button key={btn.label} className="quick-chip" onClick={() => sendMessage(btn.query)} disabled={loading}
                      style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", border: "1px solid #d1fae5", borderRadius: 24, background: "#f0fdf4", color: "#2d5a2d", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 16 }}>{btn.icon}</span>
                      {/* landing-chip-label always visible on ALL screen sizes including mobile */}
                      <span className="landing-chip-label">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
 
            ) : (
              /*
               * ── Conversation view ─────────────────────────────────────────
               * CRITICAL STRUCTURE for the input bar to always be visible:
               *
               *   [chat area div]          flex column, overflow:hidden
               *     [messages-scroll]      flex:1, minHeight:0, overflowY:auto  ← scrolls
               *     [input-bar-wrap]       flexShrink:0                          ← stays put
               *
               * With this structure the messages area takes all available space
               * and scrolls internally, while the input bar is a fixed-height
               * sibling that never gets pushed off screen.
               */
              <>
                {/* Messages scroll area */}
                <div
                  className="messages-scroll"
                  style={{
                    flex: 1,
                    minHeight: 0,           // ← THE KEY FIX: without this, a flex child
                                            //   won't shrink below its content size, which
                                            //   pushes the input bar off the bottom of the screen
                    overflowY: "auto",
                    padding: "14px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    WebkitOverflowScrolling: "touch", // smooth scroll on iOS
                  }}
                >
                  <div
                    className="messages-inner"
                    style={{ width: "100%", maxWidth: 760, display: "flex", flexDirection: "column", gap: 14 }}
                  >
                    {messages.map((msg, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start", animation: "fadeSlideUp 0.25s ease" }}>
                        {/* Avatar */}
                        <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "assistant" ? "#2d5a2d" : "#eaf3de", overflow: "hidden" }}>
                          {msg.role === "assistant" ? <span style={{ fontSize: 17 }}>🌾</span> : <FarmerIcon />}
                        </div>
 
                        {/* Bubble */}
                        <div
                          className="bubble"
                          data-role={msg.role}
                          style={{ maxWidth: msg.role === "user" ? "min(72%, 560px)" : "100%", flex: msg.role === "assistant" ? 1 : undefined, padding: "10px 13px", borderRadius: msg.role === "user" ? "14px 2px 14px 14px" : "2px 14px 14px 14px", background: msg.role === "user" ? "#2d5a2d" : "#fff", color: msg.role === "user" ? "#e8f5e8" : "#1a1a1a", fontSize: 14, border: msg.role === "assistant" ? "0.5px solid #e5e7eb" : "none", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                        >
                          {msg.role === "assistant"
                            ? <MarkdownContent content={msg.content} />
                            : <p style={{ margin: 0, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                          }
 
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 6, borderTop: msg.role === "assistant" ? "0.5px solid #f0f0f0" : "none", gap: 6, flexWrap: "wrap" }}>
                            {msg.role === "assistant" && msg.model_used ? (
                              <span style={{ fontSize: 11, background: msg.model_used === "Groq" ? "#f0fdf4" : "#eff6ff", color: msg.model_used === "Groq" ? "#3b6d11" : "#1d4ed8", border: `0.5px solid ${msg.model_used === "Groq" ? "#bbf7d0" : "#bfdbfe"}`, borderRadius: 20, padding: "3px 10px", fontWeight: 500 }}>
                                🤖 {msg.model_used === "Groq" ? "Groq LLaMA-3.3-70b" : "Gemini 2.5 Flash"}
                              </span>
                            ) : <span />}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                              {msg.role === "assistant" && <CopyButton text={msg.content} />}
                              <span style={{ fontSize: 10, color: msg.role === "user" ? "rgba(232,245,232,0.5)" : "#9ca3af" }}>
                                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
 
                    {loading && (
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2d5a2d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🌾</div>
                        <div style={{ padding: "12px 16px", background: "#fff", borderRadius: "2px 14px 14px 14px", border: "0.5px solid #e5e7eb", display: "flex", gap: 5, alignItems: "center" }}>
                          {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b6d11", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />)}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
 
                {/*
                  * ── INPUT BAR ───────────────────────────────────────────────
                  * flexShrink:0  →  never shrinks, always fully visible
                  * paddingBottom uses env(safe-area-inset-bottom) for iOS home
                  * indicator and Android gesture nav bar.
                  *
                  * We do NOT need position:fixed here because the parent flex
                  * column + minHeight:0 on the sibling scroll area already
                  * guarantee this element stays at the bottom.
                  */}
                <div
                  className="input-bar-wrap"
                  style={{
                    padding: "10px 12px",
                    paddingBottom: isMobile
                      ? "max(28px, env(safe-area-inset-bottom))"   // generous bottom gap on mobile
                      : "max(16px, env(safe-area-inset-bottom))",  // normal on desktop
                    background: "#ffffff",
                    borderTop: "1px solid #d1fae5",
                    boxShadow: "0 -2px 8px rgba(45,90,45,0.07)",
                    flexShrink: 0,
                    zIndex: 10,
                  }}
                >
                  <div style={{ maxWidth: 760, margin: "0 auto" }} className="input-inner">
 
                    {/* Quick chips — hidden on mobile, visible on desktop only */}
                    {!isMobile && (
                      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                        {quickButtons.map(btn => (
                          <button key={btn.label} className="quick-chip" onClick={() => sendMessage(btn.query)} disabled={loading}
                            style={{ fontSize: 11, padding: "5px 11px", border: "0.5px solid #bbf7d0", borderRadius: 20, background: "#dcfce7", color: "#3b6d11", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                            <span>{btn.icon}</span>
                            <span className="chip-label">{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
 
                    {/* Input row */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
 
                      {/* Pill input box — white on light-green bg, green focus ring */}
                      <div style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        background: "#ffffff",
                        borderRadius: 26,
                        padding: "11px 18px",
                        border: "1.5px solid #bbf7d0",               // AgriBot border green
                        boxShadow: "0 1px 4px rgba(45,90,45,0.08)",  // soft green shadow
                        minWidth: 0,
                      }}>
                        <input
                          ref={inputRef}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                          onFocus={() => {
                            setTimeout(() => {
                              inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                            }, 350);
                          }}
                          placeholder="Ask your farming question..."
                          disabled={loading}
                          style={{
                            flex: 1,
                            background: "none",
                            border: "none",
                            outline: "none",
                            fontSize: 15,
                            color: "#1a3a0a",                         // AgriBot dark green text
                            minWidth: 0,
                          }}
                        />
                      </div>
 
                      {/* Round send button — AgriBot dark green */}
                      <button
                        className="send-btn"
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        style={{
                          width: 46,
                          height: 46,
                          background: input.trim() ? "#2d5a2d" : "#bbf7d0",  // dark green active, light green inactive
                          border: "none",
                          borderRadius: "50%",
                          color: input.trim() ? "#ffffff" : "#6b9e6b",
                          cursor: input.trim() ? "pointer" : "not-allowed",
                          fontSize: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: input.trim() ? "0 2px 10px rgba(45,90,45,0.40)" : "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        ➤
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}