import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Welcome to Frontend Interview Mentor.\n\nI specialize in HTML, CSS, JavaScript & React.\n\nAsk me interview questions 🚀",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (input) => {
  const q = input.toLowerCase();

  // CSS
  if (q.includes("css")) {
    if (q.includes("type")) {
      return `CSS has 3 types:

• Inline CSS – inside HTML
• Internal CSS – inside <style>
• External CSS – separate file

💡 Tip: Use external CSS in real projects.`;
    }

    if (q.includes("flexbox")) {
      return `Flexbox is used for layout alignment.

Key properties:
• display: flex
• justify-content
• align-items

💡 Tip: Best for 1D layouts.`;
    }

    return `CSS is used to style web pages.

It controls:
• Colors
• Layout
• Spacing

💡 Tip: Learn Flexbox & Grid for interviews.`;
  }

  // REACT
  if (q.includes("react")) {
    if (q.includes("hook")) {
      return `React Hooks allow functional components to use state.

Examples:
• useState
• useEffect

💡 Tip: Explain with examples in interviews.`;
    }

    return `React.js is a JavaScript library used to build user interfaces.

Key features:
• Component-based
• Virtual DOM
• Reusability

💡 Tip: Mention hooks + virtual DOM in interviews.`;
  }

  // JAVASCRIPT
  if (q.includes("javascript") || q.includes("js")) {
    if (q.includes("event")) {
      return `Event bubbling means events propagate upward in DOM.

💡 Tip: Also mention event capturing.`;
    }

    if (q.includes("closure")) {
      return `Closure is a function that remembers outer variables.

💡 Tip: Used in callbacks and data privacy.`;
    }

    return `JavaScript is used to make web pages interactive.

💡 Tip: Focus on closures, promises, async/await.`;
  }

  // API (IMPORTANT FIX)
  if (q.includes("api")) {
    return `API (Application Programming Interface) allows communication between systems.

Example:
Frontend → API → Backend → Database

💡 Tip: Mention REST APIs and HTTP methods (GET, POST).`;
  }

  // HTML
  if (q.includes("html")) {
    return `HTML structures web pages.

Examples:
• Headings
• Forms
• Semantic tags

💡 Tip: Use semantic HTML like <header>, <section>.`;
  }

  // DEFAULT (SMART FALLBACK)
  return `That sounds like a frontend question 👍

Here’s a general approach:

• Break the concept clearly  
• Give example  
• Mention use-case  

💡 Tip: Try asking more specific question for detailed answer 🚀`;
};

  const sendMessage = (customInput) => {
    const userInput = customInput || input;
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = getResponse(userInput);

      setMessages([
        ...newMessages,
        { role: "assistant", content: reply },
      ]);

      setLoading(false);
    }, 700);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
        
        {/* HEADER */}
        <div className="p-4 text-center border-b border-white/10">
          <h1 className="text-2xl font-bold">Frontend Interview Mentor</h1>
          <p className="text-sm text-gray-400">
            HTML • CSS • JS • React 🚀
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
            <p className="text-gray-400 animate-pulse">
              Mentor is typing...
            </p>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* QUICK BUTTONS */}
        <div className="flex justify-center gap-3 p-3 border-t border-white/10">
          <button
            onClick={() => sendMessage("What are types of CSS")}
            className="bg-purple-600 px-4 py-1 rounded-full text-sm"
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