import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, FileText, X, ShieldAlert, ArrowRight } from 'lucide-react';

export default function ChatbotView({ injectedReportContext, onClearContext }) {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "Hello! I am your MedScan Clinical AI Copilot. You can ask me to explain medical terms, interpret lab variance ranges, or suggest dietary changes based on your files. How can I help you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll timeline window to ensure visibility of fresh message feeds
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // If a report context was injected from another view, process an automated systemic prompt introduction
  useEffect(() => {
    if (injectedReportContext) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ CONTEXT LOCKED: I have pulled up your analysis records for "${injectedReportContext.reportType || 'Medical Dossier'}" (${injectedReportContext.fileName}). I am ready to decode any specific data points, abnormal flags, or recommendations from this document. What would you like to clarify?`,
          isSystemNotification: true
        }
      ]);
    }
  }, [injectedReportContext]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    // Push primary patient message item onto state pipeline
    const updatedMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(updatedMessages);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      // Build a contextual prompt block including background report details if present
      let payloadPrompt = textToSend;
      if (injectedReportContext) {
        payloadPrompt = `[Context Mode - Report Type: ${injectedReportContext.reportType}, Status: ${injectedReportContext.status}, Raw Text Extract: ${injectedReportContext.extractedText || ''}]\n\nUser Question: ${textToSend}`;
      }

      // Hit your active local Node backend LLM bridge route
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: payloadPrompt,
        history: updatedMessages.filter(m => !m.isSystemNotification) // Avoid polluting chat streams with styling flags
      });

      setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply || response.data.data }]);
    } catch (err) {
      console.error("AI Node interaction runtime fault:", err);
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', text: "Forgive me, my neural network links timed out trying to structure that response. Please verify your backend server execution stream." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Static predictive suggestion pathways
  const contextSuggestions = injectedReportContext ? [
    "Explain the anomalous findings in plain English",
    "What specific lifestyle variables should I avoid?",
    "Does this report necessitate immediate physician follow-up?"
  ] : [
    "What does a normal Hemoglobin metric look like?",
    "How should I structure a standard metabolic panel review?",
    "Explain the difference between microcytic and macrocytic traits"
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
      
      {/* Workspace Header Module */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Clinical AI Copilot</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1">Real-time Patient Diagnostic Support Node</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border border-slate-100 px-3 py-1.5 rounded-lg bg-slate-50/50">
          <ShieldAlert size={14} className="text-teal-500" />
          <span>HIPAA COMPLIANT SECURE TUNNEL</span>
        </div>
      </div>

      {/* Dynamic Linked Context Banner */}
      {injectedReportContext && (
        <div className="bg-gradient-to-r from-teal-50/60 to-blue-50/60 border-b border-blue-100/40 px-6 py-3 flex items-center justify-between text-sm shrink-0 animate-fade-in">
          <div className="flex items-center gap-2.5 text-blue-700 font-semibold truncate">
            <FileText size={16} className="text-teal-600 shrink-0" />
            <span className="truncate">Currently linked to: <b className="font-bold">{injectedReportContext.reportType || 'Diagnostics File'}</b> ({injectedReportContext.fileName})</span>
          </div>
          <button 
            onClick={onClearContext}
            className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors shrink-0"
            title="Disconnect context model"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Messages Render Timeline Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 space-y-6">
        {messages.map((msg, index) => {
          if (msg.isSystemNotification) {
            return (
              <div key={index} className="flex justify-center my-2">
                <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs font-medium px-4 py-3 rounded-xl max-w-xl text-center leading-relaxed">
                  {msg.text}
                </div>
              </div>
            );
          }

          const isAI = msg.sender === 'ai';
          return (
            <div key={index} className={`flex gap-4 max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 select-none shadow-sm ${
                isAI ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {isAI ? <Bot size={16} /> : <User size={16} />}
              </div>
              
              <div className={`space-y-1 p-4 rounded-2xl text-[14.5px] leading-relaxed font-medium ${
                isAI 
                  ? 'bg-white text-slate-800 border border-slate-100/80 shadow-[0_2px_8px_rgba(0,0,0,0.005)]' 
                  : 'bg-blue-600 text-white'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {/* Streaming State Buffer Indicator */}
        {isLoading && (
          <div className="flex gap-4 mr-auto animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center text-sm">
              <Bot size={16} />
            </div>
            <div className="bg-slate-100 border border-slate-200/50 p-4 rounded-2xl text-slate-400 text-sm font-semibold tracking-wide">
              Thinking, structuring cross-references...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Panel Execution Area */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0 space-y-3.5">
        
        {/* Dynamic Single-Click Question Chips */}
        <div className="flex flex-wrap gap-2">
          {contextSuggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(suggestion)}
              disabled={isLoading}
              className="text-xs font-bold text-slate-500 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 px-3.5 py-2 rounded-xl border border-slate-200/60 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span>{suggestion}</span>
              <ArrowRight size={12} className="opacity-60" />
            </button>
          ))}
        </div>

        {/* Main Text Input Group */}
        <div className="flex gap-3">
          <input
            type="text"
            disabled={isLoading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={injectedReportContext ? "Ask anything about this specific report parameters..." : "Query generic clinical terms, metric charts, guidelines..."}
            className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl font-bold shadow-md shadow-blue-500/10 transition-all active:scale-[0.98] disabled:opacity-40 disabled:scale-100 shrink-0 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

    </div>
  );
}