import { useState, useEffect, useRef } from "react";

const ZODIAC_SIGNS = [
  { sign: "Aries", symbol: "♈", element: "Fire", dates: [3, 21, 4, 19], color: "#FF6B6B" },
  { sign: "Taurus", symbol: "♉", element: "Earth", dates: [4, 20, 5, 20], color: "#90BE6D" },
  { sign: "Gemini", symbol: "♊", element: "Air", dates: [5, 21, 6, 20], color: "#F9C74F" },
  { sign: "Cancer", symbol: "♋", element: "Water", dates: [6, 21, 7, 22], color: "#4CC9F0" },
  { sign: "Leo", symbol: "♌", element: "Fire", dates: [7, 23, 8, 22], color: "#FF9F1C" },
  { sign: "Virgo", symbol: "♍", element: "Earth", dates: [8, 23, 9, 22], color: "#80B918" },
  { sign: "Libra", symbol: "♎", element: "Air", dates: [9, 23, 10, 22], color: "#F4ACB7" },
  { sign: "Scorpio", symbol: "♏", element: "Water", dates: [10, 23, 11, 21], color: "#9B2226" },
  { sign: "Sagittarius", symbol: "♐", element: "Fire", dates: [11, 22, 12, 21], color: "#7B2D8B" },
  { sign: "Capricorn", symbol: "♑", element: "Earth", dates: [12, 22, 1, 19], color: "#4A4E69" },
  { sign: "Aquarius", symbol: "♒", element: "Air", dates: [1, 20, 2, 18], color: "#48CAE4" },
  { sign: "Pisces", symbol: "♓", element: "Water", dates: [2, 19, 3, 20], color: "#B5838D" },
];

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "hinglish", label: "Hinglish", flag: "✨" },
];

