const router = require('express').Router();
const ctrl = require('../controllers/exerciseController');
const { protect, adminOnly } = require('../middleware/auth');
const requirePlan = require('../middleware/requirePlan');

router.get('/', protect, requirePlan('pro'), ctrl.getAll);
router.get('/admin', protect, adminOnly, ctrl.adminGetAll);
router.get('/:id', protect, requirePlan('pro'), ctrl.getOne);
router.post('/complete', protect, requirePlan('pro'), ctrl.complete);
router.post('/', protect, adminOnly, ctrl.create);
router.put('/:id', protect, adminOnly, ctrl.update);
router.delete('/:id', protect, adminOnly, ctrl.remove);

module.exports = router;
