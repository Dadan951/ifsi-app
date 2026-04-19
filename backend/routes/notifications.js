const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getVapidKey,
  subscribe,
  unsubscribe,
  sendToAll,
  sendStreakReminder,
  getStats,
} = require('../controllers/notificationController');

router.get('/vapid-public-key', getVapidKey);
router.post('/subscribe', protect, subscribe);
router.post('/unsubscribe', protect, unsubscribe);
router.post('/send-all', protect, adminOnly, sendToAll);
router.post('/send-streak-reminder', protect, adminOnly, sendStreakReminder);
router.get('/stats', protect, adminOnly, getStats);

module.exports = router;