const UI_TEXT = {
  en: {
    title: "CELESTE ORACLE",
    subtitle: "Reveal the cosmic blueprint of your soul",
    by: "by",
    nameLabel: "Your Name", namePlaceholder: "Enter your name...",
    dateLabel: "Date of Birth", timeLabel: "Time of Birth",
    placeLabel: "Place of Birth", placePlaceholder: "City, Country...",
    revealBtn: "✦ Reveal My Chart",
    newChart: "New Chart",
    inputPlaceholder: "Ask the stars anything...",
    chooseLanguage: "Choose Language",
    suggested: ["What is my life purpose?", "Tell me about my love life", "What career suits me?", "What challenges await me?"],
    welcomeMsg: (name, sun, moon, rising, place) =>
      `✦ Welcome, ${name}. The stars have spoken — your cosmic blueprint is revealed.\n\nYou are a ${sun.sign} Sun (${sun.element}), ${moon.sign} Moon (${moon.element}), with ${rising.sign} Rising. Born in ${place || "the cosmos"}, the celestial energies at the moment of your birth paint a rich and unique portrait.\n\nAsk me anything — your destiny, love, career, purpose, or what the stars hold for you. 🌙`,
    systemPrompt: (name, dateStr, timeStr, place, sun, moon, rising, planetStr) =>
      `You are Celeste, an ancient and wise astrologer with deep knowledge of Vedic and Western astrology. You speak with poetic authority, mystical depth, and warmth. Always respond ONLY in English.\n\nYou are reading the chart of ${name}, born on ${dateStr} at ${timeStr} in ${place || "an unknown place"}.\n\nBirth chart:\n- Sun Sign: ${sun.sign} (${sun.element})\n- Moon Sign: ${moon.sign} (${moon.element})\n- Rising: ${rising.sign}\n- ${planetStr}\n\nBe insightful, mystical, specific to their chart. 3-5 paragraphs, poetic but grounded. End with an empowering note.`,
  },
  hi: {
    title: "सेलेस्टे ओरेकल",
    subtitle: "अपनी आत्मा का ब्रह्मांडीय रहस्य जानें",
    by: "द्वारा",
    nameLabel: "आपका नाम", namePlaceholder: "अपना नाम लिखें...",
    dateLabel: "जन्म तिथि", timeLabel: "जन्म समय",
    placeLabel: "जन्म स्थान", placePlaceholder: "शहर, देश...",
    revealBtn: "✦ मेरी कुंडली देखें",
    newChart: "नई कुंडली",
    inputPlaceholder: "सितारों से कुछ भी पूछें...",
    chooseLanguage: "भाषा चुनें",
    suggested: ["मेरे जीवन का उद्देश्य क्या है?", "मेरे प्रेम जीवन के बारे में बताएं", "मेरे लिए कौन सा करियर सही है?", "मेरे जीवन में क्या चुनौतियां हैं?"],
    welcomeMsg: (name, sun, moon, rising, place) =>
      `✦ स्वागत है, ${name}। सितारों ने बोल दिया है — आपकी ब्रह्मांडीय कुंडली प्रकट हो गई है।\n\nआप ${sun.sign} सूर्य (${sun.element}), ${moon.sign} चंद्रमा (${moon.element}), और ${rising.sign} लग्न के साथ जन्मे हैं। ${place || "इस ब्रह्मांड"} में आपके जन्म के समय ग्रहों की ऊर्जा ने आपको एक अनोखा व्यक्तित्व दिया है।\n\nमुझसे कुछ भी पूछें — भाग्य, प्रेम, करियर, जीवन का उद्देश्य, या भविष्य। 🌙`,
    systemPrompt: (name, dateStr, timeStr, place, sun, moon, rising, planetStr) =>
      `आप सेलेस्टे हैं, एक प्राचीन और बुद्धिमान ज्योतिषी जो वैदिक और पश्चिमी ज्योतिष की गहरी जानकार हैं। आप काव्यात्मक और रहस्यमय अंदाज़ में बात करती हैं। हमेशा केवल शुद्ध हिंदी में उत्तर दें।\n\nआप ${name} की कुंडली पढ़ रही हैं, जिनका जन्म ${dateStr} को ${timeStr} बजे ${place || "अज्ञात स्थान"} में हुआ था।\n\nजन्म कुंडली:\n- सूर्य राशि: ${sun.sign} (${sun.element})\n- चंद्र राशि: ${moon.sign} (${moon.element})\n- लग्न: ${rising.sign}\n- ${planetStr}\n\nव्यक्ति की कुंडली के अनुसार विशिष्ट, रहस्यमय और प्रेरणादायक उत्तर दें। 3-5 अनुच्छेद, काव्यात्मक लेकिन व्यावहारिक।`,
  },
  hinglish: {
    title: "CELESTE ORACLE",
    subtitle: "Apni soul ka cosmic raaz jaano ✨",
    by: "by",
    nameLabel: "Aapka Naam", namePlaceholder: "Apna naam likho...",
    dateLabel: "Janam Tithi", timeLabel: "Janam Ka Time",
    placeLabel: "Janam Ki Jagah", placePlaceholder: "Sheher, Desh...",
    revealBtn: "✦ Meri Kundli Dekho",
    newChart: "Nayi Kundli",
    inputPlaceholder: "Sitaron se kuch bhi pucho...",
    chooseLanguage: "Bhasha Chuno",
    suggested: ["Meri life ka purpose kya hai?", "Meri love life kaisi rahegi?", "Mere liye kaun sa career sahi hai?", "Kya challenges aane wale hain?"],
    welcomeMsg: (name, sun, moon, rising, place) =>
      `✦ Welcome, ${name}! Sitaron ne bol diya — tera cosmic blueprint reveal ho gaya!\n\nTu ek ${sun.sign} Sun (${sun.element}) hai, tera Moon ${moon.sign} mein hai, aur Rising sign ${rising.sign} hai. ${place || "Is jagah"} mein janam lete waqt jo planetary energy thi, usne tujhe ek unique soul banaya hai.\n\nKuch bhi pooch — destiny, love, career, life purpose, ya future kya hold karta hai tere liye. 🌙`,
    systemPrompt: (name, dateStr, timeStr, place, sun, moon, rising, planetStr) =>
      `You are Celeste, ek ancient aur wise astrologer. Tum Hinglish mein baat karte ho — Hindi aur English ka natural mix, Roman script mein, jaise close dost baat karte hain. Hamesha Hinglish mein jawab do, pure Hindi ya pure English mat use karo.\n\nTum ${name} ki kundli padh rahe ho, jo ${dateStr} ko ${timeStr} baje ${place || "ek jagah"} mein paida hue the.\n\nUnki birth chart:\n- Sun Sign: ${sun.sign} (${sun.element})\n- Moon Sign: ${moon.sign} (${moon.element})\n- Rising: ${rising.sign}\n- ${planetStr}\n\nKundli ke according specific, mystical aur thoda casual Hinglish mein jawab do. 3-4 paragraphs. Empowering note se khatam karo.`,
  },
};

