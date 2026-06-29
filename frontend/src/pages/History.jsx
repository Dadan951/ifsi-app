import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:     '#EEF2FF',
  card:   '#FFFFFF',
  text:   '#1e1b4b',
  muted:  '#6366f1',
  border: '#e0e7ff',
  indigo: '#4F46E5',
  violet: '#7C3AED',
  pink:   '#EC4899',
  sub:    '#64748b',
};

const clay = {
  card: '0 2px 0 #c7d2fe, 0 4px 24px rgba(99,102,241,0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
  sm:   '0 2px 0 #c7d2fe, 0 2px 8px rgba(99,102,241,0.10)',
  btn:  (hex, dark) => `0 4px 0 ${dark}, 0 8px 24px ${hex}40, 0 1px 0 rgba(255,255,255,0.4) inset`,
  open: '0 2px 0 #818cf8, 0 8px 32px rgba(79,70,229,0.15), 0 1px 0 rgba(255,255,255,0.9) inset',
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const DIFF = {
  easy:   { bg:'#d1fae5', text:'#065f46', label:'Facile' },
  medium: { bg:'#fef3c7', text:'#92400e', label:'Moyen' },
  hard:   { bg:'#fee2e2', text:'#991b1b', label:'Difficile' },
};

function scoreColor(pct) {
  if (pct >= 80) return { ring:'#10b981', text:'#065f46', bg:'#ecfdf5', label:'Réussi' };
  if (pct >= 60) return { ring:'#f59e0b', text:'#92400e', bg:'#fffbeb', label:'Passable' };
  return { ring:'#ef4444', text:'#991b1b', bg:'#fef2f2', label:'À revoir' };
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtDateShort(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit' });
}

/* ─── Bar chart config ────────────────────────────────────────────────────── */
const BAR_COLORS = {
  good:   { from:'#10b981', to:'#34d399', glow:'#10b98140', dot:'#10b981', label:'Réussi' },
  medium: { from:'#f59e0b', to:'#fbbf24', glow:'#f59e0b40', dot:'#f59e0b', label:'Passable' },
  bad:    { from:'#ef4444', to:'#f87171', glow:'#ef444440', dot:'#ef4444', label:'À revoir' },
};
function barCfg(pct) {
  if (pct >= 80) return BAR_COLORS.good;
  if (pct >= 60) return BAR_COLORS.medium;
  return BAR_COLORS.bad;
}

/* ─── ProgressChart ───────────────────────────────────────────────────────── */
function ProgressChart({ data }) {
  const [hovered, setHovered] = useState(null);
  if (data.length < 2) return null;

  const items   = data.slice(-12);
  const avg     = Math.round(items.reduce((s, d) => s + d.pct, 0) / items.length);
  const best    = Math.max(...items.map(d => d.pct));
  const bestIdx = items.findIndex(d => d.pct === best);

  const half     = Math.floor(items.length / 2);
  const avgFirst  = items.slice(0, half).reduce((s, d) => s + d.pct, 0) / (half || 1);
  const avgSecond = items.slice(half).reduce((s, d) => s + d.pct, 0) / ((items.length - half) || 1);
  const trend     = avgSecond - avgFirst;
  const avgCfg    = barCfg(avg);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:12 }}>
        <div style={{ borderRadius:16, padding:'14px 18px', display:'flex', alignItems:'center', gap:16,
          background:`linear-gradient(135deg,${avgCfg.from}18,${avgCfg.to}08)`,
          border:`1.5px solid ${avgCfg.from}30`, boxShadow:clay.sm }}>
          <div>
            <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:C.sub, marginBottom:2 }}>Moyenne</p>
            <p className="nunito" style={{ fontSize:28, fontWeight:900, color:avgCfg.from, lineHeight:1 }}>{avg}%</p>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700,
            background: trend > 2 ? '#d1fae5' : trend < -2 ? '#fee2e2' : '#f1f5f9',
            color:      trend > 2 ? '#065f46' : trend < -2 ? '#991b1b' : '#64748b' }}>
            {trend > 2 ? '↑' : trend < -2 ? '↓' : '→'} {Math.abs(Math.round(trend))}%
          </div>
        </div>
        <div style={{ borderRadius:16, padding:'14px 18px', textAlign:'center',
          background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', border:'1.5px solid #a7f3d0', boxShadow:clay.sm }}>
          <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#059669', marginBottom:2 }}>Meilleur</p>
          <p className="nunito" style={{ fontSize:24, fontWeight:900, color:'#065f46', lineHeight:1 }}>{best}%</p>
        </div>
        <div style={{ borderRadius:16, padding:'14px 18px', textAlign:'center',
          background:'linear-gradient(135deg,#f8fafc,#f1f5f9)', border:`1.5px solid ${C.border}`, boxShadow:clay.sm }}>
          <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:C.sub, marginBottom:2 }}>Analysés</p>
          <p className="nunito" style={{ fontSize:24, fontWeight:900, color:C.text, lineHeight:1 }}>{items.length}</p>
        </div>
      </div>

      {/* Barres */}
      <div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:112, position:'relative' }}>
          <div style={{ position:'absolute', inset:0, height:'20%', background:'linear-gradient(180deg,#10b98108,transparent)', borderRadius:12, pointerEvents:'none' }}/>
          {items.map((d, i) => {
            const cfg    = barCfg(d.pct);
            const isHov  = hovered === i;
            const isBest = i === bestIdx;
            const h      = Math.max(d.pct, 6);
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'flex-end', position:'relative' }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <AnimatePresence>
                  {isHov && (
                    <motion.div initial={{ opacity:0, y:4, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, scale:0.9 }}
                      style={{ position:'absolute', bottom:'100%', marginBottom:8, left:'50%', transform:'translateX(-50%)',
                        background:'#1e1b4b', color:'#fff', borderRadius:12, padding:'6px 10px', textAlign:'center',
                        boxShadow:'0 4px 16px rgba(30,27,75,0.3)', pointerEvents:'none', whiteSpace:'nowrap', zIndex:20 }}>
                      <p style={{ fontSize:15, fontWeight:900, color:cfg.from, lineHeight:1 }}>{d.pct}%</p>
                      <p style={{ fontSize:9, color:'rgba(255,255,255,0.45)', marginTop:2 }}>{fmtDateShort(d.completedAt)}</p>
                      <p style={{ fontSize:10, fontWeight:600, color:cfg.dot, marginTop:2 }}>{cfg.label}</p>
                      <div style={{ position:'absolute', left:'50%', bottom:-5, transform:'translateX(-50%)', width:10, height:5, overflow:'hidden' }}>
                        <div style={{ width:8, height:8, background:'#1e1b4b', transform:'rotate(45deg)', margin:'0 auto', marginTop:-4 }}/>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  initial={{ scaleY:0, opacity:0 }} animate={{ scaleY:1, opacity:1 }}
                  transition={{ delay:i*0.04, duration:0.5, ease:[0.16,1,0.3,1] }}
                  style={{ width:'100%', height:`${h}%`, originY:1, cursor:'pointer',
                    background: isHov||isBest ? `linear-gradient(180deg,${cfg.from},${cfg.to}cc)` : `linear-gradient(180deg,${cfg.from}cc,${cfg.to}88)`,
                    boxShadow: isHov||isBest ? `0 0 12px ${cfg.glow}` : 'none',
                    borderRadius:'8px 8px 4px 4px',
                    outline: isBest ? `2px solid ${cfg.from}` : 'none' }}/>
              </div>
            );
          })}
        </div>
        <div style={{ display:'flex', gap:6, marginTop:8 }}>
          {items.map((d, i) => (
            <div key={i} style={{ flex:1, textAlign:'center' }}>
              <span style={{ fontSize:9, color:'#94a3b8' }}>{fmtDateShort(d.completedAt)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
        {[BAR_COLORS.good, BAR_COLORS.medium, BAR_COLORS.bad].map(bc => (
          <span key={bc.label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:10, color:C.sub }}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:bc.dot, display:'inline-block', flexShrink:0 }}/>
            {bc.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── ScoreRing ───────────────────────────────────────────────────────────── */
function ScoreRing({ pct, size = 52 }) {
  const sc   = scoreColor(pct);
  const r    = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position:'relative', flexShrink:0, width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0e7ff" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={sc.ring} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:11, fontWeight:800, color:sc.text }}>{pct}%</span>
      </div>
    </div>
  );
}

/* ─── QuizAccordion ───────────────────────────────────────────────────────── */
function QuizAccordion({ item, token, navigate, isOpen }) {
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetched = useState(false);

  useEffect(() => {
    if (!isOpen || fetched[0] || !item.quizId) return;
    fetched[1](true);
    setLoading(true);
    axios.get(`${API_URL}/quizzes/${item.quizId}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => setAnswers(r.data?.answers || []))
      .catch(() => setAnswers([]))
      .finally(() => setLoading(false));
  }, [isOpen]); // eslint-disable-line

  const sc      = scoreColor(item.pct);
  const correct = answers?.filter(a => a.isCorrect).length ?? item.score;
  const wrong   = answers ? answers.length - correct : (item.total - item.score);

  return (
    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
      exit={{ height:0, opacity:0 }} transition={{ duration:0.32, ease:[0.16,1,0.3,1] }}
      style={{ overflow:'hidden' }}>
      <div style={{ padding:'0 18px 18px', paddingTop:4 }}>
        <div style={{ height:1, background:C.border, marginBottom:16 }}/>

        {/* Score résumé */}
        <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 16px', borderRadius:16,
          background:sc.bg, marginBottom:14 }}>
          <ScoreRing pct={item.pct} size={56}/>
          <div style={{ flex:1 }}>
            <p className="nunito" style={{ fontSize:20, fontWeight:900, color:sc.text, lineHeight:1 }}>{item.score}/{item.total}</p>
            <p style={{ fontSize:12, fontWeight:600, color:sc.text, marginTop:2 }}>{sc.label}</p>
          </div>
          <div style={{ display:'flex', gap:16, textAlign:'center' }}>
            <div>
              <p className="nunito" style={{ fontSize:18, fontWeight:900, color:'#059669' }}>{correct}</p>
              <p style={{ fontSize:10, color:C.sub }}>correcte{correct>1?'s':''}</p>
            </div>
            <div style={{ width:1, background:C.border }}/>
            <div>
              <p className="nunito" style={{ fontSize:18, fontWeight:900, color:'#ef4444' }}>{wrong}</p>
              <p style={{ fontSize:10, color:C.sub }}>incorrecte{wrong>1?'s':''}</p>
            </div>
          </div>
        </div>

        {/* Barre de score */}
        <div style={{ height:6, background:C.border, borderRadius:8, overflow:'hidden', marginBottom:18 }}>
          <motion.div initial={{ width:0 }} animate={{ width:`${item.pct}%` }}
            transition={{ duration:0.6, ease:[0.16,1,0.3,1], delay:0.1 }}
            style={{ height:'100%', borderRadius:8, background:sc.ring }}/>
        </div>

        {/* Questions */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'24px 0' }}>
            <div style={{ width:28, height:28, border:`3px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
          </div>
        ) : answers && answers.length > 0 ? (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:C.sub, marginBottom:4 }}>
              Détail des {answers.length} questions
            </p>
            {answers.map((a, i) => (
              <motion.div key={i} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.025 }}
                style={{ borderRadius:12, border:`1.5px solid ${a.isCorrect?'#a7f3d0':'#fecaca'}`,
                  background: a.isCorrect ? '#ecfdf5' : '#fef2f2', padding:'10px 12px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <div style={{ flexShrink:0, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginTop:1,
                    background: a.isCorrect ? '#10b981' : '#f87171' }}>
                    {a.isCorrect
                      ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:C.text, lineHeight:1.5 }}>
                      <span style={{ color:C.sub, marginRight:4 }}>Q{i+1}.</span>
                      {a.questionText || `Question ${i+1}`}
                    </p>
                    <div style={{ marginTop:6, display:'flex', flexDirection:'column', gap:4 }}>
                      <p style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:8,
                        background: a.isCorrect ? '#d1fae5' : '#fee2e2',
                        color: a.isCorrect ? '#065f46' : '#991b1b',
                        textDecoration: a.isCorrect ? 'none' : 'line-through', opacity: a.isCorrect ? 1 : 0.7 }}>
                        Ta réponse : {a.selectedText || '—'}
                      </p>
                      {!a.isCorrect && a.correctText && (
                        <p style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:8, background:'#d1fae5', color:'#065f46' }}>
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
          <p style={{ fontSize:12, color:C.sub, textAlign:'center', padding:'16px 0' }}>Détail des questions non disponible</p>
        )}

        {/* Refaire */}
        {item.quizId && (
          <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.97 }}
            onClick={e => { e.stopPropagation(); navigate(`/dashboard/quiz/${item.quizId}`); }}
            style={{ marginTop:16, width:'100%', padding:'12px 0', borderRadius:14, border:'none', cursor:'pointer',
              background:`linear-gradient(135deg,${C.indigo},${C.violet})`,
              color:'#fff', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow:clay.btn(C.indigo,'#3730a3') }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refaire ce quiz
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function History() {
  const { token }  = useAuth();
  const navigate   = useNavigate();
  const [history,   setHistory]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [sort,      setSort]      = useState('date');
  const [openId,    setOpenId]    = useState(null);

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
    return { total:history.length, avg, best, above80 };
  }, [history]);

  const semesters = useMemo(() => [...new Set(history.map(h => h.semester).filter(Boolean))].sort(), [history]);

  const filtered = useMemo(() => {
    let list = history.filter(h => {
      const q           = search.toLowerCase();
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
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg }}>
        <div style={{ width:32, height:32, border:`4px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div style={{ background:'linear-gradient(135deg,#4338ca 0%,#7C3AED 55%,#EC4899 100%)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 20%,rgba(255,255,255,0.18),transparent 60%)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
            style={{ position:'relative', padding:'28px 24px 28px' }}>
            <p style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.55)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>NursesPrep · IFSI</p>
            <h1 className="nunito" style={{ fontSize:28, fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:4 }}>Mes résultats</h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', marginBottom:20 }}>Clique sur un quiz pour voir le détail question par question</p>

            {stats && (
              <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
                {[
                  { n:stats.total,     l:'Quiz terminés', c:'#fff' },
                  { n:`${stats.avg}%`, l:'Score moyen',   c:'#c4b5fd' },
                  { n:`${stats.best}%`,l:'Meilleur',      c:'#6ee7b7' },
                  { n:stats.above80,   l:'Score ≥ 80%',   c:'#fcd34d' },
                ].map((s, i) => (
                  <motion.div key={s.l} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.1 + i*0.06 }}>
                    <p className="nunito" style={{ fontSize:22, fontWeight:900, color:s.c, lineHeight:1 }}>{s.n}</p>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{s.l}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────────────── */}
        <div style={{ padding:'24px 16px' }}>

          {/* Graphique de progression */}
          {chartData.length >= 2 && (
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              style={{ background:C.card, borderRadius:24, boxShadow:clay.card, border:`1.5px solid ${C.border}`,
                padding:'20px 20px 18px', marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                <div>
                  <h2 className="nunito" style={{ fontSize:15, fontWeight:800, color:C.text }}>Progression</h2>
                  <p style={{ fontSize:12, color:C.sub, marginTop:2 }}>Tes {Math.min(chartData.length,12)} derniers quiz</p>
                </div>
                <span style={{ fontSize:10, fontWeight:600, color:C.sub, background:C.bg, border:`1.5px solid ${C.border}`, padding:'6px 12px', borderRadius:20 }}>
                  Survole une barre
                </span>
              </div>
              <ProgressChart data={chartData}/>
            </motion.div>
          )}

          {/* Filtres */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:16 }}>
            <div style={{ flex:1, minWidth:180, position:'relative' }}>
              <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.sub }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un quiz…"
                style={{ width:'100%', paddingLeft:36, paddingRight:14, paddingTop:10, paddingBottom:10,
                  borderRadius:12, border:`1.5px solid ${C.border}`, background:C.card, boxShadow:clay.sm,
                  fontSize:13, color:C.text, outline:'none', boxSizing:'border-box' }}/>
            </div>
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
              style={{ padding:'10px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, background:C.card,
                boxShadow:clay.sm, fontSize:13, color:C.text, outline:'none', cursor:'pointer' }}>
              <option value="">Tous les semestres</option>
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ padding:'10px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, background:C.card,
                boxShadow:clay.sm, fontSize:13, color:C.text, outline:'none', cursor:'pointer' }}>
              <option value="date">Plus récent</option>
              <option value="score_desc">Meilleur score</option>
              <option value="score_asc">Score le plus bas</option>
            </select>
          </div>

          {filtered.length > 0 && (
            <p style={{ fontSize:12, color:C.sub, marginBottom:14 }}>
              {filtered.length} quiz affiché{filtered.length>1?'s':''}{(search||filterSem)?' (filtré)':''} ·{' '}
              <span style={{ color:C.indigo }}>clique pour voir le détail</span>
            </p>
          )}

          {/* Liste */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', padding:'80px 24px' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
              <p style={{ fontWeight:700, color:C.text, fontSize:15 }}>
                {history.length === 0 ? "Aucun quiz terminé pour l'instant" : 'Aucun résultat pour cette recherche'}
              </p>
              {history.length === 0 && (
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={() => navigate('/dashboard/quiz')}
                  style={{ marginTop:16, padding:'12px 24px', borderRadius:14, border:'none', cursor:'pointer',
                    background:`linear-gradient(135deg,${C.indigo},${C.violet})`,
                    color:'#fff', fontSize:13, fontWeight:700, boxShadow:clay.btn(C.indigo,'#3730a3') }}>
                  Faire mon premier quiz
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {filtered.map((item, i) => {
                const diff   = DIFF[item.difficulty] || DIFF.medium;
                const sc     = scoreColor(item.pct);
                const isOpen = openId === item._id;
                return (
                  <motion.div key={item._id}
                    initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay: i<10 ? i*0.04 : 0 }}
                    style={{ background:C.card, borderRadius:20, overflow:'hidden',
                      boxShadow: isOpen ? clay.open : clay.card,
                      border:`1.5px solid ${isOpen ? C.indigo+'50' : C.border}`,
                      transition:'box-shadow 0.2s, border-color 0.2s' }}>

                    <button onClick={() => setOpenId(isOpen ? null : item._id)}
                      style={{ width:'100%', padding:'14px 18px', display:'flex', alignItems:'center', gap:14,
                        cursor:'pointer', textAlign:'left', background:'transparent', border:'none' }}>

                      <ScoreRing pct={item.pct}/>

                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:4 }}>
                          {item.semester && (
                            <span style={{ fontSize:10, fontWeight:700, color:C.indigo, background:`${C.indigo}14`, padding:'2px 8px', borderRadius:20 }}>{item.semester}</span>
                          )}
                          {item.difficulty && (
                            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:diff.bg, color:diff.text }}>{diff.label}</span>
                          )}
                        </div>
                        <p style={{ fontSize:13, fontWeight:700, color:isOpen ? C.indigo : C.text,
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color 0.2s' }}>{item.title}</p>
                        <p style={{ fontSize:11, color:C.sub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:2 }}>
                          {item.category}{item.chapter ? ` · ${item.chapter}` : ''}
                        </p>
                      </div>

                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:13, fontWeight:800, color:sc.text }}>{item.score}/{item.total}</div>
                        <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{fmtDate(item.completedAt)}</div>
                      </div>

                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration:0.25 }}
                        style={{ flexShrink:0, width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
                          background: isOpen ? `${C.indigo}14` : C.bg, color: isOpen ? C.indigo : C.sub,
                          transition:'background 0.2s, color 0.2s' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <QuizAccordion item={item} token={token} navigate={navigate} isOpen={isOpen}/>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
