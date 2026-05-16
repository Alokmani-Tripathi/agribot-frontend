"use client";

import { useState, useRef, useEffect } from "react";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
//   timestamp: Date;
// }

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model_used?: string;  // ← add this
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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "🙏 Namaste! I'm AgriBot, your smart farming assistant. Ask me anything about crops, soil health, pest management, weather, or mandi prices!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const query = text || input.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, chat_history: history }),
        }
      );

      const data = await res.json();
      const botMsg: Message = {
        role: "assistant",
        content: data.answer || "Sorry, something went wrong.",
        timestamp: new Date(),
        model_used: data.model_used || undefined,  // ← add this
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error connecting to backend. Make sure the backend is running.",
          timestamp: new Date(),
        },
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
          <div style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: "0.5px solid #d1fae5",
          }}>
            {sourceSection.split("\n").filter(Boolean).map((line, i) => {
              if (line.includes("📚")) return (
                <p key={i} style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                  {line.trim()}
                </p>
              );
              const urlMatch = line.match(/\[(.+?)\]\((.+?)\)/);
              if (urlMatch) return (
                <a key={i} href={urlMatch[2]} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "block", fontSize: 12, color: "#3b6d11",
                    textDecoration: "none", marginBottom: 3,
                  }}>
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

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: 270, background: "#1a3a1a", color: "#e8f5e8",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        {/* Logo */}
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
            { icon: "📚", label: "PDF knowledge base", color: "#4CAF50" },
            { icon: "🌤️", label: "Live weather info", color: "#64B5F6" },
            { icon: "💹", label: "Mandi prices", color: "#FFB74D" },
            { icon: "🔍", label: "Web search fallback", color: "#4DB6AC" },
            { icon: "💬", label: "Chat with memory", color: "#CE93D8" },
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
            <div key={item} style={{
              fontSize: 12, color: "rgba(232,245,232,0.6)",
              padding: "4px 8px", marginBottom: 2,
            }}>
              · {item}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", padding: 16, borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
          <button
            onClick={() => setMessages([{
              role: "assistant",
              content: "🙏 Namaste! I'm AgriBot. How can I help you today?",
              timestamp: new Date(),
            }])}
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fafaf8" }}>

        {/* Header */}
        <div style={{
          padding: "14px 20px", borderBottom: "0.5px solid #e5e7eb",
          display: "flex", alignItems: "center", gap: 12,
          background: "#fff",
        }}>
          <div style={{
            width: 40, height: 40, background: "#eaf3de",
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20,
          }}>🌱</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>AgriBot Assistant</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Ask about crops, soil, weather & mandi prices</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, background: "#4CAF50", borderRadius: "50%" }} />
            <span style={{ fontSize: 12, color: "#6b7280" }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex", gap: 10,
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
            }}>
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600,
                background: msg.role === "assistant" ? "#2d5a2d" : "#eaf3de",
                color: msg.role === "assistant" ? "#e8f5e8" : "#3b6d11",
              }}>
                {msg.role === "assistant" ? "🌾" : "U"}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: "72%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
                background: msg.role === "user" ? "#2d5a2d" : "#fff",
                color: msg.role === "user" ? "#e8f5e8" : "#1a1a1a",
                fontSize: 14,
                border: msg.role === "assistant" ? "0.5px solid #e5e7eb" : "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}>
                {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 6, borderTop: msg.role === "assistant" ? "0.5px solid #f0f0f0" : "none" }}>
                  {msg.role === "assistant" && msg.model_used ? (
                    <span style={{
                      fontSize: 11,
                      background: msg.model_used === "Groq" ? "#f0fdf4" : "#eff6ff",
                      color: msg.model_used === "Groq" ? "#3b6d11" : "#1d4ed8",
                      border: `0.5px solid ${msg.model_used === "Groq" ? "#bbf7d0" : "#bfdbfe"}`,
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontWeight: 500,
                    }}>
                      🤖 {msg.model_used === "Groq" ? "Groq LLaMA-3.3-70b" : "Gemini 2.5 Flash"}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span style={{ fontSize: 10, color: msg.role === "user" ? "rgba(232,245,232,0.5)" : "#9ca3af" }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "#2d5a2d", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 14,
              }}>🌾</div>
              <div style={{
                padding: "12px 16px", background: "#fff",
                borderRadius: "2px 12px 12px 12px",
                border: "0.5px solid #e5e7eb", display: "flex", gap: 4, alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#3b6d11",
                    animation: "bounce 1.2s infinite",
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: "12px 20px 16px", background: "#fff", borderTop: "0.5px solid #e5e7eb" }}>
          {/* Quick buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            {quickButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => sendMessage(btn.query)}
                disabled={loading}
                style={{
                  fontSize: 11, padding: "4px 12px",
                  border: "0.5px solid #d1fae5",
                  borderRadius: 20, background: "#f0fdf4",
                  color: "#3b6d11", cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={{
            display: "flex", gap: 10, alignItems: "center",
            background: "#f9fafb", border: "0.5px solid #e5e7eb",
            borderRadius: 12, padding: "10px 14px",
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask your farming question... (Press Enter to send)"
              disabled={loading}
              style={{
                flex: 1, background: "none", border: "none",
                outline: "none", fontSize: 14, color: "#1a1a1a",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, background: input.trim() ? "#2d5a2d" : "#e5e7eb",
                border: "none", borderRadius: 8, color: "white",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
