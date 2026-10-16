import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Volume2, Send, Languages, Sparkles } from 'lucide-react';

interface VoiceAssistantWidgetProps {
  userName?: string;
}

type LangCode = 'en-IN' | 'hi-IN' | 'ta-IN' | 'te-IN' | 'bn-IN' | 'kn-IN';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'ta-IN', label: 'தமிழ்' },
  { code: 'te-IN', label: 'తెలుగు' },
  { code: 'bn-IN', label: 'বাংলা' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ' }
];

interface Intent {
  keywords: string[];
  reply: Record<LangCode, string>;
}

const INTENTS: Intent[] = [
  {
    keywords: ['upload', 'video', 'test', 'record'],
    reply: {
      'en-IN': 'Go to "Fitness Tests" in the sidebar, pick your test, then upload or record a 9:16 video for AI analysis.',
      'hi-IN': 'साइडबार में "Fitness Tests" खोलें, अपना टेस्ट चुनें, फिर AI विश्लेषण के लिए 9:16 वीडियो अपलोड या रिकॉर्ड करें।',
      'ta-IN': 'சைட்பாரில் "Fitness Tests" சென்று, டெஸ்ட் தேர்ந்தெடுத்து, AI பகுப்பாய்வுக்கு 9:16 வீடியோ பதிவேற்றவும்.',
      'te-IN': 'సైడ్‌బార్‌లో "Fitness Tests" తెరిచి, టెస్ట్ ఎంచుకుని, AI విశ్లేషణ కోసం 9:16 వీడియో అప్‌లోడ్ చేయండి.',
      'bn-IN': 'সাইডবারে "Fitness Tests" খুলুন, আপনার টেস্ট বেছে নিন, তারপর AI বিশ্লেষণের জন্য 9:16 ভিডিও আপলোড করুন।',
      'kn-IN': 'ಸೈಡ್‌ಬಾರ್‌ನಲ್ಲಿ "Fitness Tests" ತೆರೆದು, ಟೆಸ್ಟ್ ಆಯ್ಕೆಮಾಡಿ, AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ 9:16 ವೀಡಿಯೊ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.'
    }
  },
  {
    keywords: ['score', 'result', 'talent'],
    reply: {
      'en-IN': 'Your Talent Score and past reports are under "My Results" in the sidebar.',
      'hi-IN': 'आपका टैलेंट स्कोर और पिछली रिपोर्ट साइडबार में "My Results" के अंतर्गत हैं।',
      'ta-IN': 'உங்கள் டேலண்ட் ஸ்கோர் மற்றும் முந்தைய அறிக்கைகள் "My Results" இல் உள்ளன.',
      'te-IN': 'మీ టాలెంట్ స్కోర్ మరియు గత రిపోర్ట్‌లు "My Results" లో ఉన్నాయి.',
      'bn-IN': 'আপনার ট্যালেন্ট স্কোর এবং আগের রিপোর্ট "My Results" এর অধীনে আছে।',
      'kn-IN': 'ನಿಮ್ಮ ಟ್ಯಾಲೆಂಟ್ ಸ್ಕೋರ್ ಮತ್ತು ಹಿಂದಿನ ವರದಿಗಳು "My Results" ನಲ್ಲಿ ಇವೆ.'
    }
  },
  {
    keywords: ['injury', 'pain', 'risk', 'hurt'],
    reply: {
      'en-IN': 'Check "Injury Risk Detection" in the sidebar — it flags joints under stress from your last test and gives prevention tips.',
      'hi-IN': '"Injury Risk Detection" देखें — यह आपके पिछले टेस्ट से तनावग्रस्त जोड़ों को दिखाता है और बचाव के सुझाव देता है।',
      'ta-IN': '"Injury Risk Detection" பார்க்கவும் — உங்கள் கடைசி டெஸ்டில் அழுத்தத்தில் உள்ள மூட்டுகளை காட்டி தடுப்பு உதவிக்குறிப்புகளை தரும்.',
      'te-IN': '"Injury Risk Detection" చూడండి — మీ చివరి టెస్ట్ నుండి ఒత్తిడిలో ఉన్న కీళ్లను చూపి నివారణ చిట్కాలు ఇస్తుంది.',
      'bn-IN': '"Injury Risk Detection" দেখুন — এটি আপনার শেষ টেস্ট থেকে চাপে থাকা জয়েন্টগুলো দেখায় এবং প্রতিরোধের পরামর্শ দেয়।',
      'kn-IN': '"Injury Risk Detection" ನೋಡಿ — ಇದು ನಿಮ್ಮ ಕೊನೆಯ ಟೆಸ್ಟ್‌ನಿಂದ ಒತ್ತಡದಲ್ಲಿರುವ ಕೀಲುಗಳನ್ನು ತೋರಿಸಿ ತಡೆಗಟ್ಟುವ ಸಲಹೆ ನೀಡುತ್ತದೆ.'
    }
  },
  {
    keywords: ['sport', 'recommend', 'suggest', 'suitable'],
    reply: {
      'en-IN': 'Open "Sports Recommendation" — our AI matches your strengths to the sports you\'re most suited for.',
      'hi-IN': '"Sports Recommendation" खोलें — हमारा AI आपकी ताकत के अनुसार सबसे उपयुक्त खेल सुझाता है।',
      'ta-IN': '"Sports Recommendation" திறக்கவும் — உங்கள் பலத்திற்கு ஏற்ற விளையாட்டுகளை AI பரிந்துரைக்கும்.',
      'te-IN': '"Sports Recommendation" తెరవండి — మీ బలాలకు తగిన క్రీడలను AI సూచిస్తుంది.',
      'bn-IN': '"Sports Recommendation" খুলুন — আপনার শক্তির উপযোগী খেলা AI সুপারিশ করবে।',
      'kn-IN': '"Sports Recommendation" ತೆರೆಯಿರಿ — ನಿಮ್ಮ ಶಕ್ತಿಗೆ ಸೂಕ್ತವಾದ ಕ್ರೀಡೆಗಳನ್ನು AI ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ.'
    }
  },
  {
    keywords: ['roadmap', 'training', 'plan', 'workout'],
    reply: {
      'en-IN': '"Training Roadmap" gives you a personalized week-by-week training plan based on your test results.',
      'hi-IN': '"Training Roadmap" आपके टेस्ट परिणामों के आधार पर सप्ताह-दर-सप्ताह प्रशिक्षण योजना देता है।',
      'ta-IN': '"Training Roadmap" உங்கள் டெஸ்ட் முடிவுகளின் அடிப்படையில் வார வாரம் பயிற்சி திட்டத்தை தரும்.',
      'te-IN': '"Training Roadmap" మీ టెస్ట్ ఫలితాల ఆధారంగా వారానికి ఒక ప్రణాళికను ఇస్తుంది.',
      'bn-IN': '"Training Roadmap" আপনার টেস্ট ফলাফলের ভিত্তিতে সাপ্তাহিক প্রশিক্ষণ পরিকল্পনা দেয়।',
      'kn-IN': '"Training Roadmap" ನಿಮ್ಮ ಟೆಸ್ಟ್ ಫಲಿತಾಂಶಗಳ ಆಧಾರದ ಮೇಲೆ ವಾರವಾರದ ತರಬೇತಿ ಯೋಜನೆ ನೀಡುತ್ತದೆ.'
    }
  },
  {
    keywords: ['scheme', 'government', 'scholarship', 'khelo'],
    reply: {
      'en-IN': '"Government Scheme Recommendation" shows Khelo India, TOPS, and SAI scholarships you may be eligible for.',
      'hi-IN': '"Government Scheme Recommendation" में खेलो इंडिया, टॉप्स और SAI छात्रवृत्ति दिखती है जिनके आप पात्र हो सकते हैं।',
      'ta-IN': '"Government Scheme Recommendation" இல் நீங்கள் தகுதியுள்ள கெலோ இந்தியா, TOPS, SAI உதவித்தொகைகள் காட்டப்படும்.',
      'te-IN': '"Government Scheme Recommendation" లో మీరు అర్హులైన ఖేలో ఇండియా, TOPS, SAI స్కాలర్‌షిప్‌లు కనిపిస్తాయి.',
      'bn-IN': '"Government Scheme Recommendation" এ খেলো ইন্ডিয়া, TOPS এবং SAI বৃত্তি দেখানো হয় যেগুলোর জন্য আপনি যোগ্য হতে পারেন।',
      'kn-IN': '"Government Scheme Recommendation" ನಲ್ಲಿ ನೀವು ಅರ್ಹರಾಗಿರುವ ಖೇಲೋ ಇಂಡಿಯಾ, TOPS, SAI ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು ಕಾಣಿಸುತ್ತವೆ.'
    }
  },
  {
    keywords: ['academy', 'college', 'institute', 'join'],
    reply: {
      'en-IN': '"Sport Academy Matching" ranks SAI and state academies for your sport and state, with seats and contacts.',
      'hi-IN': '"Sport Academy Matching" आपके खेल और राज्य के लिए SAI व राज्य अकादमियों को क्रम में दिखाता है।',
      'ta-IN': '"Sport Academy Matching" உங்கள் விளையாட்டு மற்றும் மாநிலத்திற்கு ஏற்ற SAI/மாநில அகாடமிகளை தரவரிசைப்படுத்தும்.',
      'te-IN': '"Sport Academy Matching" మీ క్రీడ మరియు రాష్ట్రానికి తగిన SAI/రాష్ట్ర అకాడమీలను ర్యాంక్ చేస్తుంది.',
      'bn-IN': '"Sport Academy Matching" আপনার খেলা ও রাজ্যের জন্য SAI/রাজ্য একাডেমিগুলো র‍্যাঙ্ক করে।',
      'kn-IN': '"Sport Academy Matching" ನಿಮ್ಮ ಕ್ರೀಡೆ ಮತ್ತು ರಾಜ್ಯಕ್ಕೆ ಸೂಕ್ತವಾದ SAI/ರಾಜ್ಯ ಅಕಾಡೆಮಿಗಳನ್ನು ಶ್ರೇಣೀಕರಿಸುತ್ತದೆ.'
    }
  },
  {
    keywords: ['achievement', 'badge', 'leaderboard'],
    reply: {
      'en-IN': 'Check "Achievements" for your badges and "Leaderboard" to see your national rank.',
      'hi-IN': 'अपने बैज देखने के लिए "Achievements" और राष्ट्रीय रैंक देखने के लिए "Leaderboard" खोलें।',
      'ta-IN': "உங்கள் பேட்ஜுகளுக்கு \"Achievements\" மற்றும் தேசிய தரவரிசைக்கு \"Leaderboard\" பார்க்கவும்.",
      'te-IN': 'మీ బ్యాడ్జీల కోసం "Achievements" మరియు జాతీయ ర్యాంక్ కోసం "Leaderboard" చూడండి.',
      'bn-IN': 'আপনার ব্যাজের জন্য "Achievements" এবং জাতীয় র‍্যাঙ্কের জন্য "Leaderboard" দেখুন।',
      'kn-IN': 'ನಿಮ್ಮ ಬ್ಯಾಡ್ಜ್‌ಗಳಿಗಾಗಿ "Achievements" ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಶ್ರೇಣಿಗಾಗಿ "Leaderboard" ನೋಡಿ.'
    }
  },
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'vanakkam'],
    reply: {
      'en-IN': 'Hello! I\'m your SportVision AI voice assistant. Ask me about uploading tests, scores, injury risk, or training.',
      'hi-IN': 'नमस्ते! मैं आपका SportVision AI वॉइस असिस्टेंट हूँ। टेस्ट अपलोड, स्कोर, इंजरी रिस्क या ट्रेनिंग के बारे में पूछें।',
      'ta-IN': 'வணக்கம்! நான் உங்கள் SportVision AI குரல் உதவியாளர். டெஸ்ட், ஸ்கோர், காயம் அபாயம் அல்லது பயிற்சி பற்றி கேளுங்கள்.',
      'te-IN': 'నమస్తే! నేను మీ SportVision AI వాయిస్ అసిస్టెంట్. టెస్ట్, స్కోర్, గాయం రిస్క్ లేదా ట్రైనింగ్ గురించి అడగండి.',
      'bn-IN': 'নমস্কার! আমি আপনার SportVision AI ভয়েস অ্যাসিস্ট্যান্ট। টেস্ট, স্কোর, ইনজুরি রিস্ক বা ট্রেনিং নিয়ে জিজ্ঞাসা করুন।',
      'kn-IN': 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ SportVision AI ಧ್ವನಿ ಸಹಾಯಕ. ಟೆಸ್ಟ್, ಸ್ಕೋರ್, ಗಾಯದ ಅಪಾಯ ಅಥವಾ ತರಬೇತಿ ಬಗ್ಗೆ ಕೇಳಿ.'
    }
  }
];

