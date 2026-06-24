import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { getCache, setCache } from '../utils/cache';
import { API_URL, useAuth } from '../context/AuthContext';

/* ─── Config par type ─────────────────────────────────────────────────────── */
const TYPE_CFG = {
  case_study: {
    label: 'Cas clinique',
    gradFrom: '#c2410c', gradTo: '#ea580c',
    light: '#fff7ed', border: '#fed7aa', textColor: '#9a3412',
    headerText: 'Situation clinique',
  },
  qcm: {
    label: 'QCM',
    gradFrom: '#6d28d9', gradTo: '#7c3aed',
    light: '#f5f3ff', border: '#ddd6fe', textColor: '#5b21b6',
    headerText: 'Question',
  },
  open: {
    label: 'Question ouverte',
    gradFrom: '#1d4ed8', gradTo: '#0891b2',
    light: '#eff6ff', border: '#bfdbfe', textColor: '#1e40af',
    headerText: 'Question ouverte',
  },
};
const DIFF = {
  easy:   { label: 'Facile',   cls: 'bg-emerald-100/30 text-emerald-200 border-emerald-500/30' },
  medium: { label: 'Moyen',    cls: 'bg-yellow-100/20 text-yellow-200 border-yellow-500/30'   },
  hard:   { label: 'Difficile',cls: 'bg-red-100/20 text-red-200 border-red-400/30'            },
};
const EX_PALETTE = [
  ['#2563eb','#0891b2'], ['#7c3aed','#6d28d9'], ['#ea580c','#d97706'],
  ['#059669','#047857'], ['#dc2626','#db2777'], ['#0f766e','#0891b2'],
];

