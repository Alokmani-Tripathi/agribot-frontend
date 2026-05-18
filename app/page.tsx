
// // Responsive code 

// "use client";
 
// import { useState, useRef, useEffect } from "react";
 
// interface Message {
//   role: "user" | "assistant";
//   content: string;
//   timestamp: Date;
//   model_used?: string;
// }
 
// interface QuickBtn {
//   label: string;
//   icon: string;
//   query: string;
// }
 
// const quickButtons: QuickBtn[] = [
//   { label: "Best crops for black soil", icon: "🌱", query: "What are the best crops for black soil?" },
//   { label: "Delhi weather today", icon: "🌤️", query: "What is the weather in Delhi today?" },
//   { label: "PM Kisan scheme 2025", icon: "🏛️", query: "What are the latest PM Kisan scheme benefits 2025?" },
//   { label: "Wheat farming guide", icon: "🌾", query: "How to grow wheat crop? Complete guide." },
// ];
 
// // Professional farmer SVG icon — simple village farmer silhouette
// const FarmerIcon = () => (
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 36 36"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     aria-label="Farmer"
//   >
//     {/* Wide-brim hat */}
//     <ellipse cx="18" cy="10" rx="11" ry="3" fill="#3b6d11" />
//     <rect x="13" y="7" width="10" height="5" rx="2" fill="#4a8a1a" />
//     {/* Head */}
//     <circle cx="18" cy="14.5" r="4.5" fill="#c8a97a" />
//     {/* Neck */}
//     <rect x="16.5" y="18.5" width="3" height="2" fill="#c8a97a" />
//     {/* Body / kurta */}
//     <path d="M11 20 Q18 18 25 20 L26 30 Q18 32 10 30 Z" fill="#4a8a1a" />
//     {/* Arms */}
//     <path d="M11 21 Q7 24 8 28" stroke="#4a8a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
//     <path d="M25 21 Q29 24 28 28" stroke="#4a8a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
//     {/* Hands */}
//     <circle cx="8" cy="28.5" r="1.5" fill="#c8a97a" />
//     <circle cx="28" cy="28.5" r="1.5" fill="#c8a97a" />
//     {/* Dhoti / legs hint */}
//     <path d="M13 30 L12 35 M23 30 L24 35" stroke="#d4a853" strokeWidth="2" strokeLinecap="round" />
//   </svg>
// );
 
// // Hamburger / Close icon
// const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     {isOpen ? (
//       // X icon
//       <>
//         <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//         <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       </>
//     ) : (
//       // Hamburger icon
//       <>
//         <line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//         <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//         <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       </>
//     )}
//   </svg>
// );
 
// const INITIAL_MESSAGE: Message = {
//   role: "assistant",
//   content: "🙏 Namaste! I'm AgriBot, your smart farming assistant. Ask me anything about crops, soil health, pest management, weather, or mandi prices!",
//   timestamp: new Date(),
// };
 
// export default function Home() {
//   const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true); // desktop: open by default
//   const [isMobile, setIsMobile] = useState(false);
//   const chatEndRef = useRef<HTMLDivElement>(null);
 
//   // Detect screen size
//   useEffect(() => {
//     const checkSize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       // On mobile, sidebar closed by default
//       if (mobile) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     checkSize();
//     window.addEventListener("resize", checkSize);
//     return () => window.removeEventListener("resize", checkSize);
//   }, []);
 
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);
 
//   // Only the welcome message = "empty" state → show centered landing
//   const isEmptyChat = messages.length === 1 && messages[0].role === "assistant";
 
//   const sendMessage = async (text?: string) => {
//     const query = text || input.trim();
//     if (!query || loading) return;
 
//     const userMsg: Message = {
//       role: "user",
//       content: query,
//       timestamp: new Date(),
//     };
 
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);
 
//     // On mobile, close sidebar after sending
//     if (isMobile) setSidebarOpen(false);
 
