/**
 * Route admin : POST /api/admin/seed-medicaments
 * Insère les 10 classes + 10 médicaments du Semestre 1
 */
const DrugClass = require('../models/DrugClass');
const Drug      = require('../models/Drug');
const { CLASSES, DRUGS_DATA } = require('./seedMedicaments_data');

module.exports = async (req, res) => {
  try {
    /* 1. Supprime les classes et médicaments existants */
    await Drug.deleteMany({});
    await DrugClass.deleteMany({});

    /* 2. Crée les classes */
    const createdClasses = await DrugClass.insertMany(CLASSES);

    /* 3. Crée les médicaments en liant chaque classe par index */
    const drugsToInsert = DRUGS_DATA.map(d => ({
      name:        d.name,
      genericName: d.genericName,
      drugClass:   createdClasses[d.classIndex]._id,
      description: d.description,
      sections:    d.sections,
      sources:     d.sources,
      tags:        d.tags,
      mindMap:     { url: '', caption: '' },
      attachments: [],
    }));

    const insertedDrugs = await Drug.insertMany(drugsToInsert);

    /* 4. Résumé */
    const byClass = {};
    for (const drug of insertedDrugs) {
      const cls = createdClasses.find(c => c._id.equals(drug.drugClass));
      const key = cls?.name || 'Inconnue';
      byClass[key] = (byClass[key] || 0) + 1;
    }

    res.json({
      success:        true,
      classesCreated: createdClasses.length,
      drugsCreated:   insertedDrugs.length,
      byClass,
    });
  } catch (err) {
    console.error('[seedMedicaments]', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
