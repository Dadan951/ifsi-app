import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';

/* ─── Palette ───────────────────────────────────────────────────────────────── */
const PALETTE = [
  { from: '#6366f1', to: '#8b5cf6', emoji: '🧠' },
  { from: '#0891b2', to: '#0284c7', emoji: '💊' },
  { from: '#059669', to: '#047857', emoji: '🩺' },
  { from: '#dc2626', to: '#db2777', emoji: '❤️' },
  { from: '#ea580c', to: '#d97706', emoji: '🔥' },
  { from: '#7c3aed', to: '#6d28d9', emoji: '🏥' },
  { from: '#0f766e', to: '#0891b2', emoji: '🔬' },
  { from: '#be185d', to: '#9333ea', emoji: '📋' },
];

function ChevronRight({ className = '' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3 h-3"/>}
          {item.onClick
            ? <button onClick={item.onClick} className="hover:text-blue-600 transition font-medium">{item.label}</button>
            : <span className="text-slate-700 font-semibold">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  );
}

/* ─── Swipe Card ────────────────────────────────────────────────────────────── */
function SwipeCard({ card, isTop, stackOffset, onSwipe, palette, swipeTrigger }) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 180], [-22, 22]);
  const rightOpacity = useTransform(x, [0, 80], [0, 1]);
  const leftOpacity  = useTransform(x, [-80, 0], [1, 0]);
  const cardOpacity  = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const swipingRef = useRef(false);

  /* Trigger swipe from buttons */
  useEffect(() => {
    if (!swipeTrigger || !isTop || swipingRef.current) return;
    if (!flipped) return;
    swipingRef.current = true;
    const target = swipeTrigger === 'right' ? 350 : -350;
    animate(x, target, { duration: 0.35, ease: 'easeIn' }).then(() => {
      onSwipe(swipeTrigger);
    });
  }, [swipeTrigger]); // eslint-disable-line

  const handleDragEnd = (_, info) => {
    if (!flipped || swipingRef.current) return;
    const threshold = 100;
    if (info.offset.x > threshold) {
      swipingRef.current = true;
      animate(x, 350, { duration: 0.3, ease: 'easeIn' }).then(() => onSwipe('right'));
    } else if (info.offset.x < -threshold) {
      swipingRef.current = true;
      animate(x, -350, { duration: 0.3, ease: 'easeIn' }).then(() => onSwipe('left'));
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 });
    }
  };

  if (!isTop) {
    return (
      <div
        className="absolute inset-0 rounded-3xl bg-white border border-slate-200"
        style={{
          transform: `translateY(${stackOffset * -10}px) scale(${1 - stackOffset * 0.06})`,
          zIndex: 10 - stackOffset,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl cursor-pointer select-none"
      style={{ x, rotate, opacity: cardOpacity, zIndex: 20 }}
      drag={flipped ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onClick={() => { if (!flipped && !swipingRef.current) setFlipped(true); }}
    >
      {/* 3D flip inner */}
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(.4,0,.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── FRONT ── */}
        <div className="absolute inset-0 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}>
          <div className="h-1.5 flex-shrink-0" style={{ background: `linear-gradient(90deg,${palette.from},${palette.to})` }}/>
          <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
            <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ background: `linear-gradient(135deg,${palette.from},${palette.to})` }}>
              {card.category}
            </span>
            <span className="text-3xl">{palette.emoji}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
            <p className="text-lg font-bold text-slate-800 text-center leading-relaxed">{card.front}</p>
          </div>
          <div className="flex items-center justify-center gap-2 pb-5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: palette.from }}/>
            <p className="text-xs text-slate-400 font-medium">Toucher pour révéler la réponse</p>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="absolute inset-0 rounded-3xl flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(135deg,${palette.from},${palette.to})`,
          }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-3xl"/>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-black/10 blur-3xl"/>
          </div>
          <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0 relative">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">Réponse</span>
            <span className="text-3xl">{palette.emoji}</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-6 py-4 relative">
            <p className="text-base text-white text-center leading-relaxed font-semibold whitespace-pre-line">{card.back}</p>
          </div>
          {card.hint && (
            <p className="text-xs text-white/70 text-center px-5 pb-2 italic relative">💡 {card.hint}</p>
          )}
          <div className="flex items-center justify-center gap-2 pb-5 flex-shrink-0 relative">
            <p className="text-xs text-white/70 font-medium">Swipe ← ou → pour continuer</p>
          </div>
        </div>
      </div>

      {/* ── Indicateurs swipe ── */}
      <motion.div
        className="absolute inset-0 rounded-3xl flex items-center justify-start pl-8 pointer-events-none"
        style={{ opacity: rightOpacity, background: 'rgba(34,197,94,0.15)', border: '3px solid #22c55e' }}>
        <span className="text-5xl font-black text-green-500" style={{ transform: 'rotate(12deg)' }}>✓</span>
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-3xl flex items-center justify-end pr-8 pointer-events-none"
        style={{ opacity: leftOpacity, background: 'rgba(239,68,68,0.15)', border: '3px solid #ef4444' }}>
        <span className="text-5xl font-black text-red-500" style={{ transform: 'rotate(-12deg)' }}>✗</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Result Screen ─────────────────────────────────────────────────────────── */
function ResultScreen({ known, unknown, total, onRestart, onExit }) {
  const pct = Math.round((known / total) * 100);
  const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-8 px-4 text-center"
    >
      <div className="text-6xl mb-4">
        {pct >= 80 ? '🏆' : pct >= 50 ? '💪' : '📚'}
      </div>
      <div className="flex gap-1 mb-4">
        {[1,2,3].map(i => (
          <span key={i} className="text-3xl" style={{ filter: i <= stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">
        {pct >= 80 ? 'Excellent !' : pct >= 50 ? 'Bien joué !' : 'Continue à réviser !'}
      </h2>
      <p className="text-slate-400 text-sm mb-8">{total} cartes passées en revue</p>

      <div className="flex gap-4 mb-8 w-full max-w-xs">
        <div className="flex-1 bg-green-50 border border-green-200 rounded-2xl py-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-green-600">{known}</span>
          <span className="text-xs text-green-500 font-medium mt-1">✓ Sus</span>
        </div>
        <div className="flex-1 bg-red-50 border border-red-200 rounded-2xl py-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-red-500">{unknown}</span>
          <span className="text-xs text-red-400 font-medium mt-1">✗ À retravailler</span>
        </div>
        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-2xl py-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600">{pct}%</span>
          <span className="text-xs text-blue-400 font-medium mt-1">Score</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full max-w-xs mb-8">
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="h-3 rounded-full"
            style={{ background: pct >= 80 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : pct >= 50 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#ef4444,#dc2626)' }}
          />
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <button onClick={onRestart}
          className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)', boxShadow: '0 4px 14px rgba(8,145,178,0.35)' }}>
          🔄 Recommencer
        </button>
        <button onClick={onExit}
          className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition hover:-translate-y-0.5">
          ← Retour
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Swipe Game ────────────────────────────────────────────────────────────── */
function SwipeGame({ cards, onExit, onReviewed }) {
  const total = cards.length;
  const [stack, setStack] = useState(() => [...cards].reverse());
  const [known, setKnown]   = useState(0);
  const [unknown, setUnknown] = useState(0);
  const [done, setDone]     = useState(false);
  const [swipeTrigger, setSwipeTrigger] = useState(null);
  const triggerRef = useRef(null);

  const done_count = total - stack.length;
  const progress = (done_count / total) * 100;

  const handleSwipe = useCallback((dir) => {
    setSwipeTrigger(null);
    if (dir === 'right') {
      setKnown(k => k + 1);
      axios.post(`${API_URL}/flashcards/reviewed`).catch(() => {});
      onReviewed();
    } else {
      setUnknown(u => u + 1);
    }
    setStack(s => {
      const next = s.slice(0, -1);
      if (next.length === 0) setDone(true);
      return next;
    });
  }, [onReviewed]);

  const triggerSwipe = (dir) => {
    setSwipeTrigger(dir);
    // reset after a tick so it can trigger again
    triggerRef.current = setTimeout(() => setSwipeTrigger(null), 600);
  };

  useEffect(() => () => clearTimeout(triggerRef.current), []);

  const handleRestart = () => {
    setStack([...cards].reverse());
    setKnown(0);
    setUnknown(0);
    setDone(false);
    setSwipeTrigger(null);
  };

  if (done) {
    return <ResultScreen known={known} unknown={unknown} total={total} onRestart={handleRestart} onExit={onExit} />;
  }

  const topCard = stack[stack.length - 1];
  const visibleStack = stack.slice(-3);

  return (
    <div className="flex flex-col items-center">
      {/* Progress */}
      <div className="w-full max-w-sm mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium">{done_count} / {total} cartes</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-2.5 rounded-full"
            style={{ background: 'linear-gradient(90deg,#164e8a,#0891b2)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-bold text-red-400">✗ {unknown}</span>
          <span className="text-xs font-bold text-green-500">✓ {known}</span>
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-slate-400 mb-5 text-center">
        👆 Touche pour retourner · <span className="text-red-400 font-bold">←</span> Je ne savais pas · <span className="text-green-500 font-bold">→</span> Je savais !
      </p>

      {/* Card Stack */}
      <div className="relative w-full max-w-sm" style={{ height: 380 }}>
        <AnimatePresence>
          {visibleStack.map((card, i) => {
            const isTop = card._id === topCard._id;
            const offset = visibleStack.length - 1 - i;
            return (
              <SwipeCard
                key={card._id + '-' + stack.length}
                card={card}
                isTop={isTop}
                stackOffset={offset}
                onSwipe={handleSwipe}
                palette={PALETTE[cards.indexOf(card) % PALETTE.length]}
                swipeTrigger={isTop ? swipeTrigger : null}
              />
            );
          })}
        </AnimatePresence>

        {stack.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-400 text-sm">Chargement...</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-8 mt-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => triggerSwipe('left')}
          className="w-16 h-16 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition-colors"
        >
          ✗
        </motion.button>

        <div className="text-center">
          <p className="text-xs text-slate-400 font-medium">{stack.length} restante{stack.length > 1 ? 's' : ''}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => triggerSwipe('right')}
          className="w-16 h-16 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center text-2xl shadow-md hover:shadow-lg transition-colors"
        >
          ✓
        </motion.button>
      </div>

      <p className="text-xs text-slate-300 mt-4">Retourne la carte avant de swiper</p>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Flashcards() {
  const [cards, setCards]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedUE, setSelectedUE]             = useState(null);
  const [selectedChapter, setSelectedChapter]   = useState(null);
  const [reviewedCount, setReviewedCount]       = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/flashcards`).then(r => setCards(r.data)).finally(() => setLoading(false));
  }, []);

  const structure = {};
  cards.forEach(c => {
    const sem  = (c.semester  || 'Non classé').trim();
    const ue   = (c.category  || 'Autre').trim();
    const chap = (c.chapter   || 'Général').trim();
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(c);
  });

  const semesters    = Object.keys(structure).sort();
  const ues          = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const chapters     = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentCards = (selectedSemester && selectedUE && selectedChapter)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];
  const totalInUE    = (selectedSemester && selectedUE)
    ? Object.values(structure[selectedSemester]?.[selectedUE] || {}).flat().length : 0;
  const totalCards   = cards.length;

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Flashcards</h1>
              <p className="text-blue-200/70 text-sm">Mémorisez les notions clés par répétition espacée</p>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-white">{totalCards}</p>
                <p className="text-xs text-blue-300/70">Cartes</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{semesters.length}</p>
                <p className="text-xs text-blue-300/70">Semestres</p>
              </div>
              {reviewedCount > 0 && (
                <div>
                  <p className="text-xl font-bold text-emerald-400">{reviewedCount}</p>
                  <p className="text-xs text-blue-300/70">Révisées</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 bg-slate-50 min-h-full">
          <AnimatePresence mode="wait">

            {/* SEMESTERS */}
            {view === 'semesters' && (
              <motion.div key="sems"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}>
                {semesters.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <div className="text-5xl mb-3">🃏</div>
                    <p className="font-semibold">Aucune flashcard disponible</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {semesters.map((sem, idx) => {
                      const pal     = PALETTE[idx % PALETTE.length];
                      const ueCount = Object.keys(structure[sem]).length;
                      const total   = Object.values(structure[sem]).flatMap(ue => Object.values(ue)).flat().length;
                      return (
                        <motion.button key={sem}
                          onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                          whileHover={{ y: -6, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                          style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                        >
                          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-black/10 blur-xl"/>
                          <div className="text-4xl mb-4">{pal.emoji}</div>
                          <h3 className="font-bold text-white text-base mb-1 leading-snug">{sem}</h3>
                          <p className="text-white/75 text-xs mb-4">{ueCount} UE · {total} carte{total > 1 ? 's' : ''}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {Array.from({ length: Math.min(ueCount, 5) }).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"/>
                              ))}
                            </div>
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                              <ChevronRight className="text-white"/>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* UEs */}
            {view === 'ues' && selectedSemester && (
              <motion.div key="ues-view"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}>
                <Breadcrumb items={[
                  { label: 'Flashcards', onClick: () => { setSelectedSemester(null); setView('semesters'); } },
                  { label: selectedSemester }
                ]}/>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800">{selectedSemester}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{ues.length} unité{ues.length > 1 ? 's' : ''} d'enseignement</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ues.map((ue, idx) => {
                    const pal     = PALETTE[idx % PALETTE.length];
                    const total   = Object.values(structure[selectedSemester][ue]).flat().length;
                    const chCount = Object.keys(structure[selectedSemester][ue]).length;
                    return (
                      <motion.button key={ue}
                        onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                        style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                      >
                        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"/>
                        <div className="text-3xl mb-3">{pal.emoji}</div>
                        <h3 className="font-bold text-white text-sm mb-1 leading-snug">{ue}</h3>
                        <p className="text-white/75 text-xs mb-3">{chCount} chapitre{chCount > 1 ? 's' : ''} · {total} carte{total > 1 ? 's' : ''}</p>
                        <div className="flex justify-end">
                          <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                            <ChevronRight className="text-white"/>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* CHAPTERS */}
            {view === 'chapters' && selectedSemester && selectedUE && (
              <motion.div key="chaps"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}>
                <Breadcrumb items={[
                  { label: 'Flashcards', onClick: () => { setSelectedSemester(null); setSelectedUE(null); setView('semesters'); } },
                  { label: selectedSemester, onClick: () => { setSelectedUE(null); setView('ues'); } },
                  { label: selectedUE }
                ]}/>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800">{selectedUE}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{totalInUE} carte{totalInUE > 1 ? 's' : ''} disponible{totalInUE > 1 ? 's' : ''}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapters.map((chap, idx) => {
                    const pal   = PALETTE[idx % PALETTE.length];
                    const count = structure[selectedSemester][selectedUE][chap].length;
                    return (
                      <motion.button key={chap}
                        onClick={() => { setSelectedChapter(chap); setView('cards'); }}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all text-left group flex items-center gap-4 shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                          style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                          {pal.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-sm truncate">{chap}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{count} carte{count > 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-slate-300 group-hover:text-blue-500 transition flex-shrink-0">
                          <ChevronRight/>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* SWIPE GAME */}
            {view === 'cards' && selectedSemester && selectedUE && selectedChapter && (
              <motion.div key="cards-view"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}>
                <Breadcrumb items={[
                  { label: 'Flashcards', onClick: () => { setSelectedSemester(null); setSelectedUE(null); setSelectedChapter(null); setView('semesters'); } },
                  { label: selectedSemester, onClick: () => { setSelectedUE(null); setSelectedChapter(null); setView('ues'); } },
                  { label: selectedUE, onClick: () => { setSelectedChapter(null); setView('chapters'); } },
                  { label: selectedChapter }
                ]}/>
                <SwipeGame
                  key={selectedChapter}
                  cards={currentCards}
                  onExit={() => setView('chapters')}
                  onReviewed={() => setReviewedCount(c => c + 1)}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
