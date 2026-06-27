import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, API_URL } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ─── Tokens ──────────────────────────────────────────────────────────────── */
const T = {
  bg:         '#060d1a',
  surface:    'rgba(255,255,255,0.05)',
  surfaceHov: 'rgba(255,255,255,0.09)',
  border:     'rgba(255,255,255,0.10)',
  borderHov:  'rgba(34,211,238,0.35)',
  text:       '#f1f5f9',
  muted:      '#64748b',
  teal:       '#0891b2',
  cyan:       '#22d3ee',
  glow:       'rgba(8,145,178,0.25)',
};

/* ─── Animated counter ────────────────────────────────────────────────────── */
function useCounter(target, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => {
      let cur = 0;
      const step = target / 50;
      const id = setInterval(() => {
        cur = Math.min(cur + step, target);
        setVal(Math.round(cur));
        if (cur >= target) clearInterval(id);
      }, 18);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

/* ─── Progress ring ───────────────────────────────────────────────────────── */
function Ring({ value, max, color, size = 72, sw = 6, label }) {
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const done = value >= max && max > 0;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={sw} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={done ? '#22c55e' : color} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - pct) }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${done ? '#22c55e' : color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {done
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            : <>
                <span className="text-xs font-bold tabular-nums" style={{ color: T.text }}>{value}</span>
                <span className="text-[9px]" style={{ color: T.muted }}>/{max}</span>
              </>
          }
        </div>
      </div>
      <span className="text-[11px] font-medium" style={{ color: T.muted }}>{label}</span>
    </div>
  );
}

