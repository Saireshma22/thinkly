import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Welcome to Frontend Interview Mentor.\n\nAsk me anything about HTML, CSS, JavaScript, or React 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (customInput) => {
    const userInput = customInput || input;
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `
You are a Frontend Interview Mentor.

Rules:
- Answer ONLY HTML, CSS, JavaScript, React
- Be clear and interview-focused
- If unrelated, say: "I focus only on frontend topics."
`,
              },
              {
                role: "user",
                content: userInput,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const text =
        data.choices?.[0]?.message?.content ||
        "⚠️ No response from AI";

      setMessages([
        ...newMessages,
        { role: "assistant", content: text },
      ]);
    } catch (err) {
      console.log(err);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "⚠️ API error. Check your key.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
        
        {/* HEADER */}
        <div className="p-4 text-center border-b border-white/10">
          <h1 className="text-2xl font-bold">Frontend Interview Mentor</h1>
          <p className="text-sm text-gray-400">
            Practice HTML, CSS, JS & React 🚀
          </p>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-xl max-w-[70%] whitespace-pre-line text-sm ${
                  msg.role === "user"
                    ? "bg-purple-600"
                    : "bg-slate-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-gray-400 text-sm animate-pulse">
              Mentor is thinking...
            </p>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* QUICK BUTTONS */}
        <div className="flex justify-center gap-3 p-3 border-t border-white/10">
          <button
            onClick={() => sendMessage("What are types of CSS")}
            className="bg-purple-600 px-4 py-1 rounded-full text-sm hover:bg-purple-700"
          >
            CSS
          </button>
          <button
            onClick={() => sendMessage("Explain React hooks")}
            className="bg-gray-600 px-4 py-1 rounded-full text-sm"
          >
            React
          </button>
          <button
            onClick={() => sendMessage("Explain event bubbling")}
            className="bg-gray-600 px-4 py-1 rounded-full text-sm"
          >
            JS
          </button>
        </div>

        {/* INPUT */}
        <div className="flex p-4 border-t border-white/10">
          <input
            className="flex-1 p-3 rounded-l-lg bg-gray-800 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a frontend interview question..."
          />
          <button
            onClick={() => sendMessage()}
            className="bg-purple-600 px-5 rounded-r-lg hover:bg-purple-700"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}