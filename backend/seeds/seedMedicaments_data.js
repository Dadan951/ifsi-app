/**
 * seedMedicaments_data.js
 * 10 classes × 10 médicaments = 100 médicaments au total
 */

const p1 = require('./seedMed_p1');
const p2 = require('./seedMed_p2');
const p3 = require('./seedMed_p3');

/* ─── 10 Classes ──────────────────────────────────────────────────────────── */
const CLASSES = [
  { name: 'Antibiotiques — Pénicillines',          description: 'Antibiotiques bactéricides de la famille des bêta-lactamines agissant sur la paroi bactérienne.',   color: '#16a34a', icon: '🦠' },
  { name: 'Anti-inflammatoires non stéroïdiens',   description: 'AINS : inhibiteurs des COX-1 et COX-2, antalgiques, antipyrétiques et anti-inflammatoires.',        color: '#ea580c', icon: '🔥' },
  { name: 'Analgésiques — Antipyrétiques',          description: 'Antalgiques du palier I au palier III et antidotes opioïdes.',                                       color: '#7c3aed', icon: '💊' },
  { name: 'Inhibiteurs de l\'enzyme de conversion', description: 'IEC : antihypertenseurs bloquant la conversion angiotensine I → II, cardio et néphroprotecteurs.', color: '#0891b2', icon: '❤️' },
  { name: 'Anticoagulants',                         description: 'Prévention et traitement des thromboses : HNF, HBPM, AVK et anticoagulants oraux directs (AOD).',   color: '#dc2626', icon: '🩸' },
  { name: 'Corticoïdes',                            description: 'Glucocorticoïdes et minéralocorticoïdes de synthèse : anti-inflammatoires et immunosuppresseurs.',  color: '#d97706', icon: '⚡' },
  { name: 'Diurétiques',                            description: 'Médicaments augmentant la production urinaire : diurétiques de l\'anse, thiazidiques, épargneurs K+.', color: '#0369a1', icon: '💧' },
  { name: 'Benzodiazépines',                        description: 'Psychotropes agonistes GABA-A : anxiolytiques, hypnotiques, antiépileptiques, myorelaxants.',      color: '#6d28d9', icon: '🧠' },
  { name: 'Antidiabétiques',                        description: 'Médicaments du diabète de type 1 et 2 : biguanides, sulfonylurées, gliptines, SGLT-2, GLP-1, insulines.', color: '#059669', icon: '🩺' },
  { name: 'Antidépresseurs',                        description: 'ISRS, IRSN, NaSSA et tricycliques : traitements des dépressions, anxiétés et douleurs neuropathiques.', color: '#db2777', icon: '🌸' },
];

/* ─── Médicament existant (le 1er de chaque classe, déjà créé avant) ─────── */
const { makeSections } = (() => {
  function makeSections(general, mediasNote, sourceNote) {
    return [
      { title: 'Général', content: general,    order: 0 },
      { title: 'Médias',  content: mediasNote, order: 1 },
      { title: 'Source',  content: sourceNote, order: 2 },
    ];
  }
  return { makeSections };
})();

const drug1PerClass = require('./seedMedicaments_data_originals');

/* ─── Merge : 1 existant + 9 nouveaux par classe ─────────────────────────── */
const DRUGS_DATA = [
  // Classe 0 — Antibiotiques
  drug1PerClass[0], ...p1.antibiotiques,
  // Classe 1 — AINS
  drug1PerClass[1], ...p1.ains,
  // Classe 2 — Analgésiques
  drug1PerClass[2], ...p1.analgesiques,
  // Classe 3 — IEC
  drug1PerClass[3], ...p2.iec,
  // Classe 4 — Anticoagulants
  drug1PerClass[4], ...p2.anticoagulants,
  // Classe 5 — Corticoïdes
  drug1PerClass[5], ...p2.corticoides,
  // Classe 6 — Diurétiques
  drug1PerClass[6], ...p3.diuretiques,
  // Classe 7 — Benzodiazépines
  drug1PerClass[7], ...p3.benzodiazepines,
  // Classe 8 — Antidiabétiques
  drug1PerClass[8], ...p3.antidiabetiques,
  // Classe 9 — Antidépresseurs
  drug1PerClass[9], ...p3.antidepresseurs,
];

module.exports = { CLASSES, DRUGS_DATA };
