/**
 * Données : 10 classes + 10 médicaments (1 par classe)
 * Sections : Général · Médias · Source
 */

const CLASSES = [
  { name: 'Antibiotiques — Pénicillines',          description: 'Antibiotiques bactéricides de la famille des bêta-lactamines agissant sur la paroi bactérienne.', color: '#16a34a', icon: '🦠' },
  { name: 'Anti-inflammatoires non stéroïdiens',   description: 'AINS : inhibiteurs des cyclo-oxygénases (COX-1 et COX-2), antalgiques, antipyrétiques et anti-inflammatoires.', color: '#ea580c', icon: '🔥' },
  { name: 'Analgésiques — Antipyrétiques',          description: 'Médicaments de la douleur légère à modérée et de la fièvre, sans propriété anti-inflammatoire.', color: '#7c3aed', icon: '💊' },
  { name: 'Inhibiteurs de l\'enzyme de conversion', description: 'IEC : antihypertenseurs bloquant la conversion angiotensine I → II, vasodilatateurs et cardioprotecteurs.', color: '#0891b2', icon: '❤️' },
  { name: 'Anticoagulants',                         description: 'Médicaments prévenant et traitant la formation de caillots dans les vaisseaux sanguins.', color: '#dc2626', icon: '🩸' },
  { name: 'Corticoïdes',                            description: 'Dérivés synthétiques du cortisol aux puissantes propriétés anti-inflammatoires et immunosuppressives.', color: '#d97706', icon: '⚡' },
  { name: 'Diurétiques de l\'anse',                 description: 'Diurétiques puissants inhibant le co-transporteur Na⁺/K⁺/2Cl⁻ au niveau de l\'anse de Henle.', color: '#0369a1', icon: '💧' },
  { name: 'Benzodiazépines',                        description: 'Psychotropes anxiolytiques, hypnotiques et antiépileptiques agissant sur les récepteurs GABA-A.', color: '#6d28d9', icon: '🧠' },
  { name: 'Antidiabétiques biguanides',             description: 'Antidiabétiques oraux diminuant la production hépatique de glucose et améliorant la sensibilité à l\'insuline.', color: '#059669', icon: '🩺' },
  { name: 'Antidépresseurs ISRS',                   description: 'Inhibiteurs Sélectifs de la Recapture de la Sérotonine : antidépresseurs de première intention.', color: '#db2777', icon: '🌸' },
];

/* ─────────────────────────────────────────────────────────────────
   Helper pour construire les 3 sections standard
   ───────────────────────────────────────────────────────────────── */
function makeSections(general, mediasNote, sourceNote) {
  return [
    {
      title:   'Général',
      content: general,
      order:   0,
    },
    {
      title:   'Médias',
      content: mediasNote || 'Aucun média joint pour ce médicament.',
      order:   1,
    },
    {
      title:   'Source',
      content: sourceNote,
      order:   2,
    },
  ];
}

/* ─────────────────────────────────────────────────────────────────
   10 MÉDICAMENTS
   ───────────────────────────────────────────────────────────────── */