const FALLBACK: Record<LangCode, string> = {
  'en-IN': "I didn't quite catch that. Try asking about uploading a test, your score, injury risk, training roadmap, government schemes, or academies.",
  'hi-IN': 'मुझे ठीक से समझ नहीं आया। टेस्ट अपलोड, स्कोर, इंजरी रिस्क, ट्रेनिंग रोडमैप, सरकारी योजना या अकादमी के बारे में पूछें।',
  'ta-IN': 'எனக்கு புரியவில்லை. டெஸ்ட், ஸ்கோர், காயம் அபாயம், பயிற்சி திட்டம், அரசு திட்டங்கள் அல்லது அகாடமி பற்றி கேளுங்கள்.',
  'te-IN': 'నాకు అర్థం కాలేదు. టెస్ట్, స్కోర్, గాయం రిస్క్, ట్రైనింగ్ రోడ్‌మ్యాప్, ప్రభుత్వ పథకాలు లేదా అకాడమీల గురించి అడగండి.',
  'bn-IN': 'আমি ঠিক বুঝতে পারিনি। টেস্ট, স্কোর, ইনজুরি রিস্ক, ট্রেনিং রোডম্যাপ, সরকারি স্কিম বা একাডেমি নিয়ে জিজ্ঞাসা করুন।',
  'kn-IN': 'ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ಟೆಸ್ಟ್, ಸ್ಕೋರ್, ಗಾಯದ ಅಪಾಯ, ತರಬೇತಿ ರೋಡ್‌ಮ್ಯಾಪ್, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಅಥವಾ ಅಕಾಡೆಮಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ.'
};