function getSunSign(month, day) {
  for (const z of ZODIAC_SIGNS) {
    const [sm, sd, em, ed] = z.dates;
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return z;
  }
  return ZODIAC_SIGNS[0];
}
function getMoonSign(birthDate) {
  const idx = Math.floor((birthDate.getTime() / (1000 * 60 * 60 * 24 * 2.5)) % 12);
  return ZODIAC_SIGNS[((idx % 12) + 12) % 12];
}
function getRisingSign(hour) {
  return ZODIAC_SIGNS[Math.floor(hour / 2) % 12];
}
function getPlanets(birthDate) {
  const base = birthDate.getTime();
  return [
    { planet: "☿ Mercury", sign: ZODIAC_SIGNS[(Math.floor(base / 8e9)) % 12] },
    { planet: "♀ Venus", sign: ZODIAC_SIGNS[(Math.floor(base / 1.9e10)) % 12] },
    { planet: "♂ Mars", sign: ZODIAC_SIGNS[(Math.floor(base / 5.9e10)) % 12] },
    { planet: "♃ Jupiter", sign: ZODIAC_SIGNS[(Math.floor(base / 3.7e11)) % 12] },
    { planet: "♄ Saturn", sign: ZODIAC_SIGNS[(Math.floor(base / 9.3e11)) % 12] },
  ];
}

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.7 + 0.2, delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "white", opacity: s.opacity,
          animation: `twinkle 3s ${s.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
    </div>
  );
}

function LanguagePicker({ lang, setLang, t }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", color: "#a78bfa", textTransform: "uppercase", marginBottom: 10, textAlign: "center" }}>
        {t.chooseLanguage}
      </label>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {LANGUAGES.map((l) => (
          <button key={l.code} onClick={() => setLang(l.code)} style={{
            padding: "8px 16px", borderRadius: 24,
            background: lang === l.code ? "linear-gradient(135deg, #7c3aed, #5b21b6)" : "transparent",
            border: lang === l.code ? "1px solid #a78bfa" : "1px solid #7c3aed44",
            color: lang === l.code ? "#fff" : "#a78bfa",
            fontSize: 13, cursor: "pointer", transition: "all 0.25s",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: lang === l.code ? "0 0 16px #7c3aed55" : "none",
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            <span>{l.flag}</span><span>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BirthChartWheel({ sunSign, moonSign, risingSign, planets }) {
  const size = 260, cx = 130, cy = 130, outerR = 118, innerR = 78, coreR = 44;
  const allPlanets = [
    { label: "☉", sign: sunSign, color: "#FFD700" },
    { label: "☽", sign: moonSign, color: "#C0C0C0" },
    { label: "↑", sign: risingSign, color: "#88CCFF" },
    ...planets.map((p) => ({ label: p.planet.split(" ")[0], sign: p.sign, color: p.sign.color })),
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: "drop-shadow(0 0 18px #7c3aed88)" }}>
      <defs>
        <radialGradient id="bg2"><stop offset="0%" stopColor="#1e1040" /><stop offset="100%" stopColor="#0a0618" /></radialGradient>
        <radialGradient id="core2"><stop offset="0%" stopColor="#7c3aed44" /><stop offset="100%" stopColor="#3b0764" /></radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={outerR} fill="url(#bg2)" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#6d28d944" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={coreR} fill="url(#core2)" stroke="#a78bfa" strokeWidth="1" />
      {ZODIAC_SIGNS.map((z, i) => {
        const a = (i * 30 - 90) * Math.PI / 180, ma = ((i * 30 + 15 - 90) * Math.PI) / 180;
        const r1 = innerR + 2, r2 = outerR - 2, lr = (r1 + r2) / 2;
        return (
          <g key={z.sign}>
            <line x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)} x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)} stroke="#7c3aed55" strokeWidth="0.8" />
            <text x={cx + lr * Math.cos(ma)} y={cy + lr * Math.sin(ma)} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill={z.color} opacity="0.85" style={{ fontFamily: "serif" }}>{z.symbol}</text>
          </g>
        );
      })}
      {allPlanets.map((p, i) => {
        const si = ZODIAC_SIGNS.findIndex((z) => z.sign === p.sign.sign);
        const a = ((si * 30 + 15 - 90) * Math.PI) / 180, r = coreR + 14;
        const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={8} fill="#1e1040" stroke={p.color} strokeWidth="1.5" opacity="0.9" />
            <text x={px} y={py} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill={p.color} style={{ fontFamily: "serif" }}>{p.label}</text>
          </g>
        );
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="22" fill="#a78bfa" style={{ fontFamily: "serif" }}>✦</text>
    </svg>
  );
      }
export default function AstrologyApp() {
  const [step, setStep] = useState("form");
  const [lang, setLang] = useState("en");
  const [form, setForm] = useState({ name: "", date: "", time: "", place: "" });
  const [chart, setChart] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const t = UI_TEXT[lang];

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
      @keyframes twinkle { from { opacity:0.2; transform:scale(1); } to { opacity:1; transform:scale(1.4); } }
      @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes orbIn { from { opacity:0; transform:scale(0.8) rotate(-10deg); } to { opacity:1; transform:scale(1) rotate(0deg); } }
      @keyframes pulseGlow { 0%,100% { box-shadow:0 0 18px #7c3aed55; } 50% { box-shadow:0 0 36px #a78bfa99; } }
      @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      * { box-sizing:border-box; margin:0; padding:0; }
      body { background:#05020f; }
      ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#1a0d33; } ::-webkit-scrollbar-thumb { background:#7c3aed; border-radius:4px; }
      input[type="date"]::-webkit-calendar-picker-indicator,
      input[type="time"]::-webkit-calendar-picker-indicator { filter:invert(0.7) sepia(1) saturate(3) hue-rotate(220deg); cursor:pointer; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function buildChart() {
    const d = new Date(form.date + "T" + (form.time || "12:00"));
    const sun = getSunSign(d.getMonth() + 1, d.getDate());
    const moon = getMoonSign(d);
    const rising = getRisingSign(d.getHours());
    const planets = getPlanets(d);
    setChart({ sun, moon, rising, planets, date: d, place: form.place, name: form.name });
    setMessages([{ role: "assistant", text: t.welcomeMsg(form.name, sun, moon, rising, form.place) }]);
    setStep("chart");
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    const planetStr = chart.planets.map((p) => `${p.planet} in ${p.sign.sign}`).join(", ");
    const systemPrompt = t.systemPrompt(chart.name, chart.date.toDateString(), chart.date.toLocaleTimeString(), chart.place, chart.sun, chart.moon, chart.rising, planetStr);
    
    try {
      const history = messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, messages: [...history, { role: "user", content: currentInput }] }),
      });
      const raw = await res.text();
      let reply = "The stars are silent. Please try again.";
      try {
        const data = JSON.parse(raw);
        if (Array.isArray(data.content)) {
          reply = data.content.map((b) => String(b.text || "")).join("");
        } else if (data.error) {
          reply = String(data.error);
        }
      } catch(e) {
        reply = "Parse error. Please try again.";
      }
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Connection interrupted: " + String(err.message) }]);
    }
    setLoading(false);
    }
  }

  const currentLangObj = LANGUAGES.find((l) => l.code === lang);
  const base = { fontFamily: "'Cormorant Garamond', serif", background: "#05020f", minHeight: "100vh", color: "#e8d5ff", position: "relative", overflow: "hidden" };

  if (step === "form") return (
    <div style={base}>
      <StarField />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
        <div style={{ animation: "fadeUp 1s ease both", textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✦</div>
          <h1 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(18px,5vw,34px)", color: "#c4b5fd", letterSpacing: "0.05em", lineHeight: 1.2, marginBottom: 6 }}>{t.title}</h1>
          <p style={{ color: "#a78bfa", fontSize: 15, fontStyle: "italic", opacity: 0.8, marginBottom: 8 }}>{t.subtitle}</p>
          <p style={{ color: "#7c3aed", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
            {t.by} <span style={{ color: "#c4b5fd", fontWeight: 600 }}>अ TechnicalMonk</span>
          </p>
        </div>
        <div style={{ animation: "fadeUp 1.2s 0.2s ease both", background: "linear-gradient(135deg, #12052acc, #1e0a3ccc)", border: "1px solid #7c3aed55", borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 440, backdropFilter: "blur(16px)", boxShadow: "0 0 60px #7c3aed22" }}>
          <LanguagePicker lang={lang} setLang={setLang} t={t} />
          {[
            { key: "name", label: t.nameLabel, type: "text", placeholder: t.namePlaceholder },
            { key: "date", label: t.dateLabel, type: "date", placeholder: "" },
            { key: "time", label: t.timeLabel, type: "time", placeholder: "" },
            { key: "place", label: t.placeLabel, type: "text", placeholder: t.placePlaceholder },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.12em", color: "#a78bfa", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: "100%", padding: "11px 16px", background: "#0d0520", border: "1px solid #7c3aed44", borderRadius: 10, color: "#e8d5ff", fontSize: 15, fontFamily: "'Cormorant Garamond', serif", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
                onBlur={(e) => (e.target.style.borderColor = "#7c3aed44")}
              />
            </div>
          ))}
          <button onClick={buildChart} disabled={!form.name || !form.date} style={{
            width: "100%", padding: "14px", marginTop: 8,
            background: "linear-gradient(135deg, #7c3aed, #5b21b6)", border: "none", borderRadius: 12, color: "white",
            fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase",
            fontFamily: "'Cinzel Decorative', serif", cursor: "pointer",
            transition: "all 0.3s", animation: "pulseGlow 3s infinite",
            opacity: !form.name || !form.date ? 0.5 : 1,
          }}
            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >{t.revealBtn}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ ...base, display: "flex", flexDirection: "column", height: "100vh" }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #7c3aed33", background: "#05020fcc", backdropFilter: "blur(10px)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ animation: "orbIn 1s ease both", flexShrink: 0 }}>
              <BirthChartWheel sunSign={chart.sun} moonSign={chart.moon} risingSign={chart.rising} planets={chart.planets} />
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(10px,3vw,14px)", color: "#c4b5fd", letterSpacing: "0.05em" }}>{chart.name}</div>
              <div style={{ fontSize: 11, color: "#a78bfa88", marginTop: 2 }}>{chart.date.toLocaleDateString()} · {chart.place}</div>
              <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
                {[{ label: "☉ " + chart.sun.sign, color: "#FFD700" }, { label: "☽ " + chart.moon.sign, color: "#C0C0C0" }, { label: "↑ " + chart.rising.sign, color: "#88CCFF" }].map((b) => (
                  <span key={b.label} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, border: `1px solid ${b.color}44`, color: b.color, background: `${b.color}11` }}>{b.label}</span>
                ))}
                <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, border: "1px solid #7c3aed66", color: "#c4b5fd", background: "#7c3aed22" }}>
                  {currentLangObj.flag} {currentLangObj.label}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <button onClick={() => { setStep("form"); setChart(null); setMessages([]); }}
              style={{ background: "none", border: "1px solid #7c3aed55", borderRadius: 8, color: "#a78bfa", padding: "5px 10px", cursor: "pointer", fontSize: 11, fontFamily: "'Cormorant Garamond', serif", whiteSpace: "nowrap" }}>
              {t.newChart}
            </button>
            <div style={{ display: "flex", gap: 4 }}>
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)} title={l.label} style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: lang === l.code ? "1px solid #a78bfa" : "1px solid #7c3aed33",
                  background: lang === l.code ? "#7c3aed44" : "transparent",
                  cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                }}>{l.flag}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp 0.4s ease both" }}>
              {m.role === "assistant" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginRight: 10, marginTop: 4 }}>✦</div>
              )}
              <div style={{
                maxWidth: "78%", padding: "12px 16px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: m.role === "user" ? "linear-gradient(135deg, #7c3aed, #5b21b6)" : "linear-gradient(135deg, #12052acc, #1e0a3ccc)",
                border: m.role === "user" ? "none" : "1px solid #7c3aed33",
                fontSize: 15, lineHeight: 1.7, color: m.role === "user" ? "#f3e8ff" : "#ddd6fe",
                backdropFilter: "blur(8px)", whiteSpace: "pre-wrap",
              }}>
                {m.text.replace(/\*\*(.*?)\*\*/g, "$1")}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, animation: "fadeUp 0.3s ease" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
              <div style={{ display: "flex", gap: 5, padding: "12px 16px", background: "#12052acc", border: "1px solid #7c3aed33", borderRadius: "18px 18px 18px 4px" }}>
                {[0, 1, 2].map((j) => <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", animation: `spin 1.2s ${j * 0.2}s ease-in-out infinite`, opacity: 0.7 }} />)}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {messages.length <= 1 && (
          <div style={{ padding: "0 16px 12px", display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
            {t.suggested.map((q) => (
              <button key={q} onClick={() => setInput(q)} style={{ padding: "6px 14px", borderRadius: 20, background: "transparent", border: "1px solid #7c3aed55", color: "#a78bfa", fontSize: 12, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.target.style.background = "#7c3aed22"; e.target.style.borderColor = "#a78bfa"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "#7c3aed55"; }}
              >{q}</button>
            ))}
          </div>
        )}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #7c3aed33", background: "#05020fcc", backdropFilter: "blur(10px)", flexShrink: 0, display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea value={input} placeholder={t.inputPlaceholder}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            rows={1}
            style={{ flex: 1, padding: "12px 16px", background: "#0d0520", border: "1px solid #7c3aed44", borderRadius: 14, color: "#e8d5ff", fontSize: 15, fontFamily: "'Cormorant Garamond', serif", outline: "none", resize: "none", lineHeight: 1.5, maxHeight: 100, overflow: "auto" }}
            onFocus={(e) => (e.target.style.borderColor = "#a78bfa")}
            onBlur={(e) => (e.target.style.borderColor = "#7c3aed44")}
          />
          <button onClick={sendMessage} disabled={!input.trim() || loading} style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #7c3aed, #5b21b6)", border: "none", color: "white", fontSize: 18, cursor: "pointer", opacity: !input.trim() || loading ? 0.4 : 1, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={(e) => { if (!loading && input.trim()) e.target.style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >✦</button>
        </div>
      </div>
    </div>
  );
}