const DRUGS_DATA = [

  /* 1 ── AMOXICILLINE ─────────────────────────────────────────── */
  {
    classIndex:  0,
    name:        'Amoxicilline (Clamoxyl®)',
    genericName: 'Amoxicilline',
    description: 'Antibiotique bêta-lactamine de la famille des pénicillines A, bactéricide à large spectre. L\'un des antibiotiques les plus prescrits en ville et à l\'hôpital.',
    sections: makeSections(
      `**DCI :** Amoxicilline
**Noms commerciaux :** Clamoxyl®, Amoxil®, Gramidil®

**Mécanisme d'action**
Inhibe la synthèse de la paroi bactérienne en se liant aux protéines liant les pénicillines (PLP). Entraîne la lyse bactérienne. Action bactéricide.

**Indications principales**
- Infections ORL : angines à streptocoque A, otites moyennes aiguës, sinusites bactériennes
- Infections respiratoires basses : pneumonies communautaires (Streptococcus pneumoniae)
- Infections urinaires basses non compliquées (E. coli sensible)
- Éradication de Helicobacter pylori (en association)
- Prophylaxie de l'endocardite infectieuse (contexte dentaire, patient à risque)

**Posologie adulte**
- Per os : 500 mg à 1 g toutes les 8 h (1,5 à 3 g/j)
- Formes graves : jusqu'à 3 g toutes les 8 h IV
- Durée variable selon l'infection (5 à 14 jours)

**Voies d'administration :** Orale (comprimés, gélules, suspension buvable), IV, IM

**Contre-indications**
- Allergie aux pénicillines (absolue)
- Allergie aux céphalosporines (précaution, allergie croisée ~10 %)
- Mononucléose infectieuse (risque de rash cutané maculopapuleux)

**Effets indésirables**
- Troubles digestifs : nausées, diarrhées, douleurs abdominales (fréquents)
- Éruptions cutanées maculopapuleuses (surtout si MNI)
- Réactions allergiques : urticaire, angio-œdème, choc anaphylactique (rare)
- Colite à Clostridioides difficile (antibiothérapie prolongée)
- Candidoses (surinfection fongique)

**Surveillance infirmière**
- Interroger systématiquement sur les allergies avant administration
- Avoir du matériel de réanimation anaphylactique disponible (adrénaline)
- Surveiller l'apparition d'éruption cutanée, de difficultés respiratoires
- En IV : perfuser en 30 à 60 min, contrôler le point d'injection (tolérance veineuse)
- Informer le patient de prendre le traitement jusqu'au bout même si amélioration`,

      `Schéma du mécanisme d'action des pénicillines sur la paroi bactérienne disponible en cours de microbiologie.
Vidéo pédagogique : « Les bêta-lactamines en 5 minutes » — SFAR / Antibioclic (ressources en ligne).`,

      `**Références**
1. Agence Nationale de Sécurité du Médicament (ANSM) — Monographie Amoxicilline. [ansm.sante.fr]
2. Vidal — Fiche Clamoxyl®. [vidal.fr]
3. SPILF — Guide de l'antibiothérapie. 2022 Edition.
4. HAS — Recommandations de bonne pratique : Antibiothérapie par voie générale en pratique courante dans les infections respiratoires hautes de l'adulte. 2021.
5. OMS — Liste modèle des médicaments essentiels. 23ème édition, 2023.`
    ),
    sources: [
      { title: 'Monographie ANSM — Amoxicilline',          authors: 'ANSM',              year: '2023', url: 'https://ansm.sante.fr' },
      { title: 'Guide de l\'antibiothérapie — SPILF',      authors: 'SPILF',             year: '2022', url: 'https://www.infectiologie.com' },
      { title: 'Antibioclic — Outil d\'aide à la prescription', authors: 'Antibioclic', year: '2023', url: 'https://antibioclic.com' },
    ],
    tags: ['antibiotique', 'pénicilline', 'bêta-lactamine', 'ORL', 'respiratoire', 'bactéricide'],
  },

  /* 2 ── IBUPROFÈNE ───────────────────────────────────────────── */
  {
    classIndex:  1,
    name:        'Ibuprofène (Advil®)',
    genericName: 'Ibuprofène',
    description: 'AINS dérivé de l\'acide propionique. Antalgique, antipyrétique et anti-inflammatoire. Disponible sans ordonnance à faible dose.',
    sections: makeSections(
      `**DCI :** Ibuprofène
**Noms commerciaux :** Advil®, Nurofen®, Brufen®, Antarène®

**Mécanisme d'action**
Inhibition non sélective des cyclo-oxygénases COX-1 et COX-2, enzymes clés de la synthèse des prostaglandines, responsables de l'inflammation, de la douleur et de la fièvre. Réduit la synthèse de thromboxane A2 (effet antiagrégant faible).

**Indications principales**
- Douleurs légères à modérées : céphalées, dysménorrhées, douleurs dentaires, douleurs musculo-squelettiques
- États fébriles
- Poussées douloureuses d'arthrose, arthrite rhumatoïde (courte durée)
- Entorses, traumatismes bénins

**Posologie adulte**
- Automédication : 200 à 400 mg toutes les 6 à 8 h, maximum 1 200 mg/j
- Sur prescription : jusqu'à 2 400 mg/j
- Prendre au cours du repas ou avec un verre d'eau (protection gastrique)
- Ne pas dépasser 5 jours en automédication

**Voies d'administration :** Orale (comprimés, gélules, suspension), IV (usage hospitalier), rectale (suppositoires pédiatriques)

**Contre-indications**
- Ulcère gastroduodénal évolutif (absolue)
- Insuffisance rénale sévère
- Grossesse à partir du 5ème mois (24 SA) — fœtotoxicité
- Insuffisance hépatique sévère
- Asthme à l'aspirine (syndrome de Widal)
- Antécédents d'allergie aux AINS
- Association avec d'autres AINS ou l'aspirine à dose anti-inflammatoire

**Effets indésirables**
- Digestifs (fréquents) : épigastralgies, nausées, vomissements, ulcère, hémorragie digestive
- Rénaux : rétention hydrosodée, insuffisance rénale aiguë (patients à risque)
- Cardiovasculaires : HTA, risque thrombo-embolique (usage prolongé, doses élevées)
- Cutanés : urticaire, syndrome de Stevens-Johnson (rare)
- Respiratoires : bronchospasme chez les asthmatiques

**Surveillance infirmière**
- Vérifier l'absence de contre-indications avant administration (ulcère, grossesse, asthme)
- Administrer systématiquement avec de la nourriture ou un grand verre d'eau
- Surveiller la diurèse (risque de rétention hydrosodée)
- Contrôler la tension artérielle en cas de traitement prolongé
- Informer sur les signes d'alerte digestifs (douleurs épigastriques, selles noires = melæna)
- Attention aux associations médicamenteuses : AVK, anticoagulants, lithium, méthotrexate`,

      `Schémas illustrant l'inhibition des COX-1/COX-2 disponibles dans les supports de cours de pharmacologie IFSI.
Vidéo : « AINS : mécanisme, indications et risques » — CISMEF / CHU Rouen.`,

      `**Références**
1. ANSM — Monographie Ibuprofène. [ansm.sante.fr]
2. Vidal — Fiche Advil®. [vidal.fr]
3. HAS — Bon usage des AINS. Recommandations. 2019.
4. Prescrire — « Ibuprofène : effets indésirables graves à connaître ». Revue Prescrire, 2022.
5. EMA — Évaluation des risques cardiovasculaires des AINS. 2015.`
    ),
    sources: [
      { title: 'HAS — Bon usage des AINS',    authors: 'HAS',         year: '2019', url: 'https://has-sante.fr' },
      { title: 'Vidal — Advil®',              authors: 'Vidal',       year: '2023', url: 'https://vidal.fr' },
      { title: 'Revue Prescrire — Ibuprofène', authors: 'Prescrire',  year: '2022', url: 'https://prescrire.org' },
    ],
    tags: ['AINS', 'antalgique', 'antipyrétique', 'anti-inflammatoire', 'COX', 'douleur', 'fièvre'],
  },

  /* 3 ── PARACÉTAMOL ──────────────────────────────────────────── */
  {
    classIndex:  2,
    name:        'Paracétamol (Doliprane®)',
    genericName: 'Paracétamol',
    description: 'Antalgique et antipyrétique de première intention, sans propriété anti-inflammatoire. Médicament le plus vendu en France. Hépatotoxique en cas de surdosage.',
    sections: makeSections(
      `**DCI :** Paracétamol (acétaminophène en Amérique du Nord)
**Noms commerciaux :** Doliprane®, Efferalgan®, Dafalgan®, Panadol®

**Mécanisme d'action**
Mécanisme incompletement élucidé. Agit principalement au niveau central en inhibant la synthèse des prostaglandines au niveau cérébral (thermorégulation et perception de la douleur). Faible effet périphérique. N'inhibe pas les COX périphériques → pas d'effet anti-inflammatoire.

**Indications principales**
- Douleurs légères à modérées : céphalées, migraines (1ère intention), odontalgies, douleurs musculaires
- États fébriles chez l'adulte et l'enfant
- Antalgique de palier I (OMS) — utilisé seul ou en association
- Post-opératoire (analgésie multimodale)

**Posologie adulte**
- 1 g toutes les 4 à 6 h, maximum 4 g/j (adulte sain)
- Intervalle minimum entre deux prises : 4 heures
- Réduction de dose obligatoire : insuffisance hépatique (max 2 g/j), insuffisance rénale sévère, dénutrition, alcoolisme chronique (max 2 g/j)
- En IV (Perfalgan®) : 1 g en perfusion de 15 min, même posologie

**Voies d'administration :** Orale (comprimés, gélules, solution buvable, sachet), IV (Perfalgan®), rectale (suppositoires)

**Contre-indications**
- Insuffisance hépatocellulaire sévère (absolue)
- Hypersensibilité connue au paracétamol

**Effets indésirables**
- Bien toléré aux doses thérapeutiques
- HÉPATOTOXICITÉ : nécrose hépatocentrilobulaire en cas de surdosage (>10 g chez l'adulte sain, dose plus faible chez patients à risque)
- Réactions allergiques cutanées (rares)
- Agranulocytose (très rare)

**Surdosage — urgence infirmière**
- Symptômes initiaux discrets (nausées, vomissements) maquant la gravité
- Antidote : N-acétylcystéine (Mucomyst® IV) — à débuter dans les 10 h idéalement
- Bilan hépatique : ASAT, ALAT, TP
- Contacter immédiatement le SAMU/Centre Anti-Poison

**Surveillance infirmière**
- Toujours vérifier la dose totale journalière (risque de surdosage par cumul si associations)
- Signaler toute association avec paracétamol (automédication fréquente)
- En IV : contrôler la concentration de la perfusion (confusion possible entre Perfalgan® 10 mg/mL et concentrés pédiatriques)
- Éduquer le patient : ne pas dépasser 4 g/j, éviter l'alcool, respecter les intervalles
- Surveiller la coloration des urines (urines foncées = signe hépatique)`,

      `Schéma du métabolisme hépatique du paracétamol et voies de toxicité (NAPQI) — document de cours UE 2.11.
Affiche ANSM sur la prévention du surdosage au paracétamol.`,

      `**Références**
1. ANSM — Monographie Paracétamol / Doliprane®. [ansm.sante.fr]
2. Vidal — Fiche Doliprane®, Perfalgan®. [vidal.fr]
3. Agence européenne des médicaments (EMA) — Évaluation des risques liés au paracétamol. 2018.
4. Centre Anti-Poison de Paris — Protocole surdosage paracétamol. [centres-antipoison.net]
5. HAS — Stratégie de prise en charge de la douleur aiguë. 2019.`
    ),
    sources: [
      { title: 'ANSM — Monographie Paracétamol',         authors: 'ANSM',           year: '2023', url: 'https://ansm.sante.fr' },
      { title: 'Centre Anti-Poison — Protocole surdosage', authors: 'CAP Paris',    year: '2022', url: 'https://centres-antipoison.net' },
      { title: 'HAS — Douleur aiguë',                    authors: 'HAS',            year: '2019', url: 'https://has-sante.fr' },
    ],
    tags: ['antalgique', 'antipyrétique', 'palier I', 'hépatotoxicité', 'surdosage', 'N-acétylcystéine'],
  },

  /* 4 ── RAMIPRIL ─────────────────────────────────────────────── */
  {
    classIndex:  3,
    name:        'Ramipril (Triatec®)',
    genericName: 'Ramipril',
    description: 'IEC de deuxième génération, prodrogue à longue durée d\'action. Antihypertenseur, cardioprotecteur et néphroprotecteur.',
    sections: makeSections(
      `**DCI :** Ramipril
**Noms commerciaux :** Triatec®, Ramace®, Altace®

**Mécanisme d'action**
Prodrogue transformée en ramiprilate (forme active) par hydrolyse hépatique. Inhibe l'enzyme de conversion (kininase II) qui convertit l'angiotensine I en angiotensine II (vasoconstricteur puissant). Entraîne :
- Vasodilatation artérielle et veineuse → baisse de la pression artérielle
- Réduction de l'aldostérone → diurèse sodée
- Accumulation des bradykinines → vasodilatation + toux

**Indications principales**
- Hypertension artérielle essentielle (HTA)
- Insuffisance cardiaque systolique (FEVG ≤ 40 %)
- Prévention secondaire après infarctus du myocarde
- Néphropathie diabétique et non diabétique (néphroprotection)
- Prévention cardiovasculaire chez patients à haut risque

**Posologie adulte**
- HTA : 2,5 mg/j en dose initiale, augmentation progressive jusqu'à 10 mg/j en 1 prise
- IC post-IDM : 1,25 mg x 2/j initialement, objectif 5 mg x 2/j
- À prendre à heure fixe, avec ou sans repas

**Voies d'administration :** Orale uniquement (comprimés, gélules)

**Contre-indications**
- Hypersensibilité aux IEC
- Angio-œdème héréditaire ou sous IEC (absolue)
- Grossesse (2ème et 3ème trimestre) — fœtotoxicité, oligoamnios
- Sténose bilatérale des artères rénales
- Association avec l'aliskiren chez le diabétique ou l'insuffisant rénal

**Effets indésirables**
- Toux sèche persistante (10-20 % des patients) — due à l'accumulation des bradykinines → switch vers ARA2 si mal toléré
- Hyperkaliémie (surtout si IR, diabète, AINS, héparine)
- Hypotension de la première dose (risque d'hypotension orthostatique)
- Insuffisance rénale aiguë fonctionnelle (surtout si déshydratation ou association diurétique)
- Angio-œdème (rare mais potentiellement fatal)

**Surveillance infirmière**
- Mesurer la PA avant chaque prise (signaler si < 90 mmHg systolique)
- Prévenir le patient du risque d'hypotension orthostatique : se lever lentement
- Contrôle biologique régulier : créatinine, kaliémie, natrémie
- Éduquer sur la toux : ne pas arrêter le traitement sans avis médical
- Signaler immédiatement tout angio-œdème (gonflement de la face, langue, gorge)
- Ne pas associer à des AINS sans avis médical`,

      `Schéma du système rénine-angiotensine-aldostérone (SRAA) et site d'action des IEC — cours de cardiologie IFSI.
ECG de référence pour surveillance du patient sous IEC (troubles du rythme liés à l'hyperkaliémie).`,

      `**Références**
1. ANSM — Monographie Ramipril / Triatec®. [ansm.sante.fr]
2. Vidal — Fiche Triatec®. [vidal.fr]
3. ESC/ESH — Guidelines pour la prise en charge de l'hypertension artérielle. 2023.
4. HAS — Guide ALD Insuffisance cardiaque systolique. 2021.
5. Société Française de Cardiologie — Recommandations post-IDM. 2020.`
    ),
    sources: [
      { title: 'ESC/ESH — Guidelines HTA 2023',             authors: 'ESC/ESH',      year: '2023', url: 'https://escardio.org' },
      { title: 'HAS — ALD Insuffisance cardiaque',          authors: 'HAS',          year: '2021', url: 'https://has-sante.fr' },
      { title: 'ANSM — Monographie Ramipril',               authors: 'ANSM',         year: '2023', url: 'https://ansm.sante.fr' },
    ],
    tags: ['IEC', 'antihypertenseur', 'cardioprotecteur', 'SRAA', 'toux', 'hyperkaliémie', 'IC'],
  },

  /* 5 ── HÉPARINE ─────────────────────────────────────────────── */
  {
    classIndex:  4,
    name:        'Héparine sodique (Héparine Choay®)',
    genericName: 'Héparine sodique',
    description: 'Anticoagulant naturel d\'action immédiate, injectable. Référence dans la prévention et le traitement des thromboses veineuses et artérielles en milieu hospitalier.',
    sections: makeSections(
      `**DCI :** Héparine sodique (héparine non fractionnée = HNF)
**Noms commerciaux :** Héparine Choay®, Héparine Panpharma®

**Mécanisme d'action**
Potentialise l'antithrombine III (AT III) : accélère jusqu'à 1 000 fois son action inhibitrice sur la thrombine (facteur IIa) et le facteur Xa. Résultat : inhibition de la coagulation et de la formation du caillot. Action anticoagulante immédiate.

**Indications principales**
- Prévention de la MTEV en chirurgie et médecine (dose préventive)
- Traitement curatif de la TVP et de l'embolie pulmonaire
- Anticoagulation lors de la fibrillation auriculaire non valvulaire
- Syndrome coronarien aigu (SCA)
- Anticoagulation des circuits extracorporels (hémodialyse, CEC)
- Relais pré-interventionnel des AVK

**Posologie adulte**
- Préventive : 5 000 UI SC x 2-3/j
- Curative : 500 UI/kg/j en IVSE (seringue électrique) ou 80 UI/kg bolus IV + 18 UI/kg/h
- Adaptation selon le TCA (objectif : TCA patient / TCA témoin = 2 à 3)

**Voies d'administration :** SC (préventif), IV directe ou IVSE (curatif), pas de voie IM (risque d'hématome)

**Contre-indications**
- Hémorragie active, trouble de l'hémostase (absolues)
- ATCD de thrombopénie induite par l'héparine (TIH)
- Anesthésie péridurale / rachianesthésie (avec dose curative)
- Endocardite infectieuse (selon indication)

**Effets indésirables**
- Hémorragie (risque majeur — surveillance stricte)
- TIH (Thrombopénie Induite par Héparine) : chute plaquettes >50 % entre J5 et J21 → arrêt immédiat, alternative par danaparoïde ou argatroban
- Ostéoporose (traitement prolongé > 3 mois)
- Augmentation transitoire des transaminases
- Nécrose cutanée au point d'injection (SC)

**Antidote**
- Sulfate de protamine : neutralise l'héparine (1 mg protamine neutralise 100 UI héparine)
- Disponible sur unité de soins

**Surveillance infirmière — PRIMORDIALE**
- NFS-plaquettes : avant traitement, puis J5, J7, J10, J14 (dépistage TIH)
- TCA (héparinémie) : 6 h après chaque modification posologique, puis quotidien
- Surveiller signes hémorragiques : hématurie, épistaxis, ecchymoses, saignement gencives
- Injection SC : abdomen (10 cm autour du nombril), pincement de la peau, ne pas frotter
- IVSE : vérifier le débit, la voie veineuse, ne jamais interrompre brusquement
- Traçabilité : noter l'heure, la dose, le numéro de lot`,

      `Schéma de la cascade de coagulation et site d'action de l'héparine — cours de biologie IFSI.
Vidéo : « Surveillance d'un patient sous anticoagulant » — INRS Santé.
Fiche technique injection sous-cutanée d'héparine — procédure de soins.`,

      `**Références**
1. ANSM — Monographie Héparine sodique. [ansm.sante.fr]
2. HAS — Prévention et traitement de la MTEV. Recommandations. 2019.
3. Société Française d'Anesthésie-Réanimation (SFAR) — Gestion périopératoire des anticoagulants. 2022.
4. Vidal — Fiche Héparine Choay®. [vidal.fr]
5. Groupe d'Études sur l'Hémostase et la Thrombose (GEHT) — Guide pratique. 2021.`
    ),
    sources: [
      { title: 'HAS — Prévention et traitement MTEV',     authors: 'HAS',     year: '2019', url: 'https://has-sante.fr' },
      { title: 'SFAR — Anticoagulants périopératoires',   authors: 'SFAR',    year: '2022', url: 'https://sfar.org' },
      { title: 'ANSM — Monographie Héparine',             authors: 'ANSM',    year: '2023', url: 'https://ansm.sante.fr' },
    ],
    tags: ['anticoagulant', 'HNF', 'héparine', 'TIH', 'MTEV', 'TVP', 'TCA', 'protamine'],
  },

  /* 6 ── PREDNISONE ───────────────────────────────────────────── */
  {
    classIndex:  5,
    name:        'Prednisone (Cortancyl®)',
    genericName: 'Prednisone',
    description: 'Corticoïde systémique de synthèse, prodrogue transformée en prednisolone par le foie. Puissant anti-inflammatoire et immunosuppresseur.',
    sections: makeSections(
      `**DCI :** Prednisone
**Noms commerciaux :** Cortancyl®

**Mécanisme d'action**
Prodrogue → transformée en prednisolone (forme active) par réduction hépatique. Se fixe sur les récepteurs aux glucocorticoïdes intracellulaires → action génomique : inhibe la transcription des gènes pro-inflammatoires (cytokines, COX-2, phospholipase A2). Puissant effet immunosuppresseur et anti-inflammatoire.

**Indications principales**
- Maladies auto-immunes : lupus érythémateux systémique, polymyosite, MICI
- Maladies inflammatoires : polyarthrite rhumatoïde, vascularites, artérite temporale (Horton)
- Maladies allergiques sévères : choc anaphylactique (en relais adrénaline), œdème de Quincke
- Pathologies respiratoires : asthme sévère, BPCO exacerbation
- Transplantation d'organes (immunosuppression)
- Hémopathies malignes : lymphomes, LAL

**Posologie adulte**
- Dose usuelle : 0,5 à 1 mg/kg/j (sans dépasser 80 mg/j en général)
- Toujours le matin en 1 prise (respect du rythme circadien cortisol)
- Schéma dégressif (jamais d'arrêt brutal si traitement > 3 semaines)
- Bolus IV de méthylprednisolone en situation de crise (hôpital)

**Voies d'administration :** Orale uniquement (comprimés à 1 mg, 5 mg, 20 mg)

**Contre-indications**
- Relatives (rapport bénéfice/risque) : infections non contrôlées (virales, bactériennes, fongiques), ulcère gastroduodénal évolutif, diabète déséquilibré, psychose non contrôlée, ostéoporose sévère

**Effets indésirables (nombreux à long terme)**
- Métaboliques : diabète cortisonique, dyslipidémie, prise de poids, obésité tronculaire
- Osseux : ostéoporose (risque fracturaire), ostéonécrose aseptique de la tête fémorale
- Cardiovasculaires : HTA, rétention hydrosodée, hypokaliémie
- Digestifs : ulcère gastroduodénal (surtout si association AINS)
- Endocriniens : syndrome de Cushing iatrogène (moon face, vergetures pourpres, bosse de bison)
- Oculaires : cataracte sous-capsulaire postérieure, glaucome
- Cutanés : fragilité cutanée, retard cicatrisation, acné
- Immunodépression : infections opportunistes (BK, Pneumocystis jiroveci), réactivation virale
- Psychiatriques : euphorie, insomnie, dépression, psychose cortisonique

**Règles associées (systématiques)**
- Régime hyposodé, pauvre en sucres rapides, riche en calcium et protéines
- Supplémentation calcium + vitamine D
- Biphosphonate si traitement prolongé (prévention ostéoporose)
- IPP si association AINS ou antécédent d'ulcère
- Mise à jour vaccinale avant traitement immunosuppresseur

**Surveillance infirmière**
- Glycémie : risque de diabète cortisonique (surtout chez prédisposés)
- PA : surveiller HTA, prise de poids, œdèmes
- Kaliémie (risque hypokaliémie)
- Signes infectieux : toute fièvre chez patient sous corticoïdes = urgence
- Éducation patient : ne JAMAIS arrêter brutalement (risque d'insuffisance surrénalienne aiguë)`,

      `Schéma du mécanisme génomique des glucocorticoïdes — cours de pharmacologie IFSI.
Photos illustratives : syndrome de Cushing iatrogène (facies lunaire, obésité tronculaire) — dans les supports de cours.`,

      `**Références**
1. ANSM — Monographie Prednisone / Cortancyl®. [ansm.sante.fr]
2. Vidal — Fiche Cortancyl®. [vidal.fr]
3. Société Nationale Française de Médecine Interne (SNFMI) — Recommandations corticothérapie systémique. 2020.
4. EULAR — Recommandations sur le bon usage des corticoïdes en rhumatologie. 2022.
5. Prescrire — « Corticoïdes systémiques : prévention des effets indésirables ». 2021.`
    ),
    sources: [
      { title: 'SNFMI — Corticothérapie systémique',     authors: 'SNFMI',     year: '2020', url: 'https://snfmi.org' },
      { title: 'EULAR — Bon usage des corticoïdes',      authors: 'EULAR',     year: '2022', url: 'https://eular.org' },
      { title: 'ANSM — Monographie Prednisone',          authors: 'ANSM',      year: '2023', url: 'https://ansm.sante.fr' },
    ],
    tags: ['corticoïde', 'anti-inflammatoire', 'immunosuppresseur', 'Cushing', 'ostéoporose', 'décroissance'],
  },

  /* 7 ── FUROSÉMIDE ───────────────────────────────────────────── */
  {
    classIndex:  6,
    name:        'Furosémide (Lasilix®)',
    genericName: 'Furosémide',
    description: 'Diurétique de l\'anse, puissant et rapide. Traitement de référence de l\'œdème aigu pulmonaire (OAP) et des œdèmes d\'origine cardiaque, hépatique ou rénale.',
    sections: makeSections(
      `**DCI :** Furosémide
**Noms commerciaux :** Lasilix®, Furosémide Mylan®, Furosémide Teva®

**Mécanisme d'action**
Inhibe le co-transporteur Na⁺/K⁺/2Cl⁻ (NKCC2) dans la branche ascendante de l'anse de Henlé. Entraîne une élimination massive de sodium, chlore, potassium et eau. Diurèse abondante dès 30 min per os, en quelques minutes en IV. Aussi vasodilatateur veineux (utile dans l'OAP).

**Indications principales**
- Œdème aigu pulmonaire cardiogénique (urgence — IV)
- Insuffisance cardiaque congestive (IV ou per os selon gravité)
- Cirrhose hépatique avec ascite (per os, en association avec spironolactone)
- Syndrome néphrotique
- HTA résistante (association)
- Hypercalcémie sévère (IV)

**Posologie adulte**
- Per os : 20 à 80 mg/j en 1-2 prises (matin et début d'après-midi — pas le soir)
- IV urgence (OAP) : 40 à 80 mg IV lente (1-2 min), peut être répété
- IVSE : 10-40 mg/h selon contexte et réponse
- Adaptation selon la diurèse et l'état clinique

**Voies d'administration :** Orale (comprimés 20 mg, 40 mg, 500 mg), IV directe, IVSE

**Contre-indications**
- Anurie, insuffisance rénale oligo-anurique
- Hypokaliémie ou hyponatrémie sévères non corrigées
- Déshydratation sévère
- Allergie aux sulfamides (précaution)
- Grossesse (relatif, usage ponctuel possible)

**Effets indésirables**
- HYPOKALIÉMIE (effet indésirable le plus fréquent et dangereux) → risque de troubles du rythme
- Hyponatrémie, hypochlorémie
- Déshydratation, hypovolémie → hypotension orthostatique
- Hyperuricémie → crise de goutte
- Ototoxicité (doses élevées, IV rapide, insuffisance rénale)
- Hyperglycémie (surtout si prédisposé)
- Alcalose métabolique hypokaliémique

**Surveillance infirmière — CLÉS**
- Diurèse : mesure horaire en urgence, puis quotidienne (objectif selon prescription)
- Bilan entrées/sorties (balance hydrique)
- Kaliémie (AVANT et pendant traitement) — supplémentation potassique souvent nécessaire
- Natrémie, créatinine
- Poids quotidien (même heure, même balance, patient à jeun)
- PA (risque d'hypotension orthostatique) : mesurer couché puis debout
- Signes d'hypokaliémie : crampes, faiblesse musculaire, troubles du rythme (ECG)
- En IV : injection lente (max 4 mg/min) — risque ototoxicité si trop rapide`,

      `Schéma du néphron et site d'action des diurétiques (anse de Henlé) — cours de biologie IFSI.
Vidéo : « Prise en charge infirmière de l'OAP » — Urgences pratiques.
Protocole de surveillance de la kaliémie sous diurétique — procédure de service.`,

      `**Références**
1. ANSM — Monographie Furosémide / Lasilix®. [ansm.sante.fr]
2. Vidal — Fiche Lasilix®. [vidal.fr]
3. ESC — Guidelines insuffisance cardiaque aiguë et chronique. 2021.
4. SFAR / SRLF — Prise en charge de l'OAP en réanimation. 2020.
5. HAS — Bon usage des diurétiques. 2018.`
    ),
    sources: [
      { title: 'ESC — Guidelines IC aiguë/chronique', authors: 'ESC',  year: '2021', url: 'https://escardio.org' },
      { title: 'ANSM — Monographie Furosémide',       authors: 'ANSM', year: '2023', url: 'https://ansm.sante.fr' },
      { title: 'HAS — Bon usage des diurétiques',     authors: 'HAS',  year: '2018', url: 'https://has-sante.fr' },
    ],
    tags: ['diurétique', 'anse de Henlé', 'OAP', 'hypokaliémie', 'IC', 'furosémide', 'kaliémie'],
  },

  /* 8 ── DIAZÉPAM ─────────────────────────────────────────────── */
  {
    classIndex:  7,
    name:        'Diazépam (Valium®)',
    genericName: 'Diazépam',
    description: 'Benzodiazépine de référence, à longue durée d\'action. Anxiolytique, myorelaxant, antiépileptique, hypnotique et amnésiant. Classé stupéfiant.',
    sections: makeSections(
      `**DCI :** Diazépam
**Noms commerciaux :** Valium®, Diazépam Ratiopharm®

**Mécanisme d'action**
Potentialise l'action du GABA (neurotransmetteur inhibiteur principal du SNC) sur les récepteurs GABA-A ionotropiques → augmentation de l'entrée du Cl⁻ → hyperpolarisation membranaire → inhibition neuronale. Effets : anxiolytique, sédatif, myorelaxant, anticonvulsivant, amnésiant.

**Indications principales**
- Anxiété sévère et invalidante (traitement de courte durée ≤ 4 semaines)
- État de mal épileptique (voie IV ou intra-rectale = Valium® rectal)
- Sevrage alcoolique (prévention du delirium tremens)
- Contractures musculaires sévères
- Prémédication anesthésique
- Sédation procédurale (endoscopie, petits actes)
- Spasmes musculaires dans la tétanos

**Posologie adulte**
- Anxiété : 2 à 10 mg/j per os en 2-3 prises (courte durée)
- État de mal épileptique : 10 à 20 mg IV lente (1-2 mg/min), répétable à 15 min si besoin
- Sevrage alcoolique : protocole dégressif (ex. 30 à 40 mg/j j1, décroissance sur 7-10 j)
- Myorelaxant : 5-15 mg/j per os

**Voies d'administration :** Orale (comprimés 2 mg, 5 mg, 10 mg), IV (ampoules), IM (moins bien absorbé), intra-rectale (pédiatrie)

**Prescription — réglementation**
- Classé comme stupéfiant (ou assimilé selon le pays)
- Prescription sur ordonnance sécurisée
- Durée maximale : 12 semaines (annexe à l'AMM selon indication)

**Contre-indications**
- Insuffisance respiratoire sévère (BPCO, syndrome d'apnées du sommeil)
- Myasthénie grave
- Insuffisance hépatique sévère
- Dépendance aux benzodiazépines connue
- Grossesse (1er et 3ème trimestre — syndrome de sevrage néonatal)
- Association avec les opioïdes (risque de dépression respiratoire)

**Effets indésirables**
- Somnolence, sédation excessive, altération psychomotrice (chutes ++)
- Dépression respiratoire (surtout IV ou association opioïdes)
- Amnésie antérograde
- Dépendance physique et psychique (risque majeur dès 4-6 semaines)
- Syndrome de sevrage à l'arrêt brutal (anxiété rebond, convulsions)
- Effet paradoxal (agitation, agressivité) chez le sujet âgé et l'enfant
- Hypotonie musculaire

**Antidote**
- Flumazénil (Anexate®) : antagoniste spécifique des benzodiazépines
- Action courte (1-2h) → risque de re-sédation → surveillance prolongée obligatoire

**Surveillance infirmière**
- Fréquence respiratoire avant et après injection IV (cible > 12/min)
- SpO2 en continu lors de l'injection IV
- Risque de chute (évaluation systématique, barrières de lit si alité)
- Traçabilité rigoureuse (stupéfiant) : vérification compte, signatures
- Évaluer le niveau de sédation (échelle RASS)
- Prévenir le patient : ne pas conduire, ne pas consommer d'alcool`,

      `Schéma du récepteur GABA-A et site de fixation des benzodiazépines — cours de pharmacologie IFSI.
Affiche de prévention mésusage des benzodiazépines — ANSM.`,

      `**Références**
1. ANSM — Monographie Diazépam / Valium®. [ansm.sante.fr]
2. HAS — Recommandations sur le bon usage des benzodiazépines. 2015 (actualisées 2022).
3. Vidal — Fiche Valium®. [vidal.fr]
4. SFMU — Prise en charge de l'état de mal épileptique. 2021.
5. Prescrire — « Benzodiazépines : réduire les prescriptions ». Revue Prescrire, 2022.`
    ),
    sources: [
      { title: 'HAS — Bon usage des benzodiazépines',    authors: 'HAS',      year: '2022', url: 'https://has-sante.fr' },
      { title: 'SFMU — État de mal épileptique',         authors: 'SFMU',     year: '2021', url: 'https://sfmu.org' },
      { title: 'ANSM — Monographie Diazépam',            authors: 'ANSM',     year: '2023', url: 'https://ansm.sante.fr' },
    ],
    tags: ['benzodiazépine', 'anxiolytique', 'GABA', 'antiépileptique', 'dépendance', 'flumazénil', 'stupéfiant'],
  },

  /* 9 ── METFORMINE ───────────────────────────────────────────── */
  {
    classIndex:  8,
    name:        'Metformine (Glucophage®)',
    genericName: 'Metformine',
    description: 'Antidiabétique oral biguanide, médicament de première intention du diabète de type 2. N\'entraîne pas de prise de poids ni d\'hypoglycémie en monothérapie.',
    sections: makeSections(
      `**DCI :** Metformine (dichlorhydrate de metformine)
**Noms commerciaux :** Glucophage®, Metformine Mylan®, Stagid®, Glucinan®

**Mécanisme d'action**
- Réduit la production hépatique de glucose (gluconéogenèse et glycogénolyse)
- Améliore la sensibilité périphérique à l'insuline (muscles, tissu adipeux)
- Ralentit l'absorption intestinale du glucose
- Mécanisme moléculaire : activation de l'AMPK (protéine kinase sensible à l'énergie)
- N'entraîne pas d'hypoglycémie en monothérapie (ne stimule pas l'insulinosécrétion)

**Indications principales**
- Diabète de type 2, en particulier si surpoids ou obésité (1ère intention, ALD)
- Prévention du diabète de type 2 chez les sujets à très haut risque (hors AMM)
- En association avec insuline, sulfonylurées, gliptines ou SGLT2 selon l'objectif glycémique

**Posologie adulte**
- Initiation : 500 mg à 1 g/j pendant les repas (pour limiter les troubles digestifs)
- Augmentation progressive sur 2 à 4 semaines
- Dose maximale : 3 000 mg/j en 2 à 3 prises
- Toujours prendre PENDANT ou juste après le repas

**Voies d'administration :** Orale uniquement (comprimés, comprimés à libération prolongée LP)

**Contre-indications**
- Insuffisance rénale : DFG < 30 mL/min (arrêt) / DFG 30-45 mL/min (demi-dose, surveillance)
- Insuffisance hépatique sévère
- Acidose lactique ou risque élevé d'acidose
- Injection de produit de contraste iodé (PCI) : suspendre 48 h avant + 48 h après (risque IRA + acidose)
- Jeûne prolongé, chirurgie lourde, déshydratation
- Alcoolisme chronique

**Effets indésirables**
- Troubles digestifs : nausées, vomissements, diarrhées, douleurs abdominales (50 % initialement, s'améliore)
- ACIDOSE LACTIQUE : rare mais potentiellement fatale (surtout si IR ou hypoxie)
- Carence en vitamine B12 (traitement prolongé — surveillance)
- Goût métallique transitoire

**Surveillance infirmière**
- Glycémie capillaire (HbA1c objectif < 7 % en général)
- Créatinine / DFG : contrôle avant initiation et tous les 3-6 mois
- Vitamine B12 annuellement (traitement > 5 ans)
- Éducation sur l'acidose lactique : si vomissements, fièvre, anorexie → consulter
- Éduquer à la gestion des situations d'urgence : jeûne pré-opératoire = ARRÊT metformine
- Rappeler : arrêt obligatoire avant injection de PCI, reprise 48 h après si fonction rénale normale`,

      `Schéma du mécanisme d'action de la metformine (AMPK, gluconéogenèse) — cours UE 2.11.
Tableau comparatif des antidiabétiques oraux et injectables — support de stage.`,

      `**Références**
1. ANSM — Monographie Metformine / Glucophage®. [ansm.sante.fr]
2. HAS — Guide de prise en charge du diabète de type 2. 2023.
3. SFD — Référentiel des bonnes pratiques : diabète de type 2. 2021.
4. Vidal — Fiche Glucophage®. [vidal.fr]
5. ADA/EASD — Consensus Management of Hyperglycemia in Type 2 Diabetes. 2022.`
    ),
    sources: [
      { title: 'HAS — Guide diabète de type 2',              authors: 'HAS',       year: '2023', url: 'https://has-sante.fr' },
      { title: 'ADA/EASD — Consensus Hyperglycemia T2D',     authors: 'ADA/EASD',  year: '2022', url: 'https://diabetesjournals.org' },
      { title: 'SFD — Référentiel T2D',                      authors: 'SFD',       year: '2021', url: 'https://sfdiabete.org' },
    ],
    tags: ['antidiabétique', 'biguanide', 'DT2', 'insulinorésistance', 'acidose lactique', 'PCI', 'AMPK'],
  },

  /* 10 ── FLUOXÉTINE ──────────────────────────────────────────── */
  {
    classIndex:  9,
    name:        'Fluoxétine (Prozac®)',
    genericName: 'Fluoxétine',
    description: 'Antidépresseur ISRS (Inhibiteur Sélectif de la Recapture de la Sérotonine), premier de sa classe mis sur le marché. Traitement de référence de la dépression majeure.',
    sections: makeSections(
      `**DCI :** Fluoxétine (chlorhydrate de fluoxétine)
**Noms commerciaux :** Prozac®, Fluoxétine Mylan®, Sarafem® (dysphorie prémenstruelle)

**Mécanisme d'action**
Inhibe sélectivement le transporteur de la sérotonine (SERT) dans la fente synaptique → augmentation de la concentration en sérotonine (5-HT) disponible → amélioration de la neurotransmission sérotoninergique. Peu d'action sur la noradrénaline et la dopamine (d'où meilleure tolérance que les antidépresseurs tricycliques).
**Délai d'action : 2 à 4 semaines** (éducation essentielle du patient).

**Indications principales**
- Épisode dépressif majeur (EDM) — traitement aigu et prévention des rechutes
- Trouble obsessionnel compulsif (TOC)
- Boulimie nerveuse (seul ISRS ayant l'AMM)
- Trouble panique avec ou sans agoraphobie
- Trouble dysphorique prémenstruel (TDPM)

**Posologie adulte**
- Dépression / TOC : 20 mg/j le matin (petit-déjeuner) — dose de départ et usuelle
- Augmentation possible : 40 à 60 mg/j si réponse insuffisante après 4-6 semaines
- Boulimie : 60 mg/j (dose plus élevée)
- Demi-vie longue (1-4 jours) + métabolite actif norfluoxétine (4-16 j) → 1 prise/j, pas de syndrome de discontinuation

**Voies d'administration :** Orale (gélules 20 mg, solution buvable)

**Contre-indications**
- Prise d'IMAO dans les 14 jours précédents (absolue — risque de syndrome sérotoninergique fatal)
- Prise de pimozide (risque cardiaque)
- Hypersensibilité à la fluoxétine
- Allaitement (passage dans le lait maternel)

**Effets indésirables**
- Digestifs : nausées, diarrhées (fréquents en début — transitoires)
- Neuropsychiatriques : insomnie, agitation, anxiété initiale (risque d'exacerbation des idées suicidaires en début de traitement — surveillance ++)
- Sexuels : anorgasmie, diminution de la libido, éjaculation retardée
- Syndrome sérotoninergique si association (IMAO, tramadol, triptans, lithium) : triade — troubles neuromusculaires + végétatifs + psychiques → urgence
- HTA (rare)
- Hyponatrémie (SIADH, surtout sujet âgé)
- Risque suicidaire majoré chez le sujet jeune (< 25 ans) en début de traitement → surveillance ++

**Arrêt du traitement**
- Demi-vie longue → syndrome de discontinuation rare et moins sévère que les autres ISRS
- Durée minimale recommandée : 6 mois après rémission ; 2 ans si récidives multiples
- Décroissance progressive conseillée malgré la demi-vie longue

**Surveillance infirmière**
- Idées suicidaires : évaluation systématique en début de traitement (1ère semaine ++)
- Surveiller l'humeur, le sommeil, l'appétit
- Natrémie chez le sujet âgé (SIADH)
- Signes de syndrome sérotoninergique : tremblements, hyperthermie, agitation, mydriase
- Éducation : ne pas arrêter brusquement, prévenir du délai d'action, éviter l'alcool
- Signaler toute association avec médicaments sérotoninergiques`,

      `Schéma de la synapse sérotoninergique et mécanisme des ISRS — cours de psychiatrie IFSI.
Infographie HAS : « Les antidépresseurs, comment ça marche ? » — disponible sur has-sante.fr.`,

      `**Références**
1. ANSM — Monographie Fluoxétine / Prozac®. [ansm.sante.fr]
2. HAS — Guide de prise en charge de la dépression. 2017 (actualisé 2023).
3. Vidal — Fiche Prozac®. [vidal.fr]
4. Société Française de Psychiatrie (SFP) — Recommandations antidépresseurs. 2020.
5. FDA — Black box warning : antidépresseurs et risque suicidaire chez le sujet jeune. 2004 (revu 2018).
6. Prescrire — « Fluoxétine : ce qu'il faut savoir ». Revue Prescrire, 2022.`
    ),
    sources: [
      { title: 'HAS — Dépression : prise en charge',      authors: 'HAS',   year: '2023', url: 'https://has-sante.fr' },
      { title: 'SFP — Recommandations antidépresseurs',   authors: 'SFP',   year: '2020', url: 'https://sfpsy.org' },
      { title: 'ANSM — Monographie Fluoxétine',           authors: 'ANSM',  year: '2023', url: 'https://ansm.sante.fr' },
    ],
    tags: ['ISRS', 'antidépresseur', 'sérotonine', 'syndrome sérotoninergique', 'IMAO', 'dépression', 'TOC'],
  },
];

module.exports = { CLASSES, DRUGS_DATA };
