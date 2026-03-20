import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Welcome to Frontend Interview Coach.\n\nAsk anything about HTML, CSS, JavaScript, or React 🚀",
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
      const genAI = new GoogleGenerativeAI(
        import.meta.env.VITE_GEMINI_API_KEY
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      // 🔥 TRAINED PROMPT
      const prompt = `
You are a Frontend Interview Coach.

Rules:
- Answer ONLY frontend topics: HTML, CSS, JavaScript, React
- If question is unrelated, say: "I focus on frontend interviews only."
- Give short, clear, interview-style answers
- Sometimes give tips

User Question:
${userInput}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      setMessages([
        ...newMessages,
        { role: "assistant", content: text },
      ]);
    } catch (err) {
      console.log("ERROR:", err);

      // 🔥 FALLBACK (IMPORTANT)
      let fallback;

      if (userInput.toLowerCase().includes("html")) {
        fallback = "HTML is used to structure web pages.";
      } else if (userInput.toLowerCase().includes("css")) {
        fallback = "CSS is used to style web pages.";
      } else if (userInput.toLowerCase().includes("react")) {
        fallback = "React is a library used to build UI components.";
      } else {
        fallback =
          "I'm having trouble connecting. Please ask frontend-related questions like HTML, CSS, JS, or React.";
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: fallback },
      ]);
    }

    setLoading(false);
  };

  return (
<div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">      
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-gray-800 rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="p-4 text-center border-b border-gray-700">
          <h1 className="text-2xl font-bold">Frontend Interview Coach</h1>
          <p className="text-sm text-gray-400">
            Ask anything about HTML, CSS, JS & React 🚀
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
                    ? "bg-indigo-600"
                    : "bg-gray-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-gray-400 text-sm animate-pulse">
              AI is thinking...
            </p>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* QUICK BUTTONS */}
        <div className="flex justify-center gap-3 p-3 border-t border-gray-700">
          <button
            onClick={() => sendMessage("Explain React hooks")}
            className="bg-indigo-600 px-4 py-1 rounded-full text-sm hover:bg-indigo-700"
          >
            React
          </button>
          <button
            onClick={() => sendMessage("What is CSS Flexbox")}
            className="bg-gray-600 px-4 py-1 rounded-full text-sm"
          >
            CSS
          </button>
          <button
            onClick={() => sendMessage("What is event bubbling")}
            className="bg-gray-600 px-4 py-1 rounded-full text-sm"
          >
            JavaScript
          </button>
        </div>

        {/* INPUT */}
        <div className="flex p-4 border-t border-gray-700">
          <input
            className="flex-1 p-3 rounded-l-lg bg-gray-700 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask frontend questions..."
          />
          <button
            onClick={() => sendMessage()}
            className="bg-indigo-600 px-5 rounded-r-lg hover:bg-indigo-700"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}