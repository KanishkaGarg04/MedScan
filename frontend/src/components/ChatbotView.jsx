import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  X,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ChatbotView({
  reportContext,
  onClearContext,
}) {
  const location = useLocation();

  // Report received either from Dashboard or History
  const currentReport =
    reportContext || location.state?.report;

  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      sender: "ai",
      text:
        "Hello! I am your MedScan Clinical AI Copilot. You can ask me to explain medical terms, interpret lab reports, understand abnormal values, or suggest lifestyle improvements based on your medical reports. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const lastContextRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Load report context only once
  useEffect(() => {
    if (!currentReport) return;

    if (
      lastContextRef.current === currentReport.fileName
    ) {
      return;
    }

    lastContextRef.current =
      currentReport.fileName;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "ai",
        isSystemNotification: true,
        text: `⚠️ CONTEXT LOCKED

I have loaded your report:

📄 ${currentReport.fileName}

Type:
${currentReport.reportType || "Medical Report"}

Status:
${currentReport.status || "Unknown"}

You can now ask me questions specifically about this report.`,
      },
    ]);
  }, [currentReport]);

  // Suggestions
  const contextSuggestions = currentReport
    ? [
        "Explain the abnormal findings",
        "What foods should I avoid?",
        "Should I consult a doctor immediately?",
      ]
    : [
        "What is a normal Hemoglobin level?",
        "Explain CBC report",
        "Difference between HDL and LDL",
      ];
      const handleSendMessage = async (customText = null) => {
  const textToSend = customText || input;

  if (!textToSend.trim() || isLoading) return;

  const userMessage = {
    id: Date.now(),
    sender: "user",
    text: textToSend,
  };

  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);

  if (!customText) {
    setInput("");
  }

  setIsLoading(true);

  try {
    let payloadPrompt = textToSend;

    if (currentReport) {
      payloadPrompt = `
Medical Report Context

Report Type:
${currentReport.reportType || "Medical Report"}

Status:
${currentReport.status || "Unknown"}

Extracted Report:
${currentReport.extractedText || "No report text available"}

User Question:
${textToSend}
`;
    }

    const history = updatedMessages
      .filter((msg) => !msg.isSystemNotification)
      .slice(-10)
      .map((msg) => ({
        role: msg.sender,
        text: msg.text,
      }));

    const response = await axios.post(
      `${API_URL}/api/chat`,
      {
        message: payloadPrompt,
        history,
      },
      {
        timeout: 20000,
      }
    );

    const aiReply =
      response.data?.reply ||
      response.data?.message ||
      response.data?.data ||
      "Sorry, I couldn't generate a response.";

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "ai",
        text: aiReply,
      },
    ]);
  } catch (err) {
    console.error("Chatbot Error:", err);

    let errorMessage =
      "Something went wrong while contacting the AI service.";

    if (err.response) {
      switch (err.response.status) {
        case 400:
          errorMessage = "Invalid request sent to the server.";
          break;

        case 401:
          errorMessage =
            "Authentication failed. Please login again.";
          break;

        case 403:
          errorMessage =
            "Access denied by the AI service.";
          break;

        case 404:
          errorMessage =
            "Chat service endpoint not found.";
          break;

        case 429:
          errorMessage =
            "AI quota exceeded. Please try again later.";
          break;

        case 500:
          errorMessage =
            "Internal server error.";
          break;

        default:
          errorMessage =
            err.response.data?.message ||
            "Unexpected server error.";
      }
    } else if (err.request) {
      errorMessage =
        "Unable to reach backend server. Make sure it is running.";
    } else {
      errorMessage = err.message;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        sender: "ai",
        text: errorMessage,
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};
return (
  <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">

    {/* Header */}
    <div className="px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
          <Sparkles size={18} strokeWidth={2.5} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Clinical AI Copilot
          </h3>

          <p className="text-xs text-slate-400">
            AI Powered Medical Assistant
          </p>
        </div>

      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-3 py-2 rounded-lg bg-slate-50">
        <ShieldAlert size={14} className="text-teal-500" />
        HIPAA COMPLIANT
      </div>

    </div>

    {/* Report Context */}

    {currentReport && (

      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-b border-blue-100 px-6 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2 text-sm text-blue-700 font-medium truncate">

          <FileText size={16} />

          <span className="truncate">
            Report :
            <b className="ml-1">
              {currentReport.fileName}
            </b>
          </span>

        </div>

        <button
          type="button"
          onClick={onClearContext}
          className="text-slate-400 hover:text-red-500 transition"
          
        >
          <X size={18} />
        </button>

      </div>

    )}

    {/* Chat Messages */}

    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-5">

      {messages.map((msg) => {

        if (msg.isSystemNotification) {
          return (
            <div
              key={msg.id}
              className="bg-blue-50 border border-blue-100 text-blue-700 rounded-xl p-4 text-sm"
            >
              {msg.text}
            </div>
          );
        }

        const isAI = msg.sender === "ai";

        return (

          <div
            key={msg.id}
            className={`flex gap-3 ${
              isAI ? "justify-start" : "justify-end"
            }`}
          >

            {isAI && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                isAI
                  ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {msg.text}
            </div>

            {!isAI && (
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                <User size={16} />
              </div>
            )}

          </div>

        );
      })}

      {isLoading && (

        <div className="flex gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white">
            <Bot size={16} />
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-500 dark:text-slate-300 animate-pulse">
            Generating medical insights...
          </div>

        </div>

      )}

      <div ref={messagesEndRef} />

    </div>
        {/* Suggestions */}

    <div className="px-4 pt-3 flex flex-wrap gap-2">

      {contextSuggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          disabled={isLoading}
          onClick={() => handleSendMessage(suggestion)}
          className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-xl border transition"
        >
          <div className="flex items-center gap-1">
            {suggestion}
            <ArrowRight size={12} />
          </div>
        </button>
      ))}

    </div>

    {/* Input */}

    <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-3 bg-white dark:bg-slate-800">

      <input
        type="text"
        value={input}
        autoComplete="off"
        spellCheck={false}
        disabled={isLoading}
        placeholder="Ask your medical question..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        className="flex-1 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
      />

      <button
        type="button"
        disabled={!input.trim() || isLoading}
        onClick={() => handleSendMessage()}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-5 flex items-center justify-center transition"
      >
        <Send size={18} />
      </button>

    </div>

  </div>
);
}