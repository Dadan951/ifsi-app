'use strict';
const AdmZip = require('adm-zip');
const Annale = require('../models/Annale');

/* ─── Mapping UE → label complet ─────────────────────────────────────────── */
const UE_LABELS = {
  '1.1':  'UE 1.1 — Psychologie, sociologie, anthropologie',
  '1.2':  'UE 1.2 — Santé publique et économie de la santé',
  '1.3':  'UE 1.3 — Législation, éthique, déontologie',
  '2.1':  'UE 2.1 — Biologie fondamentale',
  '2.2':  'UE 2.2 — Cycles de la vie et grandes fonctions',
  '2.3':  'UE 2.3 — Santé, maladie, handicap, accidents de la vie',
  '2.4':  'UE 2.4 — Processus traumatiques',
  '2.5':  'UE 2.5 — Processus infectieux et inflammatoires',
  '2.6':  'UE 2.6 — Processus psychopathologiques',
  '2.7':  'UE 2.7 — Défaillances organiques et processus dégénératifs',
  '2.8':  'UE 2.8 — Processus obstructifs',
  '2.10': 'UE 2.10 — Infectiologie, hygiène',
  '2.11': 'UE 2.11 — Pharmacologie et thérapeutique',
  '3.4':  'UE 3.4 — Initiation à la démarche de recherche',
};

// Détecte si un buffer est un PDF (magic bytes %PDF)
function isPDF(buf) {
  return buf.length > 4 && buf.slice(0, 4).toString('ascii') === '%PDF';
}

// Extrait le code UE depuis un nom de fichier ou de dossier
// Ex: "2.5", "2(1).5", "Eval UE 2.7 S4 Session 1 2019..."
function parseUECode(name) {
  // Cas "2(1).5" ou "1(1).2" → "2.5" / "1.2"
  let m = name.match(/^\d+\(\d+\)\.(\d+)$/);
  if (m) {
    const prefix = name.match(/^(\d+)/)[1];
    return `${prefix}.${m[1]}`;
  }
  // Cas "2.5", "1.3", "2.11"
  m = name.match(/^(\d+\.\d+)$/);
  if (m) return m[1];
  // Cas dans un nom de fichier long: "UE 2.7", "UE1.3", "UE 2.11"
  m = name.match(/[Uu][Ee]\s*(\d+\.\d+)/);
  if (m) return m[1];
  return null;
}

// Nettoie l'année (dossier)
function parseYear(folder) {
  // "2018 - 2019 " → "2018-2019", "2024 - 2025_" → "2024-2025"
  return folder.replace(/[_\s]+$/,'').replace(/\s*-\s*/,'-').trim();
}

// Déduit le semestre 1A/2A depuis le dossier parent
function parseSemestre(annee) {
  if (annee === '1An') return '1ère année';
  if (annee === '2An') return '2ème année';
  if (annee === '3An') return '3ème année';
  return annee;
}

// Construit un titre lisible
function buildTitle(ueCode, year, ifsi, filename) {
  const label = UE_LABELS[ueCode] || `UE ${ueCode}`;
  const base  = filename
    ? filename.replace(/\.pdf$/i,'').replace(/[-_]+/g,' ').trim()
    : label;
  // Si le filename est juste le code UE, on enrichit
  const isJustCode = /^\d+(\(\d+\))?\.[\d]+$/.test(filename.replace(/\.pdf$/i,''));
  if (isJustCode) {
    return `${label}${ifsi ? ' — ' + ifsi : ''}${year ? ' ' + year : ''}`;
  }
  return base;
}

module.exports = async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, message: 'Aucun fichier ZIP reçu' });

  const log = [];
  let inserted = 0, skipped = 0, errors = 0;

  try {
    const zip     = new AdmZip(req.file.buffer);
    const entries = zip.getEntries();

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const entryName = entry.entryName.replace(/\\/g, '/');
      const parts     = entryName.split('/');

      // On ne prend que ce qui est dans Annales/
      if (!parts.includes('Annales')) continue;

      const ai       = parts.indexOf('Annales');
      const anneeStr = parts[ai + 1] || '';   // "1An", "2An", "3An"
      const yearStr  = parts[ai + 2] || '';   // "2018 - 2019 " ou fichier direct
      const ifsiStr  = parts[ai + 3] || '';   // "Paris cité " ou fichier direct
      const filename = parts[parts.length - 1];

      // Vérifier que c'est un PDF (par extension ou magic bytes)
      const hasPdfExt = filename.toLowerCase().endsWith('.pdf');
      const buf       = entry.getData();
      if (!hasPdfExt && !isPDF(buf)) continue;  // ni extension ni magic bytes → skip

      // Déterminer UE depuis le nom de fichier (ou le dossier si filename = code UE)
      const ueCode = parseUECode(filename.replace(/\.pdf$/i,'')) || parseUECode(ifsiStr.trim());
      if (!ueCode) {
        log.push(`⚠ UE non détectée : ${entryName}`);
        continue;
      }

      // Construire les métadonnées
      // Structure 1An : Annales/1An/[year]/[ifsi]/[file]
      // Structure 2An : Annales/2An/[file ou year/file]
      let year, ifsi, semester;
      if (anneeStr === '1An' && yearStr && ifsiStr) {
        year     = parseYear(yearStr);
        ifsi     = ifsiStr.replace(/_+$/,'').trim();
        semester = '1ère année';
      } else if (anneeStr === '2An') {
        year     = yearStr && !yearStr.toLowerCase().endsWith('.pdf') ? parseYear(yearStr) : '2018-2019';
        ifsi     = '';
        semester = '2ème année';
      } else {
        year     = parseYear(yearStr) || '';
        ifsi     = '';
        semester = parseSemestre(anneeStr);
      }

      const subject = UE_LABELS[ueCode] || `UE ${ueCode}`;
      const title   = buildTitle(ueCode, year, ifsi, filename);

      // Doublon ?
      const exists = await Annale.findOne({ title, year: year || '?' }).lean();
      if (exists) {
        skipped++;
        log.push(`⊘ Doublon : ${title}`);
        continue;
      }

      try {
        await Annale.create({
          title,
          year:        year || 'N/A',
          semester,
          subject,
          description: ifsi ? `IFSI ${ifsi}` : '',
          fileData:    buf,
          fileMimeType:'application/pdf',
          fileName:    hasPdfExt ? filename : filename + '.pdf',
          fileSize:    buf.length,
          hasFile:     true,
          isPublished: true,
        });

        inserted++;
        log.push(`✓ [${semester}] ${subject} — ${year}${ifsi ? ' / ' + ifsi : ''}`);
        console.log(`[SeedAnnales] ✓ ${title}`);
      } catch (e) {
        errors++;
        log.push(`✗ ERREUR ${title} : ${e.message}`);
        console.error(`[SeedAnnales] ✗ ${title}:`, e.message);
      }
    }

    res.json({
      ok: true,
      message: `${inserted} annales importées, ${skipped} doublons, ${errors} erreurs`,
      inserted, skipped, errors, log,
    });
  } catch (err) {
    console.error('[SeedAnnales ZIP]', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