/* ─── Glass card wrapper ──────────────────────────────────────────────────── */
function Glass({ children, className = '', style = {}, hover = false, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { borderColor: T.borderHov, backgroundColor: T.surfaceHov } : undefined}
      transition={{ duration: 0.2 }}
      className={className}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 20,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── SVG Icons ───────────────────────────────────────────────────────────── */
const Ic = {
  quiz:    (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill={c}/></svg>,
  flash:   (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>,
  exo:     (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
  star:    (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  book:    (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  annale:  (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
  pill:    (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/><circle cx="17" cy="17" r="5"/><path d="m14.5 19.5 5-5"/></svg>,
  group:   (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  card:    (c='currentColor') => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  fire:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#f97316"><path d="M12 2c0 0-4 5.5-4 9.5a4 4 0 0 0 8 0C16 7.5 12 2 12 2z"/><path d="M12 13c0 0-1.5 1.5-1.5 3a1.5 1.5 0 0 0 3 0C13.5 14.5 12 13 12 13z" fill="#fde68a"/></svg>,
  chevron: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  edit:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  close:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  bulb:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6H8.3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/></svg>,
};

const TIPS = [
  "La répétition espacée augmente la mémorisation de 200 %. Révise tes flashcards chaque jour, même 5 minutes.",
  "Avant une garde, relis les valeurs normales des constantes vitales : elles reviennent souvent aux examens.",
  "Les cas cliniques IFSI testent ton raisonnement clinique. Explique toujours ton pourquoi.",
  "Groupe tes révisions par UE : la cohérence thématique ancre mieux les notions dans ta mémoire.",
];

const ease = [0.16, 1, 0.3, 1];

/* ════════════════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user, token, refreshUser } = useAuth();
  const p = user?.progress || {};

  const [greeting,      setGreeting]      = useState('');
  const [streak,        setStreak]        = useState(p.streak || 0);
  const [weeklyData,    setWeeklyData]    = useState([0,0,0,0,0,0,0]);
  const [tipIdx,        setTipIdx]        = useState(0);
  const [dailyGoals,    setDailyGoals]    = useState({ quizPerDay: 5, flashcardsPerDay: 20, exercisesPerDay: 3 });
  const [dailyProgress, setDailyProgress] = useState({ quiz: 0, flashcards: 0, exercises: 0 });
  const [showModal,     setShowModal]     = useState(false);
  const [editGoals,     setEditGoals]     = useState({ quizPerDay: 5, flashcardsPerDay: 20, exercisesPerDay: 3 });
  const [saving,        setSaving]        = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 6 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir');
  }, []);

  useEffect(() => {
    if (!token) return;
    axios.post(`${API_URL}/auth/ping`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (typeof res.data.streak === 'number') setStreak(res.data.streak);
        if (Array.isArray(res.data.weeklyActivity)) setWeeklyData(res.data.weeklyActivity);
        refreshUser();
      }).catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/auth/daily`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setDailyGoals(res.data.goals); setDailyProgress(res.data.daily); setEditGoals(res.data.goals); })
      .catch(() => {});
  }, [token]); // eslint-disable-line

  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(id);
  }, []);

  const quizVal  = useCounter(p.quizCompleted       || 0,  60);
  const flashVal = useCounter(p.flashcardsReviewed  || 0, 120);
  const exercVal = useCounter(p.exercisesCompleted  || 0, 180);
  const scoreVal = useCounter(p.totalScore          || 0, 240);

  const SUB = {
    free:    { label: 'Gratuit', style: { background: 'rgba(255,255,255,0.08)', color: T.muted } },
    pro:     { label: 'Pro',     style: { background: 'rgba(8,145,178,0.25)', color: T.cyan, border: `1px solid rgba(34,211,238,0.3)` } },
    premium: { label: 'Elite',   style: { background: 'linear-gradient(135deg,rgba(217,119,6,0.3),rgba(234,88,12,0.3))', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' } },
  };
  const sub = SUB[user?.subscription] || SUB.free;

  const todayFull = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const today = todayFull.charAt(0).toUpperCase() + todayFull.slice(1);

  const STATS = [
    { label: 'Quiz complétés',    val: quizVal,  color: '#0891b2', icon: Ic.quiz('#0891b2') },
    { label: 'Flashcards',        val: flashVal, color: '#7c3aed', icon: Ic.flash('#7c3aed') },
    { label: 'Exercices',         val: exercVal, color: '#0d9488', icon: Ic.exo('#0d9488') },
    { label: 'Points gagnés',     val: scoreVal, color: '#d97706', icon: Ic.star('#d97706') },
  ];

  const RINGS = [
    { label: 'Quiz',       value: Math.min(dailyProgress.quiz, dailyGoals.quizPerDay),             max: dailyGoals.quizPerDay,       color: '#0891b2' },
    { label: 'Flashcards', value: Math.min(dailyProgress.flashcards, dailyGoals.flashcardsPerDay), max: dailyGoals.flashcardsPerDay, color: '#7c3aed' },
    { label: 'Exercices',  value: Math.min(dailyProgress.exercises, dailyGoals.exercisesPerDay),   max: dailyGoals.exercisesPerDay,  color: '#0d9488' },
  ];

  const ACTIONS = [
    { to: '/dashboard/quiz',         label: 'Quiz',        icon: Ic.quiz,   color: '#0284c7', glow: 'rgba(2,132,199,0.3)' },
    { to: '/dashboard/flashcards',   label: 'Flashcards',  icon: Ic.flash,  color: '#7c3aed', glow: 'rgba(124,58,237,0.3)' },
    { to: '/dashboard/exercises',    label: 'Exercices',   icon: Ic.exo,    color: '#0d9488', glow: 'rgba(13,148,136,0.3)' },
    { to: '/dashboard/cours',        label: 'Cours',       icon: Ic.book,   color: '#16a34a', glow: 'rgba(22,163,74,0.3)' },
    { to: '/dashboard/annales',      label: 'Annales',     icon: Ic.annale, color: '#4338ca', glow: 'rgba(67,56,202,0.3)' },
    { to: '/dashboard/medicaments',  label: 'Médicaments', icon: Ic.pill,   color: '#dc2626', glow: 'rgba(220,38,38,0.3)' },
    { to: '/dashboard/groups',       label: 'Groupes',     icon: Ic.group,  color: '#d97706', glow: 'rgba(217,119,6,0.3)' },
    { to: '/dashboard/subscription', label: 'Abonnement',  icon: Ic.card,   color: '#db2777', glow: 'rgba(219,39,119,0.3)' },
  ];

  async function saveGoals() {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/auth/goals`, editGoals, { headers: { Authorization: `Bearer ${token}` } });
      setDailyGoals({ ...editGoals });
      setShowModal(false);
    } catch { /* silent */ }
    finally { setSaving(false); }
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-24px,18px) scale(1.07)} 70%{transform:translate(16px,-20px) scale(0.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-14px) scale(1.05)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-12px,24px)} 66%{transform:translate(18px,8px)} }
      `}</style>

      <main className="flex-1 overflow-y-auto relative" style={{ background: T.bg }}>

        {/* ── Ambient blobs ──────────────────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden style={{ zIndex: 0 }}>
          <div style={{ position:'absolute', width:600, height:600, top:-150, right:-100, borderRadius:'50%', background:'radial-gradient(circle,rgba(8,145,178,0.12),transparent 70%)', filter:'blur(40px)', animation:'blob1 18s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', width:400, height:400, bottom:50, left:-80, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.08),transparent 70%)', filter:'blur(40px)', animation:'blob2 22s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', width:300, height:300, top:'40%', left:'35%', borderRadius:'50%', background:'radial-gradient(circle,rgba(34,211,238,0.05),transparent 70%)', filter:'blur(50px)', animation:'blob3 26s ease-in-out infinite' }}/>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6" style={{ zIndex: 1 }}>

          {/* ── HERO BANNER ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Glass style={{ padding: '28px 32px', borderRadius: 24, position: 'relative', overflow: 'hidden' }}>
              {/* Subtle teal glow top-left */}
              <div style={{ position:'absolute', top:-40, left:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,211,238,0.12),transparent)', pointerEvents:'none' }} aria-hidden/>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: 11, color: T.muted, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{today}</span>
                  </div>
                  <h1 style={{ fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1.2, marginBottom: 4 }}>
                    {greeting},{' '}
                    <span style={{ background: `linear-gradient(135deg, ${T.cyan}, ${T.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {user?.name?.split(' ')[0] || 'Étudiant'}
                    </span>
                  </h1>
                  <p style={{ fontSize: 13, color: T.muted }}>Prêt à réviser ? Tes objectifs t'attendent.</p>
                </div>

                {/* Right: badge + streak */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Streak pill */}
                  <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(249,115,22,0.12)', border:'1px solid rgba(249,115,22,0.25)', borderRadius:999, padding:'6px 14px' }}>
                    {Ic.fire()}
                    <span style={{ fontSize:13, fontWeight:700, color:'#fb923c' }}>{streak}</span>
                    <span style={{ fontSize:11, color:'rgba(249,115,22,0.7)' }}>jours</span>
                  </div>
                  {/* Sub badge */}
                  <span style={{ fontSize:11, fontWeight:600, padding:'6px 14px', borderRadius:999, ...sub.style }}>
                    {sub.label}
                  </span>
                </div>
              </div>

              {/* Weekly activity mini bars */}
              <div className="flex items-end gap-1.5 mt-5" style={{ height: 36 }}>
                {['L','M','M','J','V','S','D'].map((day, i) => {
                  const maxV = Math.max(...weeklyData, 1);
                  const h = Math.round((weeklyData[i] / maxV) * 100);
                  const isToday = i === (new Date().getDay() + 6) % 7;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <motion.div
                        style={{ width:'100%', borderRadius:4, minHeight:3, backgroundColor: isToday ? T.cyan : 'rgba(255,255,255,0.08)' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(h, 5)}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease }}
                        title={`${weeklyData[i]} activités`}
                      />
                      <span style={{ fontSize:9, color: isToday ? T.cyan : T.muted, fontWeight: isToday ? 700 : 400 }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </Glass>
          </motion.div>

          {/* ── STAT CHIPS ──────────────────────────────────────────────── */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.07, delayChildren:0.15 } } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {STATS.map((s, i) => (
              <motion.div key={i} variants={{ hidden:{ opacity:0, y:16 }, show:{ opacity:1, y:0, transition:{ duration:0.4, ease } } }}>
                <Glass hover className="p-5 cursor-default h-full" style={{ borderRadius:16 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`rgba(${s.color === '#0891b2' ? '8,145,178' : s.color === '#7c3aed' ? '124,58,237' : s.color === '#0d9488' ? '13,148,136' : '217,119,6'},0.15)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {s.icon}
                    </div>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:s.color, boxShadow:`0 0 8px ${s.color}` }}/>
                  </div>
                  <p style={{ fontSize:26, fontWeight:700, color:T.text, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{s.val}</p>
                  <p style={{ fontSize:11, color:T.muted, marginTop:4, fontWeight:500 }}>{s.label}</p>
                </Glass>
              </motion.div>
            ))}
          </motion.div>

          {/* ── MAIN GRID ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left — 2/3 */}
            <div className="lg:col-span-2 space-y-5">

              {/* Daily objectives */}
              <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25, duration:0.45, ease }}>
                <Glass style={{ padding:'24px 28px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:T.text }}>Objectifs du jour</p>
                      <p style={{ fontSize:11, color:T.muted, marginTop:2 }}>Tes cibles quotidiennes</p>
                    </div>
                    <button
                      onClick={() => { setEditGoals({ ...dailyGoals }); setShowModal(true); }}
                      style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.06)', border:`1px solid ${T.border}`, borderRadius:10, padding:'6px 12px', cursor:'pointer', color:T.muted, fontSize:11, fontWeight:500 }}
                      aria-label="Modifier les objectifs"
                    >
                      {Ic.edit()}
                      Modifier
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {RINGS.map((rg, i) => <Ring key={i} {...rg} />)}
                  </div>
                </Glass>
              </motion.div>

              {/* Quick actions */}
              <div>
                <p style={{ fontSize:10, fontWeight:700, color:T.muted, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>Accès rapide</p>
                <motion.div
                  initial="hidden" animate="show"
                  variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.05, delayChildren:0.2 } } }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {ACTIONS.map((a, i) => (
                    <motion.div key={i} variants={{ hidden:{ opacity:0, y:14 }, show:{ opacity:1, y:0, transition:{ duration:0.35, ease } } }}>
                      <Link to={a.to} className="block" style={{ textDecoration:'none' }}>
                        <motion.div
                          whileHover={{ backgroundColor: T.surfaceHov, borderColor: a.color + '50', y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                          style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius:16, padding:'18px 16px', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', cursor:'pointer' }}
                        >
                          {/* Icon with glow */}
                          <div style={{ width:40, height:40, borderRadius:12, background:`rgba(${a.color === '#0284c7' ? '2,132,199' : a.color === '#7c3aed' ? '124,58,237' : a.color === '#0d9488' ? '13,148,136' : a.color === '#16a34a' ? '22,163,74' : a.color === '#4338ca' ? '67,56,202' : a.color === '#dc2626' ? '220,38,38' : a.color === '#d97706' ? '217,119,6' : '219,39,119'},0.18)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, boxShadow:`0 0 14px ${a.glow}` }}>
                            {a.icon(a.color)}
                          </div>
                          <p style={{ fontSize:12, fontWeight:600, color:T.text, marginBottom:2 }}>{a.label}</p>
                          <div style={{ display:'flex', alignItems:'center', gap:2, color:T.muted, marginTop:6 }}>
                            <span style={{ fontSize:10 }}>Ouvrir</span>
                            {Ic.chevron()}
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Right — 1/3 */}
            <motion.div
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.3, duration:0.45, ease }}
              className="space-y-4"
            >

              {/* Streak detail card */}
              <Glass style={{ padding:'24px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle,rgba(251,146,60,0.15),transparent)', pointerEvents:'none' }} aria-hidden/>
                <div style={{ position:'relative' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                    {Ic.fire()}
                    <span style={{ fontSize:12, fontWeight:600, color:'#fb923c' }}>Série de connexion</span>
                  </div>
                  <motion.p
                    style={{ fontSize:52, fontWeight:800, color:T.text, lineHeight:1, fontVariantNumeric:'tabular-nums' }}
                    initial={{ scale:0.5, opacity:0 }}
                    animate={{ scale:1, opacity:1 }}
                    transition={{ delay:0.5, type:'spring', stiffness:220, damping:18 }}
                  >
                    {streak}
                  </motion.p>
                  <p style={{ fontSize:12, color:T.muted, marginTop:4 }}>
                    {streak === 0 ? 'Reviens demain pour démarrer !' : `jour${streak > 1 ? 's' : ''} consécutif${streak > 1 ? 's' : ''}`}
                  </p>

                  {/* 7-dot progress */}
                  <div style={{ display:'flex', gap:6, marginTop:16 }}>
                    {Array.from({ length:7 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY:0 }}
                        animate={{ scaleY:1 }}
                        transition={{ delay:0.55 + i*0.05, type:'spring' }}
                        style={{ flex:1, height:4, borderRadius:2, originY:'bottom', backgroundColor: i < streak ? '#f97316' : 'rgba(255,255,255,0.10)' }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize:9, color:'rgba(249,115,22,0.4)', marginTop:6 }}>objectif 7 jours</p>
                </div>
              </Glass>

              {/* Tip of the day */}
              <Glass style={{ padding:'20px 22px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:'rgba(245,158,11,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {Ic.bulb()}
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, color:T.text }}>Conseil du jour</span>
                  <span style={{ marginLeft:'auto', fontSize:10, color:T.muted, fontVariantNumeric:'tabular-nums' }}>{tipIdx+1}/{TIPS.length}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIdx}
                    initial={{ opacity:0, y:6 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-6 }}
                    transition={{ duration:0.25 }}
                    style={{ fontSize:12, color:T.muted, lineHeight:1.7 }}
                  >
                    {TIPS[tipIdx]}
                  </motion.p>
                </AnimatePresence>
                <div style={{ display:'flex', gap:5, marginTop:14 }}>
                  {TIPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTipIdx(i)}
                      aria-label={`Conseil ${i+1}`}
                      style={{ height:3, borderRadius:2, border:'none', cursor:'pointer', transition:'all 0.2s', backgroundColor: i === tipIdx ? '#f59e0b' : 'rgba(255,255,255,0.12)', width: i === tipIdx ? 20 : 6 }}
                    />
                  ))}
                </div>
              </Glass>

              {/* Upgrade nudge — free only */}
              {user?.subscription === 'free' && (
                <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.4 }}>
                  <Glass style={{ padding:'20px 22px', borderColor:'rgba(8,145,178,0.2)', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(8,145,178,0.06),rgba(124,58,237,0.06))', pointerEvents:'none' }} aria-hidden/>
                    <div style={{ position:'relative' }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${T.teal},${T.cyan})`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, boxShadow:`0 4px 16px ${T.glow}` }}>
                        {Ic.star('#fff')}
                      </div>
                      <p style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:6 }}>Passe en Pro</p>
                      <p style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:14 }}>
                        Quiz illimités, fiches IA, flashcards sans limite.
                      </p>
                      <Link to="/dashboard/subscription" style={{ textDecoration:'none' }}>
                        <motion.div
                          whileHover={{ opacity:0.9 }}
                          whileTap={{ scale:0.97 }}
                          style={{ background:`linear-gradient(135deg,${T.teal},${T.cyan})`, borderRadius:12, padding:'10px 0', textAlign:'center', fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer', boxShadow:`0 4px 20px ${T.glow}` }}
                        >
                          Voir les offres →
                        </motion.div>
                      </Link>
                    </div>
                  </Glass>
                </motion.div>
              )}

            </motion.div>
          </div>
        </div>
      </main>

      {/* ── Goals Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal-bg"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.2 }}
            onClick={() => setShowModal(false)}
            style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(6,13,26,0.75)', backdropFilter:'blur(8px)' }}
          >
            <motion.div
              key="modal"
              initial={{ opacity:0, scale:0.93, y:16 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.93, y:16 }}
              transition={{ type:'spring', stiffness:280, damping:26 }}
              onClick={e => e.stopPropagation()}
              style={{ background:'#0e1826', border:`1px solid ${T.border}`, borderRadius:24, padding:28, width:'100%', maxWidth:380, boxShadow:'0 32px 64px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                <p style={{ fontSize:14, fontWeight:700, color:T.text }}>Modifier mes objectifs</p>
                <button onClick={() => setShowModal(false)} style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.06)', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }} aria-label="Fermer">
                  {Ic.close()}
                </button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { key:'quizPerDay',       label:'Quiz par jour',       icon:Ic.quiz('#0891b2'),   color:'#0891b2', min:1, max:500 },
                  { key:'flashcardsPerDay', label:'Flashcards par jour', icon:Ic.flash('#7c3aed'),  color:'#7c3aed', min:1, max:999 },
                  { key:'exercisesPerDay',  label:'Exercices par jour',  icon:Ic.exo('#0d9488'),    color:'#0d9488', min:1, max:200 },
                ].map(({ key, label, icon, color, min, max }) => (
                  <div key={key} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.04)', border:`1px solid ${T.border}`, borderRadius:14, padding:'12px 16px' }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:`rgba(${color === '#0891b2' ? '8,145,178' : color === '#7c3aed' ? '124,58,237' : '13,148,136'},0.15)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
                    <span style={{ fontSize:12, fontWeight:500, color:T.text, flex:1 }}>{label}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <button type="button" onClick={() => setEditGoals(g => ({ ...g, [key]: Math.max(min, g[key]-1) }))}
                        style={{ width:30, height:30, borderRadius:8, background:'rgba(255,255,255,0.06)', border:`1px solid ${T.border}`, color:T.muted, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }} aria-label="Diminuer">−</button>
                      <input type="number" min={min} max={max} value={editGoals[key]}
                        onChange={e => { const v = Math.max(min, Math.min(max, parseInt(e.target.value)||min)); setEditGoals(g => ({ ...g, [key]:v })); }}
                        style={{ width:52, textAlign:'center', fontSize:13, fontWeight:700, color, background:'transparent', border:`2px solid ${color}40`, borderRadius:8, padding:'4px 0', outline:'none' }}
                        aria-label={label}
                      />
                      <button type="button" onClick={() => setEditGoals(g => ({ ...g, [key]: Math.min(max, g[key]+1) }))}
                        style={{ width:30, height:30, borderRadius:8, background:'rgba(255,255,255,0.06)', border:`1px solid ${T.border}`, color:T.muted, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }} aria-label="Augmenter">+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:10, marginTop:22 }}>
                <button onClick={() => setShowModal(false)}
                  style={{ flex:1, padding:'12px 0', borderRadius:12, background:'rgba(255,255,255,0.06)', border:`1px solid ${T.border}`, color:T.muted, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  Annuler
                </button>
                <button onClick={saveGoals} disabled={saving}
                  style={{ flex:1, padding:'12px 0', borderRadius:12, background:`linear-gradient(135deg,${T.teal},${T.cyan})`, border:'none', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', opacity:saving?0.6:1, boxShadow:`0 4px 16px ${T.glow}` }}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