//     try {
//       const history = messages.map((m) => ({
//         role: m.role,
//         content: m.content,
//       }));
 
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/chat`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ message: query, chat_history: history }),
//         }
//       );
 
//       const data = await res.json();
//       const botMsg: Message = {
//         role: "assistant",
//         content: data.answer || "Sorry, something went wrong.",
//         timestamp: new Date(),
//         model_used: data.model_used || undefined,
//       };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "⚠️ Error connecting to backend. Make sure the backend is running.",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const formatMessage = (content: string) => {
//     const parts = content.split("---");
//     const mainText = parts[0];
//     const sourceSection = parts[1];
 
//     return (
//       <div>
//         <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{mainText}</p>
//         {sourceSection && (
//           <div style={{
//             marginTop: 12,
//             paddingTop: 10,
//             borderTop: "0.5px solid #d1fae5",
//           }}>
//             {sourceSection.split("\n").filter(Boolean).map((line, i) => {
//               if (line.includes("📚")) return (
//                 <p key={i} style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
//                   {line.trim()}
//                 </p>
//               );
//               const urlMatch = line.match(/\[(.+?)\]\((.+?)\)/);
//               if (urlMatch) return (
//                 <a key={i} href={urlMatch[2]} target="_blank" rel="noopener noreferrer"
//                   style={{
//                     display: "block", fontSize: 12, color: "#3b6d11",
//                     textDecoration: "none", marginBottom: 3,
//                   }}>
//                   🔗 {urlMatch[1]}
//                 </a>
//               );
//               return <p key={i} style={{ fontSize: 12, color: "#6b7280" }}>{line.trim()}</p>;
//             })}
//           </div>
//         )}
//       </div>
//     );
//   };
 
//   const sidebarWidth = 270;
 
//   return (
//     <>
//       <style>{`
//         @keyframes bounce {
//           0%, 60%, 100% { transform: translateY(0); }
//           30% { transform: translateY(-6px); }
//         }
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(18px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }
//         .sidebar-transition {
//           transition: transform 0.28s cubic-bezier(0.4,0,0.2,1),
//                       width 0.28s cubic-bezier(0.4,0,0.2,1);
//         }
//         .main-transition {
//           transition: margin-left 0.28s cubic-bezier(0.4,0,0.2,1);
//         }
//         .quick-chip:hover {
//           background: #dcfce7 !important;
//           border-color: #86efac !important;
//           transform: translateY(-1px);
//           box-shadow: 0 3px 10px rgba(45,90,45,0.12);
//         }
//         .quick-chip {
//           transition: all 0.18s ease;
//         }
//         .send-btn:hover:not(:disabled) {
//           background: #3b6d11 !important;
//           transform: scale(1.04);
//         }
//         .send-btn { transition: all 0.18s ease; }
//         .overlay-backdrop {
//           position: fixed; inset: 0;
//           background: rgba(0,0,0,0.45);
//           z-index: 40;
//           animation: fadeIn 0.2s ease;
//         }
//         /* Responsive input area */
//         @media (max-width: 480px) {
//           .chips-row { gap: 6px !important; }
//           .chip-label { display: none; }
//           .chip-icon-only { display: inline !important; }
//         }
//       `}</style>
 
//       <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", overflow: "hidden", position: "relative" }}>
 
//         {/* ── Mobile overlay backdrop ── */}
//         {isMobile && sidebarOpen && (
//           <div
//             className="overlay-backdrop"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}
 
//         {/* ── Sidebar ── */}
//         <div
//           className="sidebar-transition"
//           style={{
//             width: sidebarWidth,
//             background: "#1a3a1a",
//             color: "#e8f5e8",
//             display: "flex",
//             flexDirection: "column",
//             flexShrink: 0,
//             // Desktop: push layout. Mobile: overlay (fixed, on top)
//             ...(isMobile ? {
//               position: "fixed",
//               top: 0,
//               left: 0,
//               height: "100vh",
//               zIndex: 50,
//               transform: sidebarOpen ? "translateX(0)" : `translateX(-${sidebarWidth}px)`,
//             } : {
//               position: "relative",
//               transform: sidebarOpen ? "translateX(0)" : `translateX(-${sidebarWidth}px)`,
//               marginRight: sidebarOpen ? 0 : -sidebarWidth,
//             }),
//           }}
//         >
//           {/* Logo */}
//           <div style={{ padding: "20px 16px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{
//                 width: 40, height: 40, background: "#2d5a2d",
//                 borderRadius: 10, display: "flex", alignItems: "center",
//                 justifyContent: "center", fontSize: 20,
//               }}>🌾</div>
//               <div>
//                 <div style={{ fontSize: 16, fontWeight: 600 }}>AgriBot</div>
//                 <div style={{ fontSize: 11, color: "rgba(232,245,232,0.6)" }}>Smart Farming Assistant</div>
//               </div>
//             </div>
//           </div>
 
