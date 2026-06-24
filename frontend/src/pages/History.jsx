import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const DIFF_COLOR = {
  easy:   { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Facile' },
  medium: { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Moyen' },
  hard:   { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Difficile' },
};

function scoreColor(pct) {
  if (pct >= 80) return { ring: '#10b981', text: '#065f46', bg: '#ecfdf5', label: 'Réussi', cls: 'text-emerald-700 bg-emerald-50' };
  if (pct >= 60) return { ring: '#f59e0b', text: '#92400e', bg: '#fffbeb', label: 'Passable', cls: 'text-amber-700 bg-amber-50' };
  return { ring: '#ef4444', text: '#991b1b', bg: '#fef2f2', label: 'À revoir', cls: 'text-red-700 bg-red-50' };
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateShort(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

/* ─── Graphique de progression ────────────────────────────────────────────── */
const BAR_COLORS = {
  good:   { from: '#10b981', to: '#34d399', glow: '#10b98140', label: 'Réussi',   dot: '#10b981' },
  medium: { from: '#f59e0b', to: '#fbbf24', glow: '#f59e0b40', label: 'Passable', dot: '#f59e0b' },
  bad:    { from: '#ef4444', to: '#f87171', glow: '#ef444440', label: 'À revoir', dot: '#ef4444' },
};
function barCfg(pct) {
  if (pct >= 80) return BAR_COLORS.good;
  if (pct >= 60) return BAR_COLORS.medium;
  return BAR_COLORS.bad;
}

function ProgressChart({ data }) {
  const [hovered, setHovered] = useState(null);
  if (data.length < 2) return null;

  const items    = data.slice(-12);
  const avg      = Math.round(items.reduce((s, d) => s + d.pct, 0) / items.length);
  const best     = Math.max(...items.map(d => d.pct));
  const bestIdx  = items.findIndex(d => d.pct === best);

  /* Tendance : 2e moitié vs 1re moitié */
  const half = Math.floor(items.length / 2);
  const avgFirst  = items.slice(0, half).reduce((s, d) => s + d.pct, 0) / (half || 1);
  const avgSecond = items.slice(half).reduce((s, d) => s + d.pct, 0) / ((items.length - half) || 1);
  const trend = avgSecond - avgFirst;

  const avgCfg = barCfg(avg);

  return (
    <div className="space-y-5">

      {/* ── KPIs ── */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Moyenne */}
        <div className="flex-1 min-w-[120px] rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{ background: `linear-gradient(135deg, ${avgCfg.from}18, ${avgCfg.to}08)`, border: `1.5px solid ${avgCfg.from}30` }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Moyenne</p>
            <p className="text-3xl font-black leading-none" style={{ color: avgCfg.from }}>{avg}%</p>
          </div>
          {/* Tendance */}
          <div className={`ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            trend > 2  ? 'bg-emerald-100 text-emerald-700' :
            trend < -2 ? 'bg-red-100 text-red-600' :
                         'bg-slate-100 text-slate-500'
          }`}>
            {trend > 2  ? '↑' : trend < -2 ? '↓' : '→'}
            {Math.abs(Math.round(trend))}%
          </div>
        </div>

        {/* Meilleur */}
        <div className="rounded-2xl px-5 py-4 bg-emerald-50 border border-emerald-100 text-center min-w-[80px]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-0.5">Meilleur</p>
          <p className="text-2xl font-black text-emerald-600 leading-none">{best}%</p>
        </div>

        {/* Quiz analysés */}
        <div className="rounded-2xl px-5 py-4 bg-slate-50 border border-slate-100 text-center min-w-[80px]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Analysés</p>
          <p className="text-2xl font-black text-slate-700 leading-none">{items.length}</p>
        </div>
      </div>

      {/* ── Barres ── */}
      <div>
        {/* Zone de barres */}
        <div className="flex items-end gap-1.5 h-28 relative">
          {/* Zone verte subtile en fond (≥80%) */}
          <div className="absolute inset-x-0 top-0 rounded-xl pointer-events-none"
            style={{ height: '20%', background: 'linear-gradient(180deg,#10b98108,transparent)' }}/>

          {items.map((d, i) => {
            const cfg     = barCfg(d.pct);
            const isHov   = hovered === i;
            const isBest  = i === bestIdx;
            const heightPct = Math.max(d.pct, 6); // minimum visible

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHov && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20
                        bg-slate-900 text-white rounded-xl px-3 py-2 text-center shadow-xl pointer-events-none whitespace-nowrap"
                    >
                      <p className="text-base font-black leading-none" style={{ color: cfg.from }}>{d.pct}%</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{fmtDateShort(d.completedAt)}</p>
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: cfg.dot }}>{cfg.label}</p>
                      {/* Flèche */}
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-1.5 overflow-hidden">
                        <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -translate-y-1"/>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Barre */}
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    height: `${heightPct}%`,
                    originY: 1,
                    background: isHov || isBest
                      ? `linear-gradient(180deg, ${cfg.from}, ${cfg.to}cc)`
                      : `linear-gradient(180deg, ${cfg.from}cc, ${cfg.to}88)`,
                    boxShadow: (isHov || isBest) ? `0 0 12px ${cfg.glow}` : 'none',
                  }}
                  className={`w-full rounded-t-xl cursor-pointer transition-all ${isBest ? 'ring-2 ring-offset-1' : ''}`}
                />
              </div>
            );
          })}
        </div>

        {/* Dates en bas */}
        <div className="flex gap-1.5 mt-2">
          {items.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] text-slate-300">{fmtDateShort(d.completedAt)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Légende compacte */}
      <div className="flex gap-4 justify-center">
        {[BAR_COLORS.good, BAR_COLORS.medium, BAR_COLORS.bad].map(c => (
          <span key={c.label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: c.dot }}/>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Score ring ──────────────────────────────────────────────────────────── */
function ScoreRing({ pct, size = 52 }) {
  const c = scoreColor(pct);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c.ring} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color: c.text }}>{pct}%</span>
      </div>
    </div>
  );
}

