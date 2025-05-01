import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:8081/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.text();

      const botMessage = { text: data, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error("Fetch error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error retrieving response", sender: "bot" },
      ]);
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", border: "1px solid #ccc", padding: "1rem" }}>
      <h2 style={{ textAlign: "center" }}>Chatbot</h2>

      <div style={{ height: "300px", overflowY: "auto", marginBottom: "1rem", padding: "0.5rem", background: "#f9f9f9" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "0.5rem 0",
              color: msg.sender === "user" ? "blue" : "black"
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;