//           {/* Capabilities */}
//           <div style={{ padding: "16px" }}>
//             <div style={{ fontSize: 10, color: "rgba(232,245,232,0.4)", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
//               Capabilities
//             </div>
//             {[
//               { icon: "📚", label: "PDF knowledge base" },
//               { icon: "🌤️", label: "Live weather info" },
//               { icon: "💹", label: "Mandi prices" },
//               { icon: "🔍", label: "Web search fallback" },
//               { icon: "💬", label: "Chat with memory" },
//             ].map((item) => (
//               <div key={item.label} style={{
//                 display: "flex", alignItems: "center", gap: 10,
//                 padding: "7px 8px", borderRadius: 8, marginBottom: 2,
//                 fontSize: 13, color: "rgba(232,245,232,0.8)",
//               }}>
//                 <span style={{ fontSize: 14 }}>{item.icon}</span>
//                 {item.label}
//               </div>
//             ))}
//           </div>
 
//           {/* Powered by */}
//           <div style={{ padding: "0 16px 16px" }}>
//             <div style={{ fontSize: 10, color: "rgba(232,245,232,0.4)", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
//               Powered by
//             </div>
//             {["Groq LLaMA 3.3 70b", "Pinecone Vector DB", "BGE Embeddings + Reranker", "LangChain Agent"].map((item) => (
//               <div key={item} style={{
//                 fontSize: 12, color: "rgba(232,245,232,0.6)",
//                 padding: "4px 8px", marginBottom: 2,
//               }}>
//                 · {item}
//               </div>
//             ))}
//           </div>
 
//           {/* Footer */}
//           <div style={{ marginTop: "auto", padding: 16, borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
//             <button
//               onClick={() => {
//                 setMessages([{ ...INITIAL_MESSAGE, timestamp: new Date() }]);
//                 if (isMobile) setSidebarOpen(false);
//               }}
//               style={{
//                 width: "100%", padding: "8px 0",
//                 background: "rgba(255,255,255,0.08)",
//                 border: "0.5px solid rgba(255,255,255,0.15)",
//                 borderRadius: 8, color: "rgba(232,245,232,0.7)",
//                 fontSize: 13, cursor: "pointer",
//               }}
//             >
//               🗑️ Clear conversation
//             </button>
//           </div>
//         </div>
 
//         {/* ── Main chat area ── */}
//         <div
//           className="main-transition"
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             background: "#fafaf8",
//             minWidth: 0, // prevents flex overflow
//             // On desktop, no extra margin needed (sidebar pushes via marginRight above)
//           }}
//         >
//           {/* Header */}
//           <div style={{
//             padding: "12px 16px",
//             borderBottom: "0.5px solid #e5e7eb",
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             background: "#fff",
//             flexShrink: 0,
//           }}>
//             {/* Hamburger toggle */}
//             <button
//               onClick={() => setSidebarOpen((v) => !v)}
//               aria-label="Toggle sidebar"
//               style={{
//                 width: 38, height: 38,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 background: "none", border: "0.5px solid #e5e7eb",
//                 borderRadius: 8, cursor: "pointer",
//                 color: "#3b6d11", flexShrink: 0,
//                 transition: "background 0.15s",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
//               onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
//             >
//               <HamburgerIcon isOpen={sidebarOpen} />
//             </button>
 
//             {/* Bot info */}
//             <div style={{
//               width: 36, height: 36, background: "#eaf3de",
//               borderRadius: 9, display: "flex", alignItems: "center",
//               justifyContent: "center", fontSize: 18, flexShrink: 0,
//             }}>🌱</div>
//             <div style={{ minWidth: 0 }}>
//               <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap" }}>AgriBot Assistant</div>
//               <div style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                 Ask about crops, soil, weather &amp; mandi prices
//               </div>
//             </div>
 
//             {/* Online indicator */}
//             <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
//               <div style={{ width: 7, height: 7, background: "#4CAF50", borderRadius: "50%" }} />
//               <span style={{ fontSize: 12, color: "#6b7280" }}>Online</span>
//             </div>
//           </div>
 