/* ─── Panneau de détail ───────────────────────────────────────────────────── */
function DetailPanel({ item, onClose, navigate, token }) {
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item?.quizId) { setLoading(false); return; }
    axios.get(`${API_URL}/quizzes/${item.quizId}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => setAnswers(r.data?.answers || []))
      .catch(() => setAnswers([]))
      .finally(() => setLoading(false));
  }, [item?.quizId, token]);

  if (!item) return null;
  const c    = scoreColor(item.pct);
  const diff = DIFF_COLOR[item.difficulty] || DIFF_COLOR.medium;
  const correct = answers?.filter(a => a.isCorrect).length ?? item.score;
  const wrong   = answers ? answers.length - correct : (item.total - item.score);

  return (
    <>
      {/* Overlay */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}/>

      {/* Panel */}
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {item.semester && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.semester}</span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>{diff.label}</span>
              </div>
              <h2 className="text-base font-black text-slate-900 leading-snug">{item.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {item.category}{item.chapter ? ` · ${item.chapter}` : ''} · {fmtDate(item.completedAt)}
              </p>
            </div>
            <button onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Score summary */}
          <div className="flex items-center gap-4 mt-4 p-4 rounded-2xl" style={{ backgroundColor: c.bg }}>
            <ScoreRing pct={item.pct} size={60}/>
            <div className="flex-1">
              <p className="text-2xl font-black" style={{ color: c.text }}>{item.score}/{item.total}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: c.text }}>{c.label}</p>
            </div>
            <div className="flex gap-3 text-center">
              <div>
                <p className="text-lg font-black text-emerald-600">{correct}</p>
                <p className="text-[10px] text-slate-400">correctes</p>
              </div>
              <div className="w-px bg-slate-200"/>
              <div>
                <p className="text-lg font-black text-red-500">{wrong}</p>
                <p className="text-[10px] text-slate-400">incorrectes</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-2 rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: c.ring }}/>
          </div>
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : answers && answers.length > 0 ? (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Détail des {answers.length} questions
              </p>
              {answers.map((a, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-2xl border p-3.5 ${a.isCorrect
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${a.isCorrect ? 'bg-emerald-500' : 'bg-red-400'}`}>
                      {a.isCorrect
                        ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                        <span className="text-slate-400 mr-1">Q{i + 1}.</span>
                        {a.questionText || `Question ${i + 1}`}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${a.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700 line-through opacity-70'}`}>
                          Ta réponse : {a.selectedText || '—'}
                        </p>
                        {!a.isCorrect && a.correctText && (
                          <p className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                            Bonne réponse : {a.correctText}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm font-medium">Détail des questions non disponible</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {item.quizId && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { navigate(`/dashboard/quiz/${item.quizId}`); onClose(); }}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Refaire ce quiz
            </motion.button>
          </div>
        )}
      </motion.aside>
    </>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function History() {
  const { token } = useAuth();
  const navigate   = useNavigate();
  const [history,     setHistory]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [filterSem,   setFilterSem]   = useState('');
  const [sort,        setSort]        = useState('date');
  const [selected,    setSelected]    = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/quizzes/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setHistory(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const stats = useMemo(() => {
    if (!history.length) return null;
    const scores  = history.map(h => h.pct);
    const avg     = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best    = Math.max(...scores);
    const above80 = history.filter(h => h.pct >= 80).length;
    return { total: history.length, avg, best, above80 };
  }, [history]);

  const semesters = useMemo(() => [...new Set(history.map(h => h.semester).filter(Boolean))].sort(), [history]);

  const filtered = useMemo(() => {
    let list = history.filter(h => {
      const q = search.toLowerCase();
      const matchSearch = !q || h.title.toLowerCase().includes(q) || h.category.toLowerCase().includes(q) || h.chapter.toLowerCase().includes(q);
      const matchSem    = !filterSem || h.semester === filterSem;
      return matchSearch && matchSem;
    });
    if (sort === 'score_desc') list = [...list].sort((a, b) => b.pct - a.pct);
    if (sort === 'score_asc')  list = [...list].sort((a, b) => a.pct - b.pct);
    return list;
  }, [history, search, filterSem, sort]);

  const chartData = useMemo(() =>
    [...history].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt)).slice(-20),
  [history]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-slate-50">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }}
          className="px-6 pt-8 pb-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-bold text-white mb-1">Mes résultats</h1>
            <p className="text-blue-200/70 text-sm mb-6">Clique sur un quiz pour voir le détail question par question</p>
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Quiz terminés',  value: stats.total,          sub: 'au total' },
                  { label: 'Score moyen',    value: `${stats.avg}%`,      sub: 'sur tous les quiz' },
                  { label: 'Meilleur score', value: `${stats.best}%`,     sub: 'record personnel' },
                  { label: 'Score ≥ 80%',   value: stats.above80,        sub: 'quiz réussis' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="text-xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-blue-200/60 mt-0.5">{s.label}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{s.sub}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="px-6 py-6 max-w-4xl mx-auto">

          {/* ── Graphique de progression ── */}
          {chartData.length >= 2 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-black text-slate-900">Progression</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Tes {Math.min(chartData.length, 12)} derniers quiz</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                  Survole une barre pour le détail
                </span>
              </div>
              <ProgressChart data={chartData}/>
            </motion.div>
          )}

          {/* ── Filtres ── */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex-1 min-w-[180px] relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un quiz…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"/>
            </div>
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
              className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition text-slate-700">
              <option value="">Tous les semestres</option>
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition text-slate-700">
              <option value="date">Plus récent</option>
              <option value="score_desc">Meilleur score</option>
              <option value="score_asc">Score le plus bas</option>
            </select>
          </div>

          {filtered.length > 0 && (
            <p className="text-xs text-slate-400 mb-4">
              {filtered.length} quiz affiché{filtered.length > 1 ? 's' : ''}
              {(search || filterSem) ? ' (filtré)' : ''} · <span className="text-blue-500">clique pour voir le détail</span>
            </p>
          )}

          {/* ── Liste ── */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-semibold text-slate-600">
                {history.length === 0 ? 'Aucun quiz terminé pour l\'instant' : 'Aucun résultat pour cette recherche'}
              </p>
              {history.length === 0 && (
                <button onClick={() => navigate('/dashboard/quiz')}
                  className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition">
                  Faire mon premier quiz
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((item, i) => {
                  const diff = DIFF_COLOR[item.difficulty] || DIFF_COLOR.medium;
                  const c    = scoreColor(item.pct);
                  return (
                    <motion.div key={item._id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i < 10 ? i * 0.04 : 0 }}
                      onClick={() => setSelected(item)}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-4 flex items-center gap-4 cursor-pointer group">

                      <ScoreRing pct={item.pct}/>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {item.semester && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.semester}</span>
                          )}
                          {item.difficulty && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>{diff.label}</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">{item.title}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {item.category}{item.chapter ? ` · ${item.chapter}` : ''}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold" style={{ color: c.text }}>{item.score}/{item.total}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{fmtDate(item.completedAt)}</div>
                      </div>

                      {/* Icône "voir détail" */}
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center transition text-slate-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Panneau de détail ── */}
      <AnimatePresence>
        {selected && (
          <DetailPanel
            item={selected}
            token={token}
            navigate={navigate}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