/* ─── Exercise Card ─────────────────────────────────────────────────────────── */
function ExerciseCard({ ex, onComplete, quotaExceeded, index }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [completed,  setCompleted]  = useState(false);
  const cfg  = TYPE_CFG[ex.type] || TYPE_CFG.open;
  const diff = DIFF[ex.difficulty] || DIFF.medium;

  const handleComplete = async () => {
    if (completed || quotaExceeded) return;
    setCompleted(true);
    setShowAnswer(true);
    try {
      await axios.post(`${API_URL}/exercises/complete`);
      onComplete();
    } catch {}
  };

  /* parse le contenu: cherche des lignes "N. ..." pour numéroter les questions */
  const lines = (ex.content || '').split('\n').filter(l => l.trim());
  const isNumbered = lines.some(l => /^\d+[\.\)]\s/.test(l.trim()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="rounded-3xl overflow-hidden shadow-lg border"
      style={{
        borderColor: cfg.border,
        boxShadow: `0 8px 30px -8px ${cfg.gradFrom}33`,
      }}
    >
      {/* ── Header gradient ── */}
      <div className="px-6 py-4 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg,${cfg.gradFrom},${cfg.gradTo})` }}>
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10"/>
        <div className="absolute right-6 -bottom-6 w-14 h-14 rounded-full bg-white/5"/>
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-white/80 bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wide">
              {cfg.label}
            </span>
            <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full ${diff.cls}`}>
              {diff.label}
            </span>
            {completed && (
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                Complété
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs flex-shrink-0">
            {ex.category && <span className="font-semibold text-white/80">{ex.category}</span>}
            {ex.semester  && <span className="text-white/50">{ex.semester}</span>}
          </div>
        </div>
        <h3 className="text-sm font-black text-white mt-2.5 leading-snug">{ex.title}</h3>
      </div>

      {/* ── Body ── */}
      <div className="bg-white p-5 space-y-4">

        {/* Énoncé / Situation clinique */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: cfg.light, borderColor: cfg.border }}>
          <p className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: cfg.textColor }}>
            {cfg.headerText}
          </p>
          {isNumbered ? (
            /* Questions numérotées */
            <div className="space-y-2">
              {lines.map((line, i) => {
                const match = line.trim().match(/^(\d+)[\.\)]\s+(.+)/);
                if (match) {
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5"
                        style={{ background: `linear-gradient(135deg,${cfg.gradFrom},${cfg.gradTo})` }}>
                        {match[1]}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">{match[2]}</p>
                    </div>
                  );
                }
                return <p key={i} className="text-xs text-slate-700 leading-relaxed">{line}</p>;
              })}
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line">{ex.content}</p>
          )}
        </div>

        {/* QCM Options */}
        {ex.type === 'qcm' && ex.options?.length > 0 && (
          <div className="space-y-2">
            {ex.options.map((opt, i) => {
              let cls = 'border border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50/30';
              let icon = null;
              if (showAnswer) {
                if (opt.isCorrect) {
                  cls = 'border-2 border-emerald-400 bg-emerald-50 text-emerald-800';
                  icon = (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  );
                } else if (selected === i) {
                  cls = 'border-2 border-red-400 bg-red-50 text-red-700 line-through opacity-80';
                  icon = (
                    <span className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center flex-shrink-0">
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </span>
                  );
                } else {
                  cls = 'border border-slate-100 text-slate-400 opacity-60';
                  icon = (
                    <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-slate-500">
                      {String.fromCharCode(65 + i)}
                    </span>
                  );
                }
              }
              return (
                <button key={i} disabled={showAnswer}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all flex items-center gap-3 ${cls} ${!showAnswer ? 'cursor-pointer' : 'cursor-default'}`}>
                  {!showAnswer && (
                    <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[9px] font-bold flex-shrink-0 opacity-50">
                      {String.fromCharCode(65 + i)}
                    </span>
                  )}
                  {showAnswer && icon}
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Correction */}
        <AnimatePresence>
          {showAnswer && ex.answer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4"
            >
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Correction
              </p>
              {ex.answer.split('\n').filter(l => l.trim()).map((line, i) => {
                const match = line.trim().match(/^(\d+)[\.\)]\s+(.+)/);
                if (match) {
                  return (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        <strong className="text-emerald-700">{match[1]}.</strong> {match[2]}
                      </p>
                    </div>
                  );
                }
                return <p key={i} className="text-xs text-emerald-800 leading-relaxed mb-1">{line}</p>;
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            {!showAnswer && (
              <button onClick={() => setShowAnswer(true)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition">
                Voir la correction
              </button>
            )}
          </div>

          {quotaExceeded && !completed ? (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              Quota mensuel atteint — Passe à Pro
            </span>
          ) : !completed ? (
            <motion.button onClick={handleComplete}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="px-5 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              style={{ background: `linear-gradient(135deg,${cfg.gradFrom},${cfg.gradTo})` }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Marquer complété
            </motion.button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Exercice complété
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Breadcrumb ─────────────────────────────────────────────────────────────── */
function ExBreadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
          {item.onClick
            ? <button onClick={item.onClick} className="hover:text-blue-600 transition font-medium">{item.label}</button>
            : <span className="text-slate-700 font-semibold">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ─── Quota Banner ───────────────────────────────────────────────────────────── */
function QuotaBanner({ used, limit, navigate }) {
  if (used < limit) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-amber-800">Quota mensuel atteint ({used}/{limit} exercice{limit > 1 ? 's' : ''})</p>
          <p className="text-xs text-amber-600 mt-0.5">Passe à l'abonnement Étudiant pour un accès illimité.</p>
        </div>
      </div>
      <button onClick={() => navigate('/dashboard/subscription')}
        className="px-4 py-2 text-white rounded-xl text-xs font-bold whitespace-nowrap transition hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#d97706,#ea580c)' }}>
        Voir les offres
      </button>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Exercises() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const isFree     = user?.subscription === 'free';

  const [exercises,      setExercises]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [quota,          setQuota]          = useState(null);

  const [view,               setView]               = useState('semesters');
  const [selectedSemester,   setSelectedSemester]   = useState(null);
  const [selectedCaseType,   setSelectedCaseType]   = useState(null);
  const [selectedUE,         setSelectedUE]         = useState(null);

  useEffect(() => {
    const cached = getCache('exercises_list');
    if (cached) { setExercises(cached); setLoading(false); }
    axios.get(`${API_URL}/exercises`)
      .then(r => { setExercises(r.data); setCache('exercises_list', r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    if (isFree) {
      axios.get(`${API_URL}/exercises/quota`)
        .then(r => setQuota(r.data))
        .catch(() => {});
    }
  }, [isFree]);

  /* Build structure */
  const structure = {};
  exercises.forEach(ex => {
    const sem = (ex.semester  || 'Non classé').trim();
    const ct  = (ex.caseType  || 'Général').trim();
    const ue  = (ex.category  || 'Autre').trim();
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ct]) structure[sem][ct] = {};
    if (!structure[sem][ct][ue]) structure[sem][ct][ue] = [];
    structure[sem][ct][ue].push(ex);
  });

  const semesters  = Object.keys(structure).sort();
  const caseTypes  = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const ues        = (selectedSemester && selectedCaseType) ? Object.keys(structure[selectedSemester]?.[selectedCaseType] || {}).sort() : [];
  const currentExs = (selectedSemester && selectedCaseType && selectedUE)
    ? (structure[selectedSemester]?.[selectedCaseType]?.[selectedUE] || []) : [];

  const reset = () => { setView('semesters'); setSelectedSemester(null); setSelectedCaseType(null); setSelectedUE(null); };

  const qcmCount  = exercises.filter(e => e.type === 'qcm').length;
  const openCount = exercises.filter(e => e.type === 'open').length;
  const caseCount = exercises.filter(e => e.type === 'case_study').length;

  const quotaExceeded = isFree && quota?.exceeded;

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div className="px-6 pt-8 pb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#0c4a6e 100%)' }}>
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5"/>
          <div className="absolute right-32 bottom-0 w-24 h-24 rounded-full bg-cyan-500/10"/>
          <div className="flex items-end justify-between mb-2 relative">
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Exercices cliniques</p>
              <h1 className="text-2xl font-black text-white mb-1">Entraîne-toi sur des cas réels</h1>
              <p className="text-blue-200/70 text-sm">QCM, questions ouvertes et cas cliniques — comme aux examens IFSI</p>
            </div>
            {completedCount > 0 && (
              <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0">
                ✓ {completedCount} complété{completedCount > 1 ? 's' : ''} cette session
              </div>
            )}
          </div>
          {/* Stats */}
          <div className="flex gap-5 mt-4 relative">
            {[
              { label: 'Total',      val: exercises.length, color: '#93c5fd' },
              { label: 'QCM',        val: qcmCount,         color: '#c4b5fd' },
              { label: 'Ouvertes',   val: openCount,        color: '#60a5fa' },
              { label: 'Cas cliniques', val: caseCount,     color: '#fb923c' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-black" style={{ color: s.color }}>{s.val}</p>
                <p className="text-xs text-blue-300/60">{s.label}</p>
              </div>
            ))}
            {isFree && quota && (
              <div className="ml-auto text-right">
                <p className="text-xs text-blue-300/60 mb-0.5">Quota mensuel</p>
                <p className="text-sm font-bold text-white">{quota.used} / {quota.limit} exercice{quota.limit > 1 ? 's' : ''}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 bg-slate-50 min-h-full">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {/* SEMESTERS */}
              {view === 'semesters' && (
                <motion.div key="sems" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {semesters.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                      <div className="text-5xl mb-3">📋</div>
                      <p className="font-semibold">Aucun exercice disponible</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {semesters.map((sem, idx) => {
                        const [from, to] = EX_PALETTE[idx % EX_PALETTE.length];
                        const ctCount = Object.keys(structure[sem]).length;
                        const total   = Object.values(structure[sem]).flatMap(ct => Object.values(ct)).flat().length;
                        return (
                          <motion.button key={sem}
                            onClick={() => { setSelectedSemester(sem); setView('casetypes'); }}
                            whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className="relative overflow-hidden rounded-3xl p-6 text-left shadow-lg hover:shadow-xl transition-shadow"
                            style={{ background: `linear-gradient(135deg,${from},${to})` }}>
                            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-xl"/>
                            <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-black/10 blur-xl"/>
                            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
                            </div>
                            <h3 className="font-black text-white text-base mb-1">{sem}</h3>
                            <p className="text-white/70 text-xs mb-4">{ctCount} type{ctCount > 1 ? 's' : ''} · {total} exercice{total > 1 ? 's' : ''}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1.5">
                                {Array.from({ length: Math.min(ctCount, 5) }).map((_, i) => (
                                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"/>
                                ))}
                              </div>
                              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* CASE TYPES */}
              {view === 'casetypes' && selectedSemester && (
                <motion.div key="cts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <ExBreadcrumb items={[{ label: 'Exercices', onClick: reset }, { label: selectedSemester }]}/>
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-slate-900">{selectedSemester}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{caseTypes.length} type{caseTypes.length > 1 ? 's' : ''} de cas</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {caseTypes.map((ct, idx) => {
                      const [from, to] = EX_PALETTE[idx % EX_PALETTE.length];
                      const ueCount = Object.keys(structure[selectedSemester][ct]).length;
                      const total   = Object.values(structure[selectedSemester][ct]).flat().length;
                      return (
                        <motion.button key={ct}
                          onClick={() => { setSelectedCaseType(ct); setView('ues'); }}
                          whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative overflow-hidden rounded-3xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                          style={{ background: `linear-gradient(135deg,${from},${to})` }}>
                          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-xl"/>
                          <h3 className="font-black text-white text-sm mb-1">{ct}</h3>
                          <p className="text-white/70 text-xs mb-3">{ueCount} UE · {total} exercice{total > 1 ? 's' : ''}</p>
                          <div className="flex justify-end">
                            <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* UEs */}
              {view === 'ues' && selectedSemester && selectedCaseType && (
                <motion.div key="ues" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <ExBreadcrumb items={[
                    { label: 'Exercices', onClick: reset },
                    { label: selectedSemester, onClick: () => { setSelectedCaseType(null); setView('casetypes'); } },
                    { label: selectedCaseType },
                  ]}/>
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-slate-900">{selectedCaseType}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{ues.length} unité{ues.length > 1 ? 's' : ''} d'enseignement</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ues.map((ue, idx) => {
                      const [from, to] = EX_PALETTE[idx % EX_PALETTE.length];
                      const count = structure[selectedSemester][selectedCaseType][ue].length;
                      return (
                        <motion.button key={ue}
                          onClick={() => { setSelectedUE(ue); setView('exercises'); }}
                          whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-50 transition-all text-left group flex items-center gap-4 shadow-sm">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `linear-gradient(135deg,${from},${to})` }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{ue}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{count} exercice{count > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-slate-300 group-hover:text-orange-500 transition flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* EXERCISE LIST */}
              {view === 'exercises' && selectedSemester && selectedCaseType && selectedUE && (
                <motion.div key="exs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <ExBreadcrumb items={[
                    { label: 'Exercices', onClick: reset },
                    { label: selectedSemester, onClick: () => { setSelectedCaseType(null); setSelectedUE(null); setView('casetypes'); } },
                    { label: selectedCaseType, onClick: () => { setSelectedUE(null); setView('ues'); } },
                    { label: selectedUE },
                  ]}/>

                  <div className="mb-6">
                    <h2 className="text-xl font-black text-slate-900">{selectedUE}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{currentExs.length} exercice{currentExs.length > 1 ? 's' : ''}</p>
                  </div>

                  {/* Quota banner */}
                  {isFree && quota && <QuotaBanner used={quota.used} limit={quota.limit} navigate={navigate}/>}

                  {/* Cards — case_study prend toute la largeur, qcm/open en 2 col */}
                  <div className="space-y-5 max-w-4xl">
                    {currentExs.map((ex, i) => (
                      <ExerciseCard
                        key={ex._id}
                        ex={ex}
                        index={i}
                        quotaExceeded={quotaExceeded}
                        onComplete={() => {
                          setCompletedCount(c => c + 1);
                          if (isFree && quota) setQuota(q => ({ ...q, used: (q.used || 0) + 1, exceeded: (q.used || 0) + 1 >= q.limit }));
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