//           {/* ── Messages OR Landing ── */}
//           {isEmptyChat ? (
//             /* ── CENTERED LANDING (ChatGPT style) ── */
//             <div style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "24px 16px 16px",
//               animation: "fadeSlideUp 0.4s ease",
//             }}>
//               {/* Hero */}
//               <div style={{ textAlign: "center", marginBottom: 36 }}>
//                 <div style={{
//                   width: 72, height: 72, background: "#2d5a2d",
//                   borderRadius: 20, display: "flex", alignItems: "center",
//                   justifyContent: "center", fontSize: 36, margin: "0 auto 16px",
//                   boxShadow: "0 8px 24px rgba(45,90,45,0.2)",
//                 }}>🌾</div>
//                 <h1 style={{
//                   fontSize: "clamp(20px, 4vw, 28px)",
//                   fontWeight: 700, color: "#1a1a1a", marginBottom: 8,
//                 }}>
//                   Namaste! I&apos;m AgriBot 🙏
//                 </h1>
//                 <p style={{
//                   fontSize: "clamp(13px, 2vw, 15px)",
//                   color: "#6b7280", maxWidth: 480, lineHeight: 1.6,
//                 }}>
//                   Your AI-powered smart farming assistant. Ask me about crops, soil health, pest management, mandi prices, or government schemes.
//                 </p>
//               </div>
 
//               {/* Centered search box */}
//               <div style={{
//                 width: "100%",
//                 maxWidth: 620,
//                 background: "#fff",
//                 border: "1.5px solid #e5e7eb",
//                 borderRadius: 16,
//                 padding: "12px 14px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
//                 marginBottom: 20,
//               }}>
//                 <input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
//                   placeholder="Ask your farming question..."
//                   autoFocus
//                   style={{
//                     flex: 1, background: "none", border: "none",
//                     outline: "none", fontSize: 15, color: "#1a1a1a",
//                   }}
//                 />
//                 <button
//                   className="send-btn"
//                   onClick={() => sendMessage()}
//                   disabled={loading || !input.trim()}
//                   style={{
//                     width: 38, height: 38,
//                     background: input.trim() ? "#2d5a2d" : "#e5e7eb",
//                     border: "none", borderRadius: 10, color: "white",
//                     cursor: input.trim() ? "pointer" : "not-allowed",
//                     fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
//                   }}
//                 >
//                   ➤
//                 </button>
//               </div>
 
//               {/* Suggestion chips */}
//               <div style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 10,
//                 justifyContent: "center",
//                 maxWidth: 640,
//               }}>
//                 {quickButtons.map((btn) => (
//                   <button
//                     key={btn.label}
//                     className="quick-chip"
//                     onClick={() => sendMessage(btn.query)}
//                     disabled={loading}
//                     style={{
//                       display: "flex", alignItems: "center", gap: 7,
//                       padding: "9px 16px",
//                       border: "1px solid #d1fae5",
//                       borderRadius: 24,
//                       background: "#f0fdf4",
//                       color: "#2d5a2d",
//                       fontSize: 13,
//                       fontWeight: 500,
//                       cursor: "pointer",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     <span style={{ fontSize: 16 }}>{btn.icon}</span>
//                     <span className="chip-label">{btn.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* ── CHAT MESSAGES ── */
//             <div style={{
//               flex: 1, overflowY: "auto", padding: "20px 16px",
//               display: "flex", flexDirection: "column", alignItems: "center",
//             }}>
//               {/* Center column — same max-width as ChatGPT */}
//               <div style={{
//                 width: "100%", maxWidth: 760,
//                 display: "flex", flexDirection: "column", gap: 16,
//               }}>
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     display: "flex", gap: 10,
//                     flexDirection: msg.role === "user" ? "row-reverse" : "row",
//                     alignItems: "flex-start",
//                     animation: "fadeSlideUp 0.25s ease",
//                   }}
//                 >
//                   {/* Avatar */}
//                   <div style={{
//                     width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     background: msg.role === "assistant" ? "#2d5a2d" : "#eaf3de",
//                     fontSize: 14, fontWeight: 600,
//                     overflow: "hidden",
//                   }}>
//                     {msg.role === "assistant"
//                       ? <span style={{ fontSize: 18 }}>🌾</span>
//                       : <FarmerIcon />
//                     }
//                   </div>
 
