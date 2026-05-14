import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const PROJECTS = [
  {
    id: "01", title: "AI-Powered REST API Platform",
    category: "Backend · AI · Cloud", year: "2024",
    desc: "Scalable backend system integrating GPT-4 for intelligent data processing. Docker-based deployment with full CI/CD automation on AWS.",
    tags: ["Python", "FastAPI", "AWS", "Docker", "ChatGPT API"],
    accent: "#00f5ff", link: "",
    gradient: "linear-gradient(135deg,#020d14 0%,#041824 60%,#020d14 100%)",
  },
  {
    id: "02", title: "Full-Stack Web Application",
    category: "Frontend · Backend · Database", year: "2024",
    desc: "End-to-end web app with React frontend, Node.js backend, MongoDB database, and Firebase authentication.",
    tags: ["React", "Node.js", "MongoDB", "Firebase"],
    accent: "#a78bfa", link: "",
    gradient: "linear-gradient(135deg,#0a0514 0%,#140a24 60%,#0a0514 100%)",
  },
  {
    id: "03", title: "DevOps Automation Pipeline",
    category: "Cloud · DevOps · Automation", year: "2024",
    desc: "CI/CD pipeline architecture on AWS with GitHub Actions, Docker containers, and automated testing workflows.",
    tags: ["AWS", "GitHub Actions", "Docker", "CI/CD"],
    accent: "#34d399", link: "",
    gradient: "linear-gradient(135deg,#020e0a 0%,#041a10 60%,#020e0a 100%)",
  },
];

const SKILL_GROUPS = [
  { label: "Languages",      items: ["Python","JavaScript","C++","Linux"],                        color: "#00f5ff" },
  { label: "Frontend",       items: ["React.js","Node.js","HTML/CSS"],                    color: "#a78bfa" },
  { label: "Databases",      items: ["MySQL","MongoDB","Firebase","Supabase"],             color: "#34d399" },
  { label: "Cloud & DevOps", items: ["AWS","Docker","Git","GitHub","CI/CD Pipelines","Kubernetes"],    color: "#fb923c" },
  { label: "AI & Prompting", items: ["ChatGPT API","Gemini","GitHub Copilot","Claude","Cursor"],   color: "#f472b6" },
];

const MARQUEE = ["Python","·","React.js","·","Node.js","·","AWS","·","Docker","·","AI Engineering","·","FastAPI","·","MongoDB","·","CI/CD","·","Full Stack","·","Cloud","·","Prompt Engineering","·","Context Engineering","·"];

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useWindowSize() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function useCounter(target, active, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

/* ─────────────────────────────────────────
   NOISE OVERLAY (canvas grain)
───────────────────────────────────────── */
function NoiseOverlay() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const draw = () => {
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      const img = ctx.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 12;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:998, pointerEvents:"none", mixBlendMode:"overlay", opacity:0.55 }} />;
}

/* ─────────────────────────────────────────
   PAGE WIPE TRANSITION
───────────────────────────────────────── */
function PageWipe({ active }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9990,
      background:"linear-gradient(135deg, #00f5ff, #7c3aed)",
      transform: active ? "translateY(0%)" : "translateY(-101%)",
      transition: active ? "transform 0.55s cubic-bezier(.76,0,.24,1)" : "transform 0.55s cubic-bezier(.76,0,.24,1) 0.1s",
      pointerEvents:"none",
    }} />
  );
}

/* ─────────────────────────────────────────
   LOADER
───────────────────────────────────────── */
function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let v = 0;
    const iv = setInterval(() => {
      v += Math.random() * 16 + 5;
      if (v >= 100) { v = 100; clearInterval(iv); setTimeout(onDone, 400); }
      setPct(Math.floor(v));
    }, 55);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, background:"#080808", zIndex:99999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:36 }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(52px,12vw,130px)", letterSpacing:10, color:"#f0ece3", opacity:pct/100, transition:"opacity 0.1s" }}>ADJ.DEV</div>
      <div style={{ width:280, height:1, background:"rgba(255,255,255,0.07)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,#00f5ff,#a78bfa)", transform:`scaleX(${pct/100})`, transformOrigin:"left", transition:"transform 0.08s ease" }} />
      </div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#444", letterSpacing:5 }}>{String(pct).padStart(3,"0")} %</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────── */
