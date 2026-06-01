/**
 * Les 10 médicaments originaux (1 par classe)
 * Contenu complet avec sections Général / Médias / Source
 */

function sec(general, mediasNote, sourceNote, sources, tags) {
  return {
    sections: [
      { title: 'Général', content: general,    order: 0 },
      { title: 'Médias',  content: mediasNote, order: 1 },
      { title: 'Source',  content: sourceNote, order: 2 },
    ],
    sources,
    tags,
  };
}

module.exports = [

  /* 0 — Amoxicilline */
  { classIndex: 0, name: 'Amoxicilline (Clamoxyl®)', genericName: 'Amoxicilline',
    description: 'Antibiotique bêta-lactamine de la famille des pénicillines A, bactéricide à large spectre. L\'un des antibiotiques les plus prescrits en France.',
    ...sec(
      `**DCI :** Amoxicilline\n**Noms commerciaux :** Clamoxyl®, Amoxil®, Gramidil®\n\n**Mécanisme d'action**\nInhibe la synthèse de la paroi bactérienne en se liant aux PLP (protéines liant les pénicillines). Action bactéricide.\n\n**Indications principales**\n- Infections ORL : angines à streptocoque A, otites, sinusites bactériennes\n- Infections respiratoires basses (pneumonies communautaires)\n- Infections urinaires basses non compliquées\n- Éradication de Helicobacter pylori (en association)\n- Prophylaxie de l'endocardite infectieuse\n\n**Posologie adulte**\n- Per os : 500 mg à 1 g x 3/j (1,5 à 3 g/j)\n- IV : jusqu'à 3 g x 3/j en infection sévère\n- Durée : 5 à 14 jours selon indication\n\n**Voies d'administration :** Orale (comprimés, gélules, suspension), IV, IM\n\n**Contre-indications**\n- Allergie aux pénicillines (absolue)\n- Allergie aux céphalosporines (précaution, allergie croisée ~10%)\n- Mononucléose infectieuse (risque rash maculopapuleux)\n\n**Effets indésirables**\n- Troubles digestifs (nausées, diarrhées)\n- Éruptions cutanées maculopapuleuses\n- Réactions allergiques : urticaire, choc anaphylactique (rare)\n- Colite à Clostridioides difficile\n\n**Surveillance infirmière**\n- Interrogatoire allergique systématique avant administration\n- Matériel d'urgence anaphylactique disponible\n- En IV : perfuser en 30-60 min\n- Informer le patient de prendre le traitement jusqu'au bout`,
      'Schéma du mécanisme d\'action des pénicillines sur la paroi bactérienne disponible en cours de microbiologie.\nVidéo pédagogique : « Les bêta-lactamines en 5 minutes » — Antibioclic.',
      '**Références**\n1. ANSM — Monographie Amoxicilline. [ansm.sante.fr]\n2. Vidal — Fiche Clamoxyl®. [vidal.fr]\n3. SPILF — Guide de l\'antibiothérapie. 2022.\n4. HAS — Antibiothérapie par voie générale en pratique courante. 2021.',
      [{ title: 'Monographie ANSM — Amoxicilline', authors: 'ANSM', year: '2023', url: 'https://ansm.sante.fr' }, { title: 'Antibioclic', authors: 'Antibioclic', year: '2023', url: 'https://antibioclic.com' }],
      ['antibiotique', 'pénicilline', 'bêta-lactamine', 'ORL', 'respiratoire', 'bactéricide'],
    ),
  },

  /* 1 — Ibuprofène */
  { classIndex: 1, name: 'Ibuprofène (Advil®)', genericName: 'Ibuprofène',
    description: 'AINS dérivé de l\'acide propionique. Antalgique, antipyrétique et anti-inflammatoire. Disponible sans ordonnance à faible dose.',
    ...sec(
      `**DCI :** Ibuprofène\n**Noms commerciaux :** Advil®, Nurofen®, Brufen®\n\n**Mécanisme d'action**\nInhibition non sélective des COX-1 et COX-2 → réduction des prostaglandines pro-inflammatoires.\n\n**Indications principales**\n- Douleurs légères à modérées : céphalées, dysménorrhées, douleurs dentaires\n- États fébriles\n- Poussées douloureuses d'arthrose\n- Entorses, traumatismes bénins\n\n**Posologie adulte**\n- Automédication : 200-400 mg toutes les 6-8 h, max 1 200 mg/j\n- Sur prescription : jusqu'à 2 400 mg/j\n- Prendre au cours du repas\n\n**Contre-indications**\n- Ulcère gastroduodénal évolutif\n- Grossesse > 24 SA\n- Insuffisance rénale, hépatique ou cardiaque sévère\n- Asthme à l'aspirine\n\n**Effets indésirables**\n- Troubles digestifs (épigastralgies, nausées, ulcère)\n- Rétention hydrosodée, HTA\n- Risque cardiovasculaire (usage prolongé)\n\n**Surveillance infirmière**\n- Administrer avec nourriture\n- Associer IPP si risque digestif élevé\n- Surveiller TA, diurèse`,
      'Schémas illustrant l\'inhibition des COX disponibles dans les supports de cours IFSI.\nVidéo : « AINS : mécanisme, indications et risques ».',
      '**Références**\n1. ANSM — Monographie Ibuprofène. [ansm.sante.fr]\n2. HAS — Bon usage des AINS. 2019.\n3. Vidal — Fiche Advil®. [vidal.fr]',
      [{ title: 'HAS — Bon usage des AINS', authors: 'HAS', year: '2019', url: 'https://has-sante.fr' }, { title: 'ANSM — Ibuprofène', authors: 'ANSM', year: '2023', url: 'https://ansm.sante.fr' }],
      ['AINS', 'antalgique', 'antipyrétique', 'anti-inflammatoire', 'COX', 'douleur', 'fièvre'],
    ),
  },

  /* 2 — Paracétamol */
  { classIndex: 2, name: 'Paracétamol (Doliprane®)', genericName: 'Paracétamol',
    description: 'Antalgique et antipyrétique de première intention, sans propriété anti-inflammatoire. Médicament le plus vendu en France. Hépatotoxique en cas de surdosage.',
    ...sec(
      `**DCI :** Paracétamol (acétaminophène)\n**Noms commerciaux :** Doliprane®, Efferalgan®, Dafalgan®, Perfalgan® (IV)\n\n**Mécanisme d'action**\nAction centrale sur la thermorégulation et la perception douloureuse. Faible effet périphérique → pas d'effet anti-inflammatoire.\n\n**Indications principales**\n- Douleurs légères à modérées\n- États fébriles\n- Antalgique palier I, post-opératoire (analgésie multimodale)\n\n**Posologie adulte**\n- 1 g toutes les 4-6 h, maximum 4 g/j (adulte sain)\n- Intervalle minimum 4 heures\n- Réduction si insuffisance hépatique, dénutrition, alcoolisme (max 2 g/j)\n\n**Voies d'administration :** Orale, IV (Perfalgan® en perfusion 15 min), rectale\n\n**Contre-indications**\n- Insuffisance hépatocellulaire sévère\n\n**Effets indésirables**\n- HÉPATOTOXICITÉ (surdosage > 10 g) → nécrose hépatique\n- Réactions allergiques (rares)\n\n**Antidote :** N-acétylcystéine IV (Mucomyst®) — à débuter dans les 10 h\n\n**Surveillance infirmière**\n- Vérifier la dose totale journalière (risque cumul)\n- En IV : ne pas confondre les concentrations\n- Éduquer : ne pas dépasser 4 g/j, éviter l'alcool`,
      'Schéma du métabolisme hépatique du paracétamol (NAPQI) — cours UE 2.11.',
      '**Références**\n1. ANSM — Monographie Paracétamol. [ansm.sante.fr]\n2. CAP Paris — Protocole surdosage paracétamol.\n3. HAS — Stratégie douleur aiguë. 2019.',
      [{ title: 'ANSM — Paracétamol', authors: 'ANSM', year: '2023', url: 'https://ansm.sante.fr' }, { title: 'CAP Paris', authors: 'CAP Paris', year: '2022', url: 'https://centres-antipoison.net' }],
      ['antalgique', 'antipyrétique', 'palier I', 'hépatotoxicité', 'surdosage', 'N-acétylcystéine'],
    ),
  },

  /* 3 — Ramipril */
  { classIndex: 3, name: 'Ramipril (Triatec®)', genericName: 'Ramipril',
    description: 'IEC de deuxième génération, prodrogue à longue durée d\'action. Antihypertenseur, cardioprotecteur et néphroprotecteur.',
    ...sec(
      `**DCI :** Ramipril\n**Noms commerciaux :** Triatec®, Ramace®\n\n**Mécanisme d'action**\nProdrogue transformée en ramiprilate (actif). Inhibe l'ECA → baisse de l'angiotensine II → vasodilatation + réduction aldostérone.\n\n**Indications principales**\n- HTA essentielle\n- Insuffisance cardiaque systolique (FEVG ≤ 40%)\n- Post-IDM (prévention secondaire)\n- Néphropathie diabétique\n\n**Posologie adulte**\n- HTA : 2,5-10 mg/j en 1 prise\n- IC post-IDM : 1,25-5 mg x 2/j\n\n**Contre-indications**\n- Allergie aux IEC, angio-œdème sous IEC\n- Grossesse (2ème et 3ème trimestre)\n- Sténose bilatérale artères rénales\n\n**Effets indésirables**\n- Toux sèche persistante (10-20%)\n- Hyperkaliémie, hypotension première dose\n- Angio-œdème (rare)\n\n**Surveillance infirmière**\n- PA avant prise (hypotension orthostatique)\n- Kaliémie, créatinine régulièrement\n- Éduquer sur la toux et l'angio-œdème`,
      'Schéma du SRAA et site d\'action des IEC — cours cardiologie IFSI.',
      '**Références**\n1. ANSM — Monographie Ramipril. [ansm.sante.fr]\n2. ESC/ESH — Guidelines HTA 2023.\n3. HAS — ALD Insuffisance cardiaque. 2021.',
      [{ title: 'ESC/ESH — Guidelines HTA', authors: 'ESC/ESH', year: '2023', url: 'https://escardio.org' }, { title: 'HAS — ALD IC', authors: 'HAS', year: '2021', url: 'https://has-sante.fr' }],
      ['IEC', 'antihypertenseur', 'SRAA', 'toux', 'hyperkaliémie', 'IC', 'cardioprotection'],
    ),
  },

  /* 4 — Héparine */
  { classIndex: 4, name: 'Héparine sodique (Héparine Choay®)', genericName: 'Héparine sodique',
    description: 'Anticoagulant naturel d\'action immédiate, injectable. Référence dans la prévention et le traitement des thromboses en milieu hospitalier.',
    ...sec(
      `**DCI :** Héparine sodique (HNF)\n**Noms commerciaux :** Héparine Choay®, Héparine Panpharma®\n\n**Mécanisme d'action**\nPotentialise l'antithrombine III → inhibition x1000 de la thrombine (IIa) et du facteur Xa. Action anticoagulante immédiate.\n\n**Indications principales**\n- Prévention MTEV (SC préventif)\n- Traitement curatif TVP et EP\n- SCA, FA, circuits extracorporels\n\n**Posologie adulte**\n- Préventive : 5 000 UI SC x 2-3/j\n- Curative : 500 UI/kg/j en IVSE (TCA cible 2-3x témoin)\n\n**Contre-indications**\n- Hémorragie active, ATCD TIH, anesthésie péridurale (curatif)\n\n**Effets indésirables**\n- Hémorragie (risque majeur)\n- TIH (J5-J21 : chute plaquettes > 50%) → arrêt immédiat\n- Ostéoporose au long cours\n\n**Antidote :** Sulfate de protamine\n\n**Surveillance infirmière**\n- NFS-plaquettes J5, J7, J10, J14\n- TCA quotidien (curatif)\n- Signes hémorragiques\n- SC : abdomen, ne pas frotter`,
      'Schéma de la cascade de coagulation et site d\'action de l\'héparine.\nFiche technique injection SC héparine.',
      '**Références**\n1. ANSM — Monographie Héparine. [ansm.sante.fr]\n2. HAS — Prévention et traitement MTEV. 2019.\n3. SFAR — Anticoagulants périopératoires. 2022.',
      [{ title: 'HAS — MTEV', authors: 'HAS', year: '2019', url: 'https://has-sante.fr' }, { title: 'SFAR — Anticoagulants', authors: 'SFAR', year: '2022', url: 'https://sfar.org' }],
      ['anticoagulant', 'HNF', 'héparine', 'TIH', 'MTEV', 'TVP', 'TCA', 'protamine'],
    ),
  },

  /* 5 — Prednisone */
  { classIndex: 5, name: 'Prednisone (Cortancyl®)', genericName: 'Prednisone',
    description: 'Corticoïde systémique de synthèse, prodrogue transformée en prednisolone. Puissant anti-inflammatoire et immunosuppresseur.',
    ...sec(
      `**DCI :** Prednisone\n**Noms commerciaux :** Cortancyl®\n\n**Mécanisme d'action**\nProdrogue → prednisolone (actif) par réduction hépatique. Inhibe les gènes pro-inflammatoires (cytokines, COX-2, phospholipase A2). Puissant immunosuppresseur.\n\n**Indications principales**\n- Maladies auto-immunes (lupus, polymyosite, MICI)\n- Maladies allergiques sévères\n- Pathologies respiratoires (asthme sévère)\n- Transplantation\n\n**Posologie adulte**\n- 0,5-1 mg/kg/j le matin (décroissance progressive)\n\n**Contre-indications**\n- (Relatives) : infections non contrôlées, ulcère actif\n\n**Effets indésirables**\n- Diabète cortisonique, ostéoporose, HTA, syndrome de Cushing\n- Immunodépression\n\n**Surveillance infirmière**\n- Glycémie, PA, poids, kaliémie\n- Ne JAMAIS arrêter brutalement\n- Calcium + vitamine D + biphosphonate si prolongé`,
      'Schéma mécanisme génomique des glucocorticoïdes — cours pharmacologie IFSI.',
      '**Références**\n1. ANSM — Monographie Prednisone. [ansm.sante.fr]\n2. SNFMI — Recommandations corticothérapie. 2020.\n3. EULAR — Bon usage des corticoïdes. 2022.',
      [{ title: 'SNFMI — Corticothérapie', authors: 'SNFMI', year: '2020', url: 'https://snfmi.org' }, { title: 'EULAR', authors: 'EULAR', year: '2022', url: 'https://eular.org' }],
      ['corticoïde', 'anti-inflammatoire', 'immunosuppresseur', 'Cushing', 'ostéoporose', 'décroissance'],
    ),
  },

  /* 6 — Furosémide */
  { classIndex: 6, name: 'Furosémide (Lasilix®)', genericName: 'Furosémide',
    description: 'Diurétique de l\'anse, puissant et rapide. Traitement de référence de l\'OAP et des œdèmes cardiaques, hépatiques ou rénaux.',
    ...sec(
      `**DCI :** Furosémide\n**Noms commerciaux :** Lasilix®, Furosémide Mylan®\n\n**Mécanisme d'action**\nInhibe le NKCC2 dans l'anse de Henlé → élimination massive de Na+, K+, Cl- et eau. Diurèse en 30 min per os, quelques minutes en IV.\n\n**Indications principales**\n- OAP cardiogénique (urgence IV)\n- IC congestive\n- Cirrhose avec ascite\n- HTA résistante\n\n**Posologie adulte**\n- Per os : 20-80 mg/j en 1-2 prises\n- IV urgence (OAP) : 40-80 mg IV lente\n\n**Contre-indications**\n- Anurie, hypokaliémie sévère, déshydratation\n\n**Effets indésirables**\n- Hypokaliémie ++, déshydratation, hypotension\n- Hyperuricémie\n- Ototoxicité (IV rapide)\n\n**Surveillance infirmière**\n- Diurèse horaire (urgence)\n- Kaliémie, natrémie, créatinine\n- Poids quotidien, PA orthostatique`,
      'Schéma néphron et site d\'action des diurétiques — cours biologie IFSI.',
      '**Références**\n1. ANSM — Monographie Furosémide. [ansm.sante.fr]\n2. ESC — Guidelines IC. 2021.\n3. HAS — Bon usage des diurétiques. 2018.',
      [{ title: 'ESC — IC aiguë/chronique', authors: 'ESC', year: '2021', url: 'https://escardio.org' }, { title: 'ANSM — Furosémide', authors: 'ANSM', year: '2023', url: 'https://ansm.sante.fr' }],
      ['diurétique', 'anse de Henlé', 'OAP', 'hypokaliémie', 'IC', 'furosémide', 'kaliémie'],
    ),
  },

  /* 7 — Diazépam */
  { classIndex: 7, name: 'Diazépam (Valium®)', genericName: 'Diazépam',
    description: 'Benzodiazépine de référence, longue durée d\'action. Anxiolytique, myorelaxant, antiépileptique, hypnotique. Classé stupéfiant.',
    ...sec(
      `**DCI :** Diazépam\n**Noms commerciaux :** Valium®\n\n**Mécanisme d'action**\nPotentialise le GABA sur les récepteurs GABA-A → inhibition neuronale centrale.\n\n**Indications principales**\n- Anxiété sévère\n- État de mal épileptique (IV)\n- Sevrage alcoolique\n- Contractures musculaires sévères\n\n**Posologie adulte**\n- Anxiété : 5-10 mg/j en 2-3 prises\n- État de mal : 10-20 mg IV lente\n\n**Contre-indications**\n- Insuffisance respiratoire sévère\n- Myasthénie grave, grossesse\n\n**Effets indésirables**\n- Somnolence, dépendance physique\n- Dépression respiratoire (IV)\n- Amnésie antérograde\n\n**Antidote :** Flumazénil (Anexate®)\n\n**Surveillance infirmière**\n- FR et SpO2 lors injection IV\n- Risque de chute\n- Traçabilité (stupéfiant)`,
      'Schéma récepteur GABA-A et site de fixation des BZD — cours pharmacologie IFSI.',
      '**Références**\n1. ANSM — Monographie Diazépam. [ansm.sante.fr]\n2. HAS — Bon usage des benzodiazépines. 2022.\n3. SFMU — État de mal épileptique. 2021.',
      [{ title: 'HAS — Benzodiazépines', authors: 'HAS', year: '2022', url: 'https://has-sante.fr' }, { title: 'SFMU — État de mal', authors: 'SFMU', year: '2021', url: 'https://sfmu.org' }],
      ['benzodiazépine', 'anxiolytique', 'GABA', 'antiépileptique', 'dépendance', 'flumazénil', 'stupéfiant'],
    ),
  },

  /* 8 — Metformine */
  { classIndex: 8, name: 'Metformine (Glucophage®)', genericName: 'Metformine',
    description: 'Antidiabétique oral biguanide, médicament de première intention du DT2. N\'entraîne pas de prise de poids ni d\'hypoglycémie en monothérapie.',
    ...sec(
      `**DCI :** Metformine\n**Noms commerciaux :** Glucophage®, Stagid®, Metformine Mylan®\n\n**Mécanisme d'action**\nRéduit la gluconéogenèse hépatique et améliore la sensibilité périphérique à l'insuline (activation AMPK). Pas d'hypoglycémie en monothérapie.\n\n**Indications principales**\n- DT2, surtout si surpoids (1ère intention)\n- En association avec d'autres antidiabétiques\n\n**Posologie adulte**\n- 500 mg à 3 000 mg/j en 2-3 prises au cours des repas\n\n**Contre-indications**\n- DFG < 30 mL/min\n- Injection de PCI (suspendre 48h avant/après)\n- Insuffisance hépatique sévère\n\n**Effets indésirables**\n- Troubles digestifs (nausées, diarrhées)\n- Acidose lactique (rare, grave)\n- Carence en vitamine B12\n\n**Surveillance infirmière**\n- DFG avant et tous les 3-6 mois\n- Éduquer sur l'arrêt avant chirurgie/PCI\n- Vitamine B12 annuellement`,
      'Schéma mécanisme metformine (AMPK, gluconéogenèse) — cours UE 2.11.',
      '**Références**\n1. HAS — Guide DT2. 2023.\n2. SFD — Référentiel T2D. 2021.\n3. ADA/EASD — Consensus Hyperglycemia. 2022.',
      [{ title: 'HAS — Guide DT2', authors: 'HAS', year: '2023', url: 'https://has-sante.fr' }, { title: 'ADA/EASD Consensus', authors: 'ADA/EASD', year: '2022', url: 'https://diabetesjournals.org' }],
      ['antidiabétique', 'biguanide', 'DT2', 'insulinorésistance', 'acidose lactique', 'PCI', 'AMPK'],
    ),
  },

  /* 9 — Fluoxétine */
  { classIndex: 9, name: 'Fluoxétine (Prozac®)', genericName: 'Fluoxétine',
    description: 'Antidépresseur ISRS, premier de sa classe. Traitement de référence de la dépression majeure. Demi-vie longue, peu de syndrome de discontinuation.',
    ...sec(
      `**DCI :** Fluoxétine\n**Noms commerciaux :** Prozac®, Fluoxétine Mylan®\n\n**Mécanisme d'action**\nInhibe sélectivement le transporteur SERT de la sérotonine → augmentation de la 5-HT synaptique. Délai d'action 2-4 semaines.\n\n**Indications principales**\n- Épisode dépressif majeur\n- TOC, boulimie nerveuse\n- Trouble panique\n\n**Posologie adulte**\n- 20 mg/j le matin, max 60 mg/j\n\n**Contre-indications**\n- IMAO dans les 14 jours\n- Pimozide\n\n**Effets indésirables**\n- Nausées, insomnie initiales\n- Syndrome sérotoninergique (associations)\n- Idées suicidaires (sujet < 25 ans, début traitement)\n- Dysfonction sexuelle\n\n**Surveillance infirmière**\n- Évaluation risque suicidaire (1ère semaine +++)\n- Natrémie (SIADH sujet âgé)\n- Délai d'action : rassurer le patient`,
      'Schéma synapse sérotoninergique et mécanisme ISRS — cours psychiatrie IFSI.',
      '**Références**\n1. HAS — Guide dépression. 2023.\n2. ANSM — Monographie Fluoxétine. [ansm.sante.fr]\n3. SFP — Recommandations antidépresseurs. 2020.',
      [{ title: 'HAS — Dépression', authors: 'HAS', year: '2023', url: 'https://has-sante.fr' }, { title: 'ANSM — Fluoxétine', authors: 'ANSM', year: '2023', url: 'https://ansm.sante.fr' }],
      ['ISRS', 'antidépresseur', 'sérotonine', 'syndrome sérotoninergique', 'IMAO', 'dépression', 'TOC'],
    ),
  },
];