function getReply(query: string, lang: LangCode): string {
  const q = query.toLowerCase();
  const hit = INTENTS.find((intent) => intent.keywords.some((k) => q.includes(k)));
  return hit ? hit.reply[lang] : FALLBACK[lang];
}

interface ChatMsg {
  role: 'user' | 'assistant';
  text: string;
}

export const VoiceAssistantWidget: React.FC<VoiceAssistantWidgetProps> = ({ userName }) => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<LangCode>('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
  }, []);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const handleQuery = (query: string) => {
    if (!query.trim()) return;
    const reply = getReply(query, lang);
    setMessages((prev) => [...prev, { role: 'user', text: query }, { role: 'assistant', text: reply }]);
    speak(reply);
  };

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognition.lang = lang;
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleQuery(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-green-500 shadow-2xl shadow-blue-600/30 flex items-center justify-center text-white hover:scale-105 transition-transform"
        title="AI Voice Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[340px] max-w-[calc(100vw-2rem)] glass-card rounded-3xl border border-slate-700/60 shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold text-white">Voice Assistant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as LangCode)}
                className="bg-slate-800 text-xs text-white rounded-lg px-1.5 py-1 border border-slate-700 focus:outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[140px]">
            {messages.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                {userName ? `Hi ${userName}! ` : ''}Ask me anything about SportVision AI — tap the mic or type below.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {m.role === 'assistant' && <Volume2 className="w-3 h-3 inline mr-1 text-green-400" />}
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input row */}
          <div className="p-3 border-t border-slate-800 space-y-2">
            {speechSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? 'Listening... tap to stop' : 'Tap to speak'}
              </button>
            )}
            <div className="flex gap-2">
              <input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleQuery(textInput);
                    setTextInput('');
                  }
                }}
                placeholder="Or type your question..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => {
                  handleQuery(textInput);
                  setTextInput('');
                }}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {!speechSupported && (
              <p className="text-[10px] text-slate-500">
                Voice input isn't supported in this browser — use text above (try Chrome for voice).
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