function MagBtn({ children, onClick, primary, style: extraStyle = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * 0.28, dy = (e.clientY - cy) * 0.28;
    ref.current.style.transform = `translate(${dx}px,${dy}px) scale(1.04)`;
  };
  const onLeave = () => { ref.current.style.transform = "translate(0,0) scale(1)"; };
  const base = { padding:"15px 40px", borderRadius:2, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, letterSpacing:3, textTransform:"uppercase", transition:"transform 0.35s cubic-bezier(.23,1,.32,1), background 0.3s, color 0.3s, box-shadow 0.3s", cursor:"none", display:"inline-block", willChange:"transform", ...extraStyle };
  const pri  = { background:"#00f5ff", border:"none", color:"#080808", boxShadow:"0 0 0 rgba(0,245,255,0)" };
  const sec  = { background:"transparent", border:"1px solid rgba(240,236,227,0.2)", color:"rgba(240,236,227,0.6)" };
  const hPri = (e) => { e.currentTarget.style.background="#f0ece3"; e.currentTarget.style.boxShadow="0 8px 40px rgba(0,245,255,0.3)"; };
  const lPri = (e) => { e.currentTarget.style.background="#00f5ff"; e.currentTarget.style.boxShadow="0 0 0 rgba(0,245,255,0)"; };
  const hSec = (e) => { e.currentTarget.style.borderColor="rgba(240,236,227,0.5)"; e.currentTarget.style.color="#f0ece3"; };
  const lSec = (e) => { e.currentTarget.style.borderColor="rgba(240,236,227,0.2)"; e.currentTarget.style.color="rgba(240,236,227,0.6)"; };
  return (
    <button ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={primary ? hPri : hSec} style={{ ...base, ...(primary ? pri : sec) }}
      onMouseOut={primary ? lPri : lSec}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────
   MARQUEE
───────────────────────────────────────── */
function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"16px 0", background:"rgba(255,255,255,0.012)", position:"relative", zIndex:2 }}>
      <div style={{ display:"flex", gap:28, animation:"marqueeX 30s linear infinite", whiteSpace:"nowrap" }}>
        {items.map((item,i) => (
          <span key={i} style={{ fontFamily:"'Syne',sans-serif", fontSize:11, letterSpacing:3, textTransform:"uppercase", color:item==="·"?"#2a2a2a":"#555", flexShrink:0 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   REVEAL
───────────────────────────────────────── */
function Reveal({ children, delay = 0, y = 48 }) {
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold:0.07 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity:on?1:0, transform:on?`translateY(0)`:`translateY(${y}px)`, transition:`opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   STAT COUNTER
───────────────────────────────────────── */
function StatCounter({ num, label }) {
  const [active, setActive] = useState(false);
  const ref = useRef(null);
  const digits = parseInt(num);
  const suffix = num.replace(/[0-9]/g,"");
  const val = useCounter(digits, active, 1600);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold:0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:44, color:"#f0ece3", lineHeight:1, letterSpacing:1 }}>
        {active ? val : 0}{suffix}
      </div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(240,236,227,0.3)", letterSpacing:2, textTransform:"uppercase", marginTop:5 }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SKILL CARD (tilt)
───────────────────────────────────────── */
function SkillCard({ group, delay }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    ref.current.style.transform = `perspective(600px) rotateY(${x*14}deg) rotateX(${-y*14}deg) scale3d(1.02,1.02,1.02)`;
    ref.current.style.boxShadow = `${-x*20}px ${-y*20}px 40px ${group.color}18`;
  };
  const onLeave = () => {
    ref.current.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale3d(1,1,1)";
    ref.current.style.boxShadow = "none";
  };
  return (
    <Reveal delay={delay}>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ padding:"28px", borderTop:`2px solid ${group.color}`, background:"rgba(255,255,255,0.015)", height:"100%", transition:"transform 0.25s ease, box-shadow 0.25s ease", willChange:"transform", transformStyle:"preserve-3d" }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:group.color, letterSpacing:4, textTransform:"uppercase", marginBottom:22 }}>{group.label}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
          {group.items.map(item => (
            <span key={item} style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:600, color:"rgba(240,236,227,0.72)", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:2, padding:"7px 14px", letterSpacing:0.5, transition:"all 0.22s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.color="#f0ece3"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.color="rgba(240,236,227,0.72)"; }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────
   HORIZONTAL PROJECT SCROLL
───────────────────────────────────────── */
function ProjectsHScroll() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const scrollTo = (i) => {
    const card = trackRef.current?.children[i];
    if (card) card.scrollIntoView({ behavior:"smooth", block:"nearest", inline:"center" });
    setActive(i);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const fn = () => {
      const idx = Math.round(el.scrollLeft / (el.scrollWidth / PROJECTS.length));
      setActive(Math.min(idx, PROJECTS.length - 1));
    };
    el.addEventListener("scroll", fn, { passive:true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ position:"relative" }}>
      {/* Scroll track */}
      <div ref={trackRef} style={{ display:"flex", overflowX:"auto", scrollSnapType:"x mandatory", gap:3, scrollbarWidth:"none", msOverflowStyle:"none", cursor:"grab" }}>
        <style>{`.proj-track::-webkit-scrollbar{display:none}`}</style>
        {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
      </div>

      {/* Dot indicators */}
      <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:36 }}>
        {PROJECTS.map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)} style={{ width: active===i ? 28:8, height:8, borderRadius:4, background: active===i?"#00f5ff":"rgba(255,255,255,0.15)", border:"none", cursor:"none", transition:"all 0.4s cubic-bezier(.16,1,.3,1)", padding:0 }} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ p, index }) {
  const [hov, setHov] = useState(false);
  const handleClick = () => { if (p.link) window.open(p.link, "_blank", "noopener,noreferrer"); };
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={handleClick}
      style={{ minWidth:"clamp(320px,38vw,560px)", scrollSnapAlign:"center", background:"rgba(255,255,255,0.02)", border:`1px solid ${hov ? p.accent+"44" : "rgba(255,255,255,0.06)"}`, borderRadius:4, padding:"44px 40px", flexShrink:0, cursor:p.link?"none":"default", transition:"all 0.45s ease", transform:hov?"translateY(-8px)":"translateY(0)", boxShadow:hov?`0 24px 64px ${p.accent}18`:"none", position:"relative", overflow:"hidden" }}>
      {/* Glow orb */}
      <div style={{ position:"absolute", top:-80, right:-80, width:220, height:220, borderRadius:"50%", background:`radial-gradient(circle,${p.accent}22,transparent 70%)`, opacity:hov?1:0, transition:"opacity 0.45s ease", pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:56, lineHeight:1, color:hov?p.accent:"rgba(255,255,255,0.1)", transition:"color 0.4s ease", letterSpacing:2 }}>{p.id}</span>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:p.accent, letterSpacing:3, textTransform:"uppercase", marginBottom:4, opacity:hov?1:0.5, transition:"opacity 0.4s" }}>{p.category}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#444", letterSpacing:2 }}>{p.year}</div>
          </div>
        </div>
        <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(22px,2.8vw,36px)", letterSpacing:1, color:"#f0ece3", lineHeight:1.1, marginBottom:16 }}>{p.title}</h3>
        <p style={{ fontSize:13, color:"rgba(240,236,227,0.45)", lineHeight:1.85, marginBottom:28, opacity:hov?1:0.6, transition:"opacity 0.4s ease" }}>{p.desc}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:32 }}>
          {p.tags.map(t => (
            <span key={t} style={{ fontFamily:"monospace", fontSize:10, color:p.accent, border:`1px solid ${p.accent}44`, borderRadius:2, padding:"3px 10px", letterSpacing:1 }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:p.accent, opacity:hov?1:0, transform:hov?"translateX(0)":"translateX(-8px)", transition:"all 0.4s ease 0.05s" }}>
          {p.link ? <><span>Open Project</span><span>↗</span></> : <><span>Coming Soon</span><span>→</span></>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MOBILE MENU DRAWER
───────────────────────────────────────── */
function MobileMenu({ open, onClose, goto }) {
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", opacity:open?1:0, pointerEvents:open?"auto":"none", transition:"opacity 0.4s ease" }} />
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:280, zIndex:1001, background:"#0e0e0e", borderLeft:"1px solid rgba(255,255,255,0.07)", padding:"80px 40px 40px", display:"flex", flexDirection:"column", gap:8, transform:open?"translateX(0)":"translateX(100%)", transition:"transform 0.5s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(240,236,227,0.25)", letterSpacing:4, textTransform:"uppercase", marginBottom:24 }}>Navigation</div>
        {[["home","Home"],["about","About"],["journey","Journey"],["skills","Skills"],["projects","Projects"],["contact","Contact"]].map(([id,label],i) => (
          <button key={id} onClick={() => { goto(id); onClose(); }} style={{ background:"none", border:"none", textAlign:"left", fontFamily:"'Bebas Neue',sans-serif", fontSize:38, letterSpacing:2, color:"rgba(240,236,227,0.7)", cursor:"pointer", padding:"6px 0", transition:"color 0.3s ease, transform 0.3s ease", transitionDelay:`${i*0.04}s`, transform:open?"translateX(0)":"translateX(30px)", opacity:open?1:0 }}
            onMouseEnter={e => { e.currentTarget.style.color="#00f5ff"; e.currentTarget.style.transform="translateX(8px)"; }}
            onMouseLeave={e => { e.currentTarget.style.color="rgba(240,236,227,0.7)"; e.currentTarget.style.transform="translateX(0)"; }}>
            {label}
          </button>
        ))}
        <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", gap:12 }}>
          {[["GitHub","https://github.com/adj2425"],["LinkedIn","https://www.linkedin.com/in/abi-david-james-242506jan132304/"]].map(([l,h]) => (
            <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"rgba(240,236,227,0.4)", letterSpacing:2, textDecoration:"none" }}
              onMouseEnter={e => e.currentTarget.style.color="#00f5ff"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(240,236,227,0.4)"}>
              {l} ↗
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   JOURNEY TIMELINE
───────────────────────────────────────── */
const JOURNEY = [
  { year:"2023", title:"Full Stack Developer",       why:"Building half an app meant depending on others. I wanted full ownership of everything I create.",         what:"Mastered React, Node.js, REST APIs — connected every layer from pixel to database.",                               color:"#00f5ff", icon:"⚡" },
  { year:"2023", title:"AI Integration & Prompting",  why:"AI wasn't the future anymore — it was the present. I had to speak its language.",what:"Integrated ChatGPT API, Gemini, GitHub Copilot — making applications intelligent by design, not by accident.", color:"#a78bfa", icon:"🧱" },
  { year:"2025", title:"Python & Foundation",               why:"Wanted to understand how computers think — not just use them.",                                          what:"Learned Python from scratch, built logic, solved real problems, fell in love with clean purposeful code.",  color:"#34d399", icon:"☁️" },
  { year:"2025", title:"AWS & Devops",                 why:"Code that can't survive the real world is just a hobby. I needed production-grade systems.",              what:"AWS, Docker, CI/CD pipelines — turning code into reliable scalable infrastructure that never sleeps.", color:"#f472b6", icon:"🤖" },
  { year:"2026 →", title:"Machine Learning",            why:"I don't want to just use AI. I want to build it, understand it, and shape what it becomes.",              what:"Currently diving deep into ML — models, training, inference. The final layer of becoming a complete software engineer.",  color:"#fb923c", icon:"🧠", next:true },
];

function JourneySection() {
  const [active, setActive] = useState(null);
  return (
    <section id="journey" style={{ padding:"130px 6vw", borderTop:"1px solid rgba(255,255,255,0.04)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"30%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(251,146,60,0.04) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"10%", right:"-8%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,0.05) 0%,transparent 65%)", pointerEvents:"none" }} />

      <Reveal>
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:24 }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"rgba(240,236,227,0.22)", letterSpacing:4 }}>02</span>
          <span style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }} />
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,6vw,80px)", letterSpacing:3, color:"#f0ece3" }}>MY JOURNEY</h2>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div style={{ maxWidth:780, marginBottom:90 }}>
          <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(22px,3.2vw,42px)", lineHeight:1.2, letterSpacing:1, color:"rgba(240,236,227,0.88)", marginBottom:22 }}>
            "I didn't learn to code to get a job.{" "}
            <span style={{ color:"#00f5ff" }}>I learned to truly understand</span>{" "}
            how software works — every layer, every concept,{" "}
            every reason <span style={{ color:"#a78bfa" }}>why</span>."
          </p>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:15, color:"rgba(240,236,227,0.38)", lineHeight:1.9, maxWidth:560 }}>
            Every tool had a purpose. Every framework had a reason. The goal was never to collect skills — it was to become a developer who can{" "}
            <span style={{ color:"rgba(240,236,227,0.7)" }}>manage everything</span>, understand everything, and build anything.
          </p>
        </div>
      </Reveal>

      <div style={{ display:"flex", flexDirection:"column" }}>
        {JOURNEY.map((step, i) => (
          <Reveal key={step.year} delay={i * 0.1}>
            <div onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
              style={{ display:"grid", gridTemplateColumns:"140px 1px 1fr", alignItems:"stretch", cursor:"default" }}>

              {/* Year */}
              <div style={{ textAlign:"right", padding:"32px 40px 32px 0" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color:active===i ? step.color : "rgba(240,236,227,0.2)", letterSpacing:2, transition:"color 0.4s ease", lineHeight:1 }}>{step.year}</div>
                <div style={{ fontSize:20, marginTop:8, filter:active===i ? "none" : "grayscale(1) opacity(0.25)", transition:"filter 0.4s ease" }}>{step.icon}</div>
              </div>

              {/* Line + dot */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:1, flex:1, background:active===i ? step.color : "rgba(255,255,255,0.07)", transition:"background 0.4s ease" }} />
                <div style={{ width:12, height:12, borderRadius:"50%", background:active===i ? step.color : "rgba(255,255,255,0.15)", boxShadow:active===i ? `0 0 22px ${step.color}` : "none", transition:"all 0.4s ease", flexShrink:0 }} />
                <div style={{ width:1, flex:1, background:"rgba(255,255,255,0.07)" }} />
              </div>

              {/* Content */}
              <div style={{ padding:"32px 0 32px 40px", background:active===i ? `linear-gradient(90deg,${step.color}09,transparent)` : "transparent", transition:"background 0.5s ease" }}>
                {step.next && (
                  <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:step.color, letterSpacing:3, textTransform:"uppercase", background:`${step.color}14`, border:`1px solid ${step.color}33`, borderRadius:2, padding:"4px 12px", marginBottom:14 }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", background:step.color, animation:"statusPulse 1.5s ease infinite", display:"inline-block" }} />
                    Currently Learning
                  </div>
                )}
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(22px,2.5vw,36px)", letterSpacing:1, color:active===i ? "#f0ece3" : "rgba(240,236,227,0.6)", transition:"color 0.4s ease", marginBottom:12, lineHeight:1 }}>{step.title}</h3>
                <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:step.color, letterSpacing:1, marginBottom:10, opacity:active===i ? 1 : 0.45, transition:"opacity 0.4s ease" }}>
                  WHY → {step.why}
                </p>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:14, color:"rgba(240,236,227,0.42)", lineHeight:1.85, maxWidth:520, opacity:active===i ? 1 : 0, transform:active===i ? "translateY(0)" : "translateY(8px)", transition:"all 0.45s ease 0.05s" }}>
                  {step.what}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div style={{ marginTop:64, padding:"32px 36px", background:"rgba(255,255,255,0.015)", border:"1px solid rgba(255,255,255,0.06)", borderLeft:"3px solid #00f5ff", display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:12, color:"#00f5ff", letterSpacing:4, flexShrink:0 }}>The Vision</span>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:15, color:"rgba(240,236,227,0.5)", lineHeight:1.75, flex:1 }}>
            A software developer who doesn't just write code — but{" "}
            <span style={{ color:"#f0ece3", fontWeight:600 }}>manages everything</span>, from frontend to cloud to AI, with deep understanding of every concept underneath. That's the standard I hold myself to.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function Portfolio() {
  const [loaded, setLoaded]       = useState(false);
  const [wipeOn, setWipeOn]       = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [activeSec, setActiveSec] = useState("home");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [typeText, setTypeText]   = useState("");

  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const trailRef = useRef(null);
  const navRef   = useRef(null);
  const dotSlideRef = useRef(null);

  const winW = useWindowSize();
  const isMobile = winW < 900;

  const titles = ["AI-Powered Developer.","Python Full Stack Dev.","Cloud & DevOps Engineer.","AI Integration Specialist."];
  const tR = useRef(0), cR = useRef(0), dR = useRef(false);

  /* Typing */
  useEffect(() => {
    if (!loaded) return;
    const tick = () => {
      const cur = titles[tR.current];
      if (!dR.current) {
        setTypeText(cur.slice(0, cR.current + 1)); cR.current++;
        if (cR.current === cur.length) { dR.current = true; setTimeout(tick, 2400); return; }
      } else {
        setTypeText(cur.slice(0, cR.current - 1)); cR.current--;
        if (cR.current === 0) { dR.current = false; tR.current = (tR.current + 1) % titles.length; }
      }
      setTimeout(tick, dR.current ? 42 : 78);
    };
    const t = setTimeout(tick, 700);
    return () => clearTimeout(t);
  }, [loaded]);

  /* 3-layer lerp cursor — zero React re-renders */
  useEffect(() => {
    let mx=-200, my=-200, r1x=-200, r1y=-200, r2x=-200, r2y=-200;
    let raf;
    const move = (e) => { mx=e.clientX; my=e.clientY; };
    window.addEventListener("mousemove", move, { passive:true });
    const loop = () => {
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${mx-5}px,${my-5}px,0)`;
      r1x += (mx-r1x)*0.14; r1y += (my-r1y)*0.14;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${r1x-22}px,${r1y-22}px,0)`;
      r2x += (mx-r2x)*0.07; r2y += (my-r2y)*0.07;
      if (trailRef.current)
        trailRef.current.style.transform = `translate3d(${r2x-42}px,${r2y-42}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  /* Scroll + active section + nav dot */
  useEffect(() => {
    const NAV_IDS = ["about","journey","skills","projects","contact"];
    const fn = () => {
      setScrolled(window.scrollY > 80);
      let cur = "home";
      for (const id of ["about","journey","skills","projects","contact"]) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 220) cur = id;
      }
      setActiveSec(cur);

      /* slide nav dot */
      if (dotSlideRef.current && navRef.current) {
        const btnIdx = NAV_IDS.indexOf(cur);
        const btns   = navRef.current.querySelectorAll(".nb");
        if (btns[btnIdx]) {
          const r  = btns[btnIdx].getBoundingClientRect();
          const nr = navRef.current.getBoundingClientRect();
          dotSlideRef.current.style.transform = `translateX(${r.left - nr.left + r.width/2 - 3}px)`;
          dotSlideRef.current.style.opacity   = "1";
        } else {
          dotSlideRef.current.style.opacity = "0";
        }
      }
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Wipe navigation */
  const goto = useCallback((id) => {
    setWipeOn(true);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior:"instant" });
      setWipeOn(false);
    }, 420);
  }, []);

  if (!loaded) return <Loader onDone={() => setLoaded(true)} />;

  return (
    <div style={{ fontFamily:"'Syne',sans-serif", background:"#080808", color:"#f0ece3", minHeight:"100vh", overflowX:"hidden", cursor:"none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@300;400;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { background:#080808; overflow-x:hidden; }
        a, button { cursor:none !important; }
        @keyframes marqueeX  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(0,245,255,0.5)} 50%{box-shadow:0 0 0 7px rgba(0,245,255,0)} }
        @keyframes statusPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        @keyframes slideIn   { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:900px){
          .hflex{flex-direction:column!important;gap:36px!important;padding-top:80px!important}
          .hphoto{width:200px!important;height:250px!important;align-self:center}
          .agrid{grid-template-columns:1fr!important;gap:40px!important}
          .sgrid{grid-template-columns:1fr 1fr!important}
          .navlinks{display:none!important}
          .hireme{display:none!important}
        }
        @media(max-width:560px){.sgrid{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── Noise + Wipe ── */}
      <NoiseOverlay />
      <PageWipe active={wipeOn} />

      {/* ── 3-layer smooth cursor ── */}
      <div ref={dotRef}   style={{ position:"fixed",top:0,left:0,width:10,height:10,borderRadius:"50%",background:"#00f5ff",pointerEvents:"none",zIndex:9999,willChange:"transform",animation:"dotPulse 2.2s ease infinite" }} />
      <div ref={ringRef}  style={{ position:"fixed",top:0,left:0,width:44,height:44,borderRadius:"50%",border:"1.5px solid rgba(0,245,255,0.55)",pointerEvents:"none",zIndex:9998,willChange:"transform" }} />
      <div ref={trailRef} style={{ position:"fixed",top:0,left:0,width:84,height:84,borderRadius:"50%",border:"1px solid rgba(0,245,255,0.12)",pointerEvents:"none",zIndex:9997,willChange:"transform" }} />

      {/* ── NAV ── */}
      <nav ref={navRef} style={{ position:"fixed",top:0,left:0,right:0,zIndex:500,padding:"0 6vw",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(8,8,8,0.94)":"transparent",borderBottom:scrolled?"1px solid rgba(255,255,255,0.05)":"1px solid transparent",backdropFilter:scrolled?"blur(24px)":"none",transition:"all 0.5s ease" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:4,color:"#f0ece3" }}>
            ADJ<span style={{ color:"#00f5ff" }}>.</span>DEV
          </div>
          {/* Available badge */}
          <div style={{ display:"flex",alignItems:"center",gap:7,background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:20,padding:"4px 12px",animation:"slideIn 0.6s ease 1.2s both" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#34d399",display:"inline-block",animation:"statusPulse 2s ease infinite" }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#34d399",letterSpacing:2,textTransform:"uppercase" }}>Available</span>
          </div>
        </div>

        <div className="navlinks" style={{ display:"flex",gap:36,alignItems:"center",position:"relative" }}>
          {[["about","About"],["journey","Journey"],["skills","Skills"],["projects","Projects"],["contact","Contact"]].map(([id,label]) => (
            <button key={id} className="nb" onClick={() => goto(id)} style={{ background:"none",border:"none",fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:600,letterSpacing:3,textTransform:"uppercase",color:activeSec===id?"#00f5ff":"rgba(240,236,227,0.4)",transition:"color 0.3s ease",paddingBottom:8 }}>
              {label}
            </button>
          ))}
          {/* Glowing sliding nav dot */}
          <div ref={dotSlideRef} style={{ position:"absolute",bottom:0,left:0,width:6,height:6,borderRadius:"50%",background:"#00f5ff",boxShadow:"0 0 10px #00f5ff",transition:"transform 0.5s cubic-bezier(.16,1,.3,1), opacity 0.3s ease",opacity:0,pointerEvents:"none" }} />
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:16 }}>
          <a href="mailto:abidavidjames739@email.com" className="hireme" style={{ textDecoration:"none",fontFamily:"monospace",fontSize:11,letterSpacing:2,color:"#f0ece3",border:"1px solid rgba(255,255,255,0.15)",borderRadius:2,padding:"8px 20px",transition:"all 0.3s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#00f5ff";e.currentTarget.style.color="#00f5ff";e.currentTarget.style.boxShadow="0 0 20px rgba(0,245,255,0.15)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";e.currentTarget.style.color="#f0ece3";e.currentTarget.style.boxShadow="none";}}>
            HIRE ME
          </a>
          {isMobile && (
            <button onClick={() => setMenuOpen(true)} style={{ background:"none",border:"1px solid rgba(255,255,255,0.15)",borderRadius:2,padding:"8px 12px",display:"flex",flexDirection:"column",gap:5,cursor:"pointer" }}>
              {[0,1,2].map(i=><span key={i} style={{ display:"block",width:20,height:1.5,background:"#f0ece3",borderRadius:1 }} />)}
            </button>
          )}
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} goto={goto} />

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight:"100vh",padding:"0 6vw",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",backgroundSize:"80px 80px",pointerEvents:"none",opacity:0.6 }} />
        <div style={{ position:"absolute",top:"-15%",right:"-8%",width:560,height:560,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,245,255,0.055) 0%,transparent 65%)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:"-8%",left:"-4%",width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,0.065) 0%,transparent 65%)",pointerEvents:"none" }} />

        <div className="hflex" style={{ display:"flex",alignItems:"center",gap:"7vw",zIndex:1,paddingTop:68 }}>
          {/* TEXT */}
          <div style={{ flex:1,animation:"fadeUp 1s ease 0.3s both" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#00f5ff",letterSpacing:5,textTransform:"uppercase",marginBottom:26,display:"flex",alignItems:"center",gap:14 }}>
              <span style={{ display:"inline-block",width:32,height:1,background:"#00f5ff" }} />
              Portfolio 
            </div>

            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(64px,10vw,148px)",lineHeight:0.88,letterSpacing:2,marginBottom:12 }}>
              <span style={{ display:"block",color:"rgba(240,236,227,0.18)" }}>ABI</span>
              <span style={{ display:"block",color:"rgba(240,236,227,0.58)" }}>DAVID</span>
              <span style={{ display:"block",WebkitTextStroke:"1px #f0ece3",WebkitTextFillColor:"transparent" }}>JAMES</span>
            </h1>

            <div style={{ marginTop:30,marginBottom:38,fontFamily:"'Syne',sans-serif",fontSize:"clamp(14px,1.8vw,20px)",color:"rgba(240,236,227,0.42)",minHeight:30,display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ color:"#00f5ff",fontFamily:"monospace" }}>→</span>
              <span>{typeText}</span>
              <span style={{ display:"inline-block",width:2,height:"1.1em",background:"#00f5ff",animation:"blink 1s step-end infinite",verticalAlign:"text-bottom" }} />
            </div>

            <div style={{ display:"flex",gap:14,flexWrap:"wrap" }}>
              <MagBtn primary onClick={() => goto("projects")}>View Work</MagBtn>
              <MagBtn onClick={() => goto("about")}>About Me</MagBtn>
            </div>

            <div style={{ display:"flex",gap:52,marginTop:62 }}>
              <StatCounter num="5+" label="Stacks Mastered" />
              <StatCounter num="10+" label="Projects Built" />
              <StatCounter num="3+" label="AI Integrations" />
            </div>
          </div>

          {/* PHOTO */}
          <div className="hphoto" style={{ position:"relative",width:320,height:400,flexShrink:0,animation:"fadeUp 1s ease 0.5s both" }}>
            <div style={{ position:"absolute",inset:-22,borderRadius:"50% 40% 60% 50% / 50% 60% 40% 50%",border:"1px dashed rgba(0,245,255,0.14)",animation:"rotate360 22s linear infinite",pointerEvents:"none" }} />
            <div style={{ position:"absolute",inset:-44,borderRadius:"60% 50% 40% 50% / 40% 50% 60% 50%",border:"1px dashed rgba(167,139,250,0.09)",animation:"rotate360 34s linear infinite reverse",pointerEvents:"none" }} />
            {[{top:0,left:0},{top:0,right:0},{bottom:0,left:0},{bottom:0,right:0}].map((pos,i) => (
              <div key={i} style={{ position:"absolute",...pos,width:22,height:22,borderTop:i<2?"1px solid rgba(0,245,255,0.7)":undefined,borderBottom:i>=2?"1px solid rgba(0,245,255,0.7)":undefined,borderLeft:i%2===0?"1px solid rgba(0,245,255,0.7)":undefined,borderRight:i%2!==0?"1px solid rgba(0,245,255,0.7)":undefined,zIndex:2 }} />
            ))}
            <div style={{ width:"100%",height:"100%",overflow:"hidden",borderRadius:4,background:"linear-gradient(160deg,#0f172a,#1e1b4b)" }}>
              <img src="https://i.ibb.co/qFrhG7qp/IMG-3859.jpg" style={{ width:"100%",height:"100%",objectFit:"cover" }} alt="Abi David James" />
            </div>
            <div style={{ position:"absolute",bottom:-14,right:-14,background:"#080808",border:"1px solid rgba(0,245,255,0.3)",padding:"10px 18px",borderRadius:2,zIndex:3 }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#00f5ff",letterSpacing:3,textTransform:"uppercase",display:"flex",alignItems:"center",gap:6 }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",animation:"statusPulse 1.8s ease infinite",display:"inline-block" }} />
                Available
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:"#f0ece3",letterSpacing:2,marginTop:2 }}>FOR HIRE</div>
            </div>
          </div>
        </div>

        <div style={{ position:"absolute",bottom:36,left:"6vw",display:"flex",alignItems:"center",gap:16,animation:"fadeUp 1s ease 1.3s both" }}>
          <div style={{ width:1,height:48,background:"linear-gradient(transparent,rgba(0,245,255,0.4))" }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(240,236,227,0.28)",letterSpacing:3,textTransform:"uppercase" }}>Scroll down</span>
        </div>
      </section>

      <Marquee />

      {/* ── JOURNEY ── */}
      <JourneySection />

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding:"130px 6vw",position:"relative" }}>
        <Reveal>
          <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:70 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(240,236,227,0.22)",letterSpacing:4 }}>03</span>
            <span style={{ flex:1,height:1,background:"rgba(255,255,255,0.05)" }} />
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(40px,6vw,80px)",letterSpacing:3,color:"#f0ece3" }}>ABOUT ME</h2>
          </div>
        </Reveal>
        <div className="agrid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8vw",alignItems:"start" }}>
          <Reveal delay={0.1}>
            <p style={{ fontSize:16,lineHeight:2,color:"rgba(240,236,227,0.52)",marginBottom:26 }}>
              I'm an <span style={{ color:"#f0ece3",fontWeight:700 }}>AI-Powered Python Full Stack Developer</span> with hands-on experience in building scalable web applications. I specialize in designing REST APIs, integrating frontend and backend systems, and managing diverse databases.
            </p>
            <p style={{ fontSize:16,lineHeight:2,color:"rgba(240,236,227,0.52)",marginBottom:26 }}>
              Experienced in <span style={{ color:"#a78bfa",fontWeight:600 }}>AWS cloud services</span> and DevOps practices, including Docker and CI/CD pipelines. Proficient in leveraging AI tools and prompt engineering to automate workflows.
            </p>
            <p style={{ fontSize:16,lineHeight:2,color:"rgba(240,236,227,0.52)",marginBottom:40 }}>
              Strong focus on <span style={{ color:"#34d399",fontWeight:600 }}>performance, scalability, and clean code</span>.
            </p>
            <div style={{ display:"flex",gap:18,flexWrap:"wrap" }}>
              {[{icon:"↗",label:"GitHub",href:"https://github.com/adj2425",color:"#a78bfa"},{icon:"↗",label:"LinkedIn",href:"https://www.linkedin.com/in/abi-david-james-242506jan132304/",color:"#34d399"},{icon:"✉",label:"Email",href:"mailto:abidavidjames739@email.com",color:"#00f5ff"}].map(l=>(
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:7,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:l.color,letterSpacing:2,borderBottom:`1px solid ${l.color}44`,paddingBottom:3,transition:"all 0.3s ease" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderBottomColor=l.color;e.currentTarget.style.gap="12px";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderBottomColor=`${l.color}44`;e.currentTarget.style.gap="7px";}}>
                  {l.label} {l.icon}
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(240,236,227,0.22)",letterSpacing:3,textTransform:"uppercase",marginBottom:26 }}>Soft Skills</div>
            {[["Communication & Teamwork","#00f5ff"],["Problem Solving","#a78bfa"],["Time Management","#34d399"],["Adaptability","#fb923c"],["Self-Learning & Consistency","#f472b6"]].map(([s,c],i)=>(
              <Reveal key={s} delay={0.04*i}>
                <div style={{ display:"flex",alignItems:"center",gap:16,padding:"17px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"rgba(240,236,227,0.68)",fontSize:15,fontFamily:"'Syne',sans-serif",transition:"color 0.3s ease" }}
                  onMouseEnter={e=>{e.currentTarget.style.color="#f0ece3";}}
                  onMouseLeave={e=>{e.currentTarget.style.color="rgba(240,236,227,0.68)";}}>
                  <span style={{ width:7,height:7,borderRadius:"50%",background:c,boxShadow:`0 0 14px ${c}`,flexShrink:0 }} />
                  {s}
                </div>
              </Reveal>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding:"130px 6vw",borderTop:"1px solid rgba(255,255,255,0.04)",position:"relative" }}>
        <Reveal>
          <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:70 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(240,236,227,0.22)",letterSpacing:4 }}>04</span>
            <span style={{ flex:1,height:1,background:"rgba(255,255,255,0.05)" }} />
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(40px,6vw,80px)",letterSpacing:3,color:"#f0ece3" }}>SKILLS</h2>
          </div>
        </Reveal>
        <div className="sgrid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"2px" }}>
          {SKILL_GROUPS.map((g,i)=><SkillCard key={g.label} group={g} delay={i*0.08} />)}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding:"130px 6vw",borderTop:"1px solid rgba(255,255,255,0.04)",position:"relative" }}>
        <Reveal>
          <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:70 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(240,236,227,0.22)",letterSpacing:4 }}>05</span>
            <span style={{ flex:1,height:1,background:"rgba(255,255,255,0.05)" }} />
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(40px,6vw,80px)",letterSpacing:3,color:"#f0ece3" }}>PROJECTS</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ProjectsHScroll />
        </Reveal>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:"130px 6vw 0",borderTop:"1px solid rgba(255,255,255,0.04)",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"10%",right:"-5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,245,255,0.038) 0%,transparent 60%)",pointerEvents:"none" }} />
        <Reveal>
          <div style={{ display:"flex",alignItems:"center",gap:20,marginBottom:80 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(240,236,227,0.22)",letterSpacing:4 }}>06</span>
            <span style={{ flex:1,height:1,background:"rgba(255,255,255,0.05)" }} />
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(40px,6vw,80px)",letterSpacing:3,color:"#f0ece3" }}>CONTACT</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,8vw,110px)",lineHeight:0.9,letterSpacing:2,marginBottom:40 }}>
            LET'S BUILD<br />
            <span style={{ WebkitTextStroke:"1px rgba(240,236,227,0.28)",WebkitTextFillColor:"transparent" }}>TOGETHER.</span>
          </h3>
          <p style={{ fontSize:16,color:"rgba(240,236,227,0.42)",lineHeight:1.85,maxWidth:480,marginBottom:56 }}>
            Open to exciting projects, collaborations, and opportunities. Ready to bring your ideas to life with AI-powered engineering.
          </p>
          <MagBtn primary onClick={() => window.location.href="mailto:abidavidjames739@email.com"} style={{ marginBottom:72 }}>
            Send Me a Message ✉
          </MagBtn>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display:"flex",gap:2,flexWrap:"wrap",marginBottom:0 }}>
            {[{label:"Email Me",sub:"abidavidjames739@email.com",href:"mailto:abidavidjames739@email.com",color:"#00f5ff",icon:"✉"},{label:"GitHub",sub:"github.com/adj2425",href:"https://github.com/adj2425",color:"#a78bfa",icon:"⌥"},{label:"LinkedIn",sub:"Connect with me",href:"https://www.linkedin.com/in/abi-david-james-242506jan132304/",color:"#34d399",icon:"◈"}].map(c=>(
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none",flex:"1 1 220px",padding:"34px 28px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",transition:"all 0.38s cubic-bezier(.16,1,.3,1)",display:"block" }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${c.color}0d`;e.currentTarget.style.borderColor=`${c.color}33`;e.currentTarget.style.transform="translateY(-6px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor="rgba(255,255,255,0.05)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{ fontSize:22,marginBottom:16,color:c.color }}>{c.icon}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:c.color,letterSpacing:4,textTransform:"uppercase",marginBottom:10 }}>{c.label}</div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:13,color:"rgba(240,236,227,0.45)",marginBottom:24 }}>{c.sub}</div>
                <div style={{ fontSize:18,color:c.color }}>↗</div>
              </a>
            ))}
          </div>
        </Reveal>

        {/* FOOTER */}
        <div style={{ marginTop:0,padding:"40px 0",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:4,color:"rgba(240,236,227,0.55)" }}>
            ADJ<span style={{ color:"#00f5ff" }}>.</span>DEV
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#34d399",animation:"statusPulse 2s ease infinite",display:"inline-block" }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(240,236,227,0.25)",letterSpacing:2,textTransform:"uppercase" }}>Open to work </span>
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(240,236,227,0.18)",letterSpacing:2,textTransform:"uppercase" }}>
            © ABI DAVID JAMES — CRAFTED WITH PRECISION & AI
          </div>
        </div>
      </section>
      <style>{`@keyframes rotate360{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