//                   {/* Bubble */}
//                   <div style={{
//                     maxWidth: "min(72%, 560px)",
//                     padding: "10px 14px",
//                     borderRadius: msg.role === "user" ? "14px 2px 14px 14px" : "2px 14px 14px 14px",
//                     background: msg.role === "user" ? "#2d5a2d" : "#fff",
//                     color: msg.role === "user" ? "#e8f5e8" : "#1a1a1a",
//                     fontSize: 14,
//                     border: msg.role === "assistant" ? "0.5px solid #e5e7eb" : "none",
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//                   }}>
//                     {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
//                     <div style={{
//                       display: "flex", justifyContent: "space-between",
//                       alignItems: "center", marginTop: 8, paddingTop: 6,
//                       borderTop: msg.role === "assistant" ? "0.5px solid #f0f0f0" : "none",
//                     }}>
//                       {msg.role === "assistant" && msg.model_used ? (
//                         <span style={{
//                           fontSize: 11,
//                           background: msg.model_used === "Groq" ? "#f0fdf4" : "#eff6ff",
//                           color: msg.model_used === "Groq" ? "#3b6d11" : "#1d4ed8",
//                           border: `0.5px solid ${msg.model_used === "Groq" ? "#bbf7d0" : "#bfdbfe"}`,
//                           borderRadius: 20, padding: "3px 10px", fontWeight: 500,
//                         }}>
//                           🤖 {msg.model_used === "Groq" ? "Groq LLaMA-3.3-70b" : "Gemini 2.5 Flash"}
//                         </span>
//                       ) : <span />}
//                       <span style={{
//                         fontSize: 10,
//                         color: msg.role === "user" ? "rgba(232,245,232,0.5)" : "#9ca3af",
//                       }}>
//                         {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
 
//               {/* Loading dots */}
//               {loading && (
//                 <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
//                   <div style={{
//                     width: 36, height: 36, borderRadius: "50%",
//                     background: "#2d5a2d", display: "flex",
//                     alignItems: "center", justifyContent: "center", fontSize: 18,
//                   }}>🌾</div>
//                   <div style={{
//                     padding: "12px 16px", background: "#fff",
//                     borderRadius: "2px 14px 14px 14px",
//                     border: "0.5px solid #e5e7eb", display: "flex", gap: 5, alignItems: "center",
//                   }}>
//                     {[0, 1, 2].map((i) => (
//                       <div key={i} style={{
//                         width: 6, height: 6, borderRadius: "50%", background: "#3b6d11",
//                         animation: "bounce 1.2s infinite",
//                         animationDelay: `${i * 0.2}s`,
//                       }} />
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <div ref={chatEndRef} />
//               </div> {/* end center column */}
//             </div>
//           )}
 
//           {/* ── Input area (always shown in chat mode, hidden in landing as input is centered above) ── */}
//           {!isEmptyChat && (
//             <div style={{
//               padding: "10px 16px 14px",
//               background: "#fff",
//               borderTop: "0.5px solid #e5e7eb",
//               flexShrink: 0,
//             }}>
//               {/* Center column — matches messages width */}
//               <div style={{ maxWidth: 760, margin: "0 auto" }}>
//               {/* Quick chips */}
//               <div className="chips-row" style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
//                 {quickButtons.map((btn) => (
//                   <button
//                     key={btn.label}
//                     className="quick-chip"
//                     onClick={() => sendMessage(btn.query)}
//                     disabled={loading}
//                     style={{
//                       fontSize: 11, padding: "5px 12px",
//                       border: "0.5px solid #d1fae5",
//                       borderRadius: 20, background: "#f0fdf4",
//                       color: "#3b6d11", cursor: "pointer",
//                       display: "flex", alignItems: "center", gap: 4,
//                     }}
//                   >
//                     <span>{btn.icon}</span>
//                     <span className="chip-label">{btn.label}</span>
//                   </button>
//                 ))}
//               </div>
 
//               {/* Input row */}
//               <div style={{
//                 display: "flex", gap: 10, alignItems: "center",
//                 background: "#f9fafb", border: "1px solid #e5e7eb",
//                 borderRadius: 14, padding: "10px 14px",
//               }}>
//                 <input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
//                   placeholder="Ask your farming question... (Press Enter to send)"
//                   disabled={loading}
//                   style={{
//                     flex: 1, background: "none", border: "none",
//                     outline: "none", fontSize: 14, color: "#1a1a1a",
//                   }}
//                 />
//                 <button
//                   className="send-btn"
//                   onClick={() => sendMessage()}
//                   disabled={loading || !input.trim()}
//                   style={{
//                     width: 36, height: 36,
//                     background: input.trim() ? "#2d5a2d" : "#e5e7eb",
//                     border: "none", borderRadius: 9, color: "white",
//                     cursor: input.trim() ? "pointer" : "not-allowed",
//                     fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
//                   }}
//                 >
//                   ➤
//                 </button>
//               </div>
//               </div> {/* end center column */}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }











"use client";
 
import { useState, useRef, useEffect } from "react";
 
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
  { label: "Delhi weather today", icon: "🌤️", query: "What is the weather in Delhi today?" },
  { label: "PM Kisan scheme 2025", icon: "🏛️", query: "What are the latest PM Kisan scheme benefits 2025?" },
  { label: "Wheat farming guide", icon: "🌾", query: "How to grow wheat crop? Complete guide." },
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
 
// ✅ KEY CHANGE: Icon changes in-place but position never moves
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {isOpen ? (
      <>
        <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ) : (
      <>
        <line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    )}
  </svg>
);
 
const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "🙏 Namaste! I'm AgriBot, your smart farming assistant. Ask me anything about crops, soil health, pest management, weather, or mandi prices!",
  timestamp: new Date(),
};
 
export default function Home() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const checkSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);
 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  const isEmptyChat = messages.length === 1 && messages[0].role === "assistant";
 
  const sendMessage = async (text?: string) => {
    const query = text || input.trim();
    if (!query || loading) return;
 
    const userMsg: Message = { role: "user", content: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    if (isMobile) setSidebarOpen(false);
 
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, chat_history: history }),
      });
      const data = await res.json();
      const botMsg: Message = {
        role: "assistant",
        content: data.answer || "Sorry, something went wrong.",
        timestamp: new Date(),
        model_used: data.model_used || undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to backend. Make sure the backend is running.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };
 
  const formatMessage = (content: string) => {
    const parts = content.split("---");
    const mainText = parts[0];
    const sourceSection = parts[1];
    return (
      <div>
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{mainText}</p>
        {sourceSection && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "0.5px solid #d1fae5" }}>
            {sourceSection.split("\n").filter(Boolean).map((line, i) => {
              if (line.includes("📚")) return <p key={i} style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{line.trim()}</p>;
              const urlMatch = line.match(/\[(.+?)\]\((.+?)\)/);
              if (urlMatch) return (
                <a key={i} href={urlMatch[2]} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", fontSize: 12, color: "#3b6d11", textDecoration: "none", marginBottom: 3 }}>
                  🔗 {urlMatch[1]}
                </a>
              );
              return <p key={i} style={{ fontSize: 12, color: "#6b7280" }}>{line.trim()}</p>;
            })}
          </div>
        )}
      </div>
    );
  };
 
  const sidebarWidth = 270;
 
  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .sidebar-transition {
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1),
                      width 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .main-transition {
          transition: margin-left 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .quick-chip:hover {
          background: #dcfce7 !important;
          border-color: #86efac !important;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(45,90,45,0.12);
        }
        .quick-chip { transition: all 0.18s ease; }
        .send-btn:hover:not(:disabled) {
          background: #3b6d11 !important;
          transform: scale(1.04);
        }
        .send-btn { transition: all 0.18s ease; }
        .overlay-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 40;
          animation: fadeIn 0.2s ease;
        }
        /* ✅ Hamburger icon transition for smooth ☰ ↔ ✕ swap */
        .hamburger-btn svg {
          transition: transform 0.2s ease;
        }
        .hamburger-btn:hover svg {
          transform: scale(1.1);
        }
        @media (max-width: 480px) {
          .chips-row { gap: 6px !important; }
          .chip-label { display: none; }
        }
      `}</style>
 
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", overflow: "hidden", position: "relative" }}>
 
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div className="overlay-backdrop" onClick={() => setSidebarOpen(false)} />
        )}
 
        {/* ── Sidebar ── ✅ NO close button inside sidebar anymore */}
        <div
          className="sidebar-transition"
          style={{
            width: sidebarWidth,
            background: "#1a3a1a",
            color: "#e8f5e8",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            ...(isMobile ? {
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              zIndex: 50,
              transform: sidebarOpen ? "translateX(0)" : `translateX(-${sidebarWidth}px)`,
            } : {
              position: "relative",
              transform: sidebarOpen ? "translateX(0)" : `translateX(-${sidebarWidth}px)`,
              marginRight: sidebarOpen ? 0 : -sidebarWidth,
            }),
          }}
        >
          {/* Logo — no close button here */}
          <div style={{ padding: "20px 16px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 40, height: 40, background: "#2d5a2d",
                borderRadius: 10, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 20,
              }}>🌾</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>AgriBot</div>
                <div style={{ fontSize: 11, color: "rgba(232,245,232,0.6)" }}>Smart Farming Assistant</div>
              </div>
            </div>
          </div>
 
          {/* Capabilities */}
          <div style={{ padding: "16px" }}>
            <div style={{ fontSize: 10, color: "rgba(232,245,232,0.4)", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
              Capabilities
            </div>
            {[
              { icon: "📚", label: "PDF knowledge base" },
              { icon: "🌤️", label: "Live weather info" },
              { icon: "💹", label: "Mandi prices" },
              { icon: "🔍", label: "Web search fallback" },
              { icon: "💬", label: "Chat with memory" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "7px 8px", borderRadius: 8, marginBottom: 2,
                fontSize: 13, color: "rgba(232,245,232,0.8)",
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
 
          {/* Powered by */}
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ fontSize: 10, color: "rgba(232,245,232,0.4)", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
              Powered by
            </div>
            {["Groq LLaMA 3.3 70b", "Pinecone Vector DB", "BGE Embeddings + Reranker", "LangChain Agent"].map((item) => (
              <div key={item} style={{ fontSize: 12, color: "rgba(232,245,232,0.6)", padding: "4px 8px", marginBottom: 2 }}>
                · {item}
              </div>
            ))}
          </div>
 
          {/* Footer */}
          <div style={{ marginTop: "auto", padding: 16, borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => {
                setMessages([{ ...INITIAL_MESSAGE, timestamp: new Date() }]);
                if (isMobile) setSidebarOpen(false);
              }}
              style={{
                width: "100%", padding: "8px 0",
                background: "rgba(255,255,255,0.08)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                borderRadius: 8, color: "rgba(232,245,232,0.7)",
                fontSize: 13, cursor: "pointer",
              }}
            >
              🗑️ Clear conversation
            </button>
          </div>
        </div>
 
        {/* ── Main chat area ── */}
        <div
          className="main-transition"
          style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fafaf8", minWidth: 0 }}
        >
          {/* ✅ Header — hamburger ALWAYS here, ALWAYS visible */}
          <div style={{
            padding: "12px 16px",
            borderBottom: "0.5px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#fff",
            flexShrink: 0,
          }}>
            {/* ✅ This button is permanent. Icon swaps ☰ ↔ ✕ in-place */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              style={{
                width: 38, height: 38,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: sidebarOpen ? "#f0fdf4" : "none",
                border: "0.5px solid #e5e7eb",
                borderRadius: 8, cursor: "pointer",
                color: "#3b6d11", flexShrink: 0,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
              onMouseLeave={(e) => (e.currentTarget.style.background = sidebarOpen ? "#f0fdf4" : "none")}
            >
              <HamburgerIcon isOpen={sidebarOpen} />
            </button>
 
            <div style={{
              width: 36, height: 36, background: "#eaf3de",
              borderRadius: 9, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18, flexShrink: 0,
            }}>🌱</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap" }}>AgriBot Assistant</div>
              <div style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Ask about crops, soil, weather &amp; mandi prices
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, background: "#4CAF50", borderRadius: "50%" }} />
              <span style={{ fontSize: 12, color: "#6b7280" }}>Online</span>
            </div>
          </div>
 
          {/* Messages or Landing */}
          {isEmptyChat ? (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "24px 16px 16px", animation: "fadeSlideUp 0.4s ease",
            }}>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <div style={{
                  width: 72, height: 72, background: "#2d5a2d",
                  borderRadius: 20, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 36, margin: "0 auto 16px",
                  boxShadow: "0 8px 24px rgba(45,90,45,0.2)",
                }}>🌾</div>
                <h1 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
                  Namaste! I&apos;m AgriBot 🙏
                </h1>
                <p style={{ fontSize: "clamp(13px, 2vw, 15px)", color: "#6b7280", maxWidth: 480, lineHeight: 1.6 }}>
                  Your AI-powered smart farming assistant. Ask me about crops, soil health, pest management, mandi prices, or government schemes.
                </p>
              </div>
 
              <div style={{
                width: "100%", maxWidth: 620, background: "#fff",
                border: "1.5px solid #e5e7eb", borderRadius: 16,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)", marginBottom: 20,
              }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask your farming question..."
                  autoFocus
                  style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, color: "#1a1a1a" }}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{
                    width: 38, height: 38,
                    background: input.trim() ? "#2d5a2d" : "#e5e7eb",
                    border: "none", borderRadius: 10, color: "white",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >➤</button>
              </div>
 
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 640 }}>
                {quickButtons.map((btn) => (
                  <button
                    key={btn.label}
                    className="quick-chip"
                    onClick={() => sendMessage(btn.query)}
                    disabled={loading}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "9px 16px", border: "1px solid #d1fae5",
                      borderRadius: 24, background: "#f0fdf4",
                      color: "#2d5a2d", fontSize: 13, fontWeight: 500,
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{btn.icon}</span>
                    <span className="chip-label">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1, overflowY: "auto", padding: "20px 16px",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{ width: "100%", maxWidth: 760, display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex", gap: 10,
                      flexDirection: msg.role === "user" ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      animation: "fadeSlideUp 0.25s ease",
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: msg.role === "assistant" ? "#2d5a2d" : "#eaf3de",
                      fontSize: 14, fontWeight: 600, overflow: "hidden",
                    }}>
                      {msg.role === "assistant" ? <span style={{ fontSize: 18 }}>🌾</span> : <FarmerIcon />}
                    </div>
                    <div style={{
                      maxWidth: "min(72%, 560px)", padding: "10px 14px",
                      borderRadius: msg.role === "user" ? "14px 2px 14px 14px" : "2px 14px 14px 14px",
                      background: msg.role === "user" ? "#2d5a2d" : "#fff",
                      color: msg.role === "user" ? "#e8f5e8" : "#1a1a1a",
                      fontSize: 14,
                      border: msg.role === "assistant" ? "0.5px solid #e5e7eb" : "none",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}>
                      {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        marginTop: 8, paddingTop: 6,
                        borderTop: msg.role === "assistant" ? "0.5px solid #f0f0f0" : "none",
                      }}>
                        {msg.role === "assistant" && msg.model_used ? (
                          <span style={{
                            fontSize: 11,
                            background: msg.model_used === "Groq" ? "#f0fdf4" : "#eff6ff",
                            color: msg.model_used === "Groq" ? "#3b6d11" : "#1d4ed8",
                            border: `0.5px solid ${msg.model_used === "Groq" ? "#bbf7d0" : "#bfdbfe"}`,
                            borderRadius: 20, padding: "3px 10px", fontWeight: 500,
                          }}>
                            🤖 {msg.model_used === "Groq" ? "Groq LLaMA-3.3-70b" : "Gemini 2.5 Flash"}
                          </span>
                        ) : <span />}
                        <span style={{ fontSize: 10, color: msg.role === "user" ? "rgba(232,245,232,0.5)" : "#9ca3af" }}>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
 
                {loading && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "#2d5a2d", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 18,
                    }}>🌾</div>
                    <div style={{
                      padding: "12px 16px", background: "#fff",
                      borderRadius: "2px 14px 14px 14px",
                      border: "0.5px solid #e5e7eb", display: "flex", gap: 5, alignItems: "center",
                    }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: "50%", background: "#3b6d11",
                          animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}
 
          {/* Input area */}
          {!isEmptyChat && (
            <div style={{ padding: "10px 16px 14px", background: "#fff", borderTop: "0.5px solid #e5e7eb", flexShrink: 0 }}>
              <div style={{ maxWidth: 760, margin: "0 auto" }}>
                <div className="chips-row" style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  {quickButtons.map((btn) => (
                    <button
                      key={btn.label}
                      className="quick-chip"
                      onClick={() => sendMessage(btn.query)}
                      disabled={loading}
                      style={{
                        fontSize: 11, padding: "5px 12px",
                        border: "0.5px solid #d1fae5", borderRadius: 20,
                        background: "#f0fdf4", color: "#3b6d11", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      <span>{btn.icon}</span>
                      <span className="chip-label">{btn.label}</span>
                    </button>
                  ))}
                </div>
                <div style={{
                  display: "flex", gap: 10, alignItems: "center",
                  background: "#f9fafb", border: "1px solid #e5e7eb",
                  borderRadius: 14, padding: "10px 14px",
                }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ask your farming question... (Press Enter to send)"
                    disabled={loading}
                    style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "#1a1a1a" }}
                  />
                  <button
                    className="send-btn"
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    style={{
                      width: 36, height: 36,
                      background: input.trim() ? "#2d5a2d" : "#e5e7eb",
                      border: "none", borderRadius: 9, color: "white",
                      cursor: input.trim() ? "pointer" : "not-allowed",
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >➤</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}