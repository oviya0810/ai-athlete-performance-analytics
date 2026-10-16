import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, MessageSquare, Dumbbell, Activity, ShieldAlert } from 'lucide-react';

interface AICoachAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AICoachAssistantModal: React.FC<AICoachAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste! I am your SportVision AI Coach Assistant. Ask me anything about fitness test biomechanics, sit-up/push-up form corrections, vertical jump takeoff power, or SAI NCOE selection standards!',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const quickQuestions = [
    'How do I increase my Vertical Jump explosive height?',
    'What causes partial rep flags in Sit-Ups?',
    'How to maintain 90-degree elbow flexion in Push-Ups?',
    'What is the SAI NCOE qualification threshold?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate smart AI response
    setTimeout(() => {
      let aiReply = '';
      const lower = query.toLowerCase();

      if (lower.includes('jump') || lower.includes('vertical')) {
        aiReply = 'To improve vertical jump apex height:\n1. Optimize countermovement depth (knee flexion angle ~90° to 105°).\n2. Maximize arm swing velocity—arm thrust accounts for up to 15-20% of takeoff propulsion.\n3. Incorporate plyometric depth jumps and ankle stiffness drills 3x weekly.';
      } else if (lower.includes('sit-up') || lower.includes('situp')) {
        aiReply = 'Sit-Up AI flags partial reps when:\n1. Scapulae (shoulder blades) do not lift off the floor during ascent.\n2. Elbows fail to reach the knee line at peak contraction.\nTip: Engage deep transverse abdominis and avoid pulling on your neck.';
      } else if (lower.includes('push-up') || lower.includes('pushup')) {
        aiReply = 'For perfect 100% valid Push-Up reps:\n1. Maintain a rigid shoulder-hip-ankle line (no sagging lumbar spine).\n2. Descend until elbow angle reaches <= 90 degrees.\n3. Lock out elbows fully at the top of each repetition.';
      } else if (lower.includes('ncoe') || lower.includes('sai') || lower.includes('threshold')) {
        aiReply = 'SAI National Centres of Excellence prioritize athletes scoring >= 85/100 composite talent score with an authenticity rating of 98%+ on video verification.';
      } else {
        aiReply = `Great question on "${query}". Based on SAI biomechanical standards, focus on explosive concentric tempo and maintain strict spinal alignment. Regularly record your assessments so our Computer Vision pipeline can track your kinematic progress!`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply,
          timestamp: 'Just now'
        }
      ]);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                AI Coach Assistant
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Interactive Biomechanics Advisor
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ask about technique, drill corrections & SAI development plans
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions Chips */}
        <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Suggested:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white shrink-0 border border-slate-700/70 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 min-h-[320px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'ai'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'ai'
                    ? 'bg-slate-800/80 text-slate-200 border border-slate-700/70'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'ai' ? 'text-slate-400' : 'text-blue-200'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Coach about jump mechanics, push-up depth, or SAI training..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm inline-flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/25"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
