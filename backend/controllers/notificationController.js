const webpush = require('web-push');
const User = require('../models/User');

/* ── Configure VAPID ─────────────────────────────────────────────────────── */
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/* ── GET /api/notifications/vapid-public-key ─────────────────────────────── */
exports.getVapidKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

/* ── POST /api/notifications/subscribe ───────────────────────────────────── */
exports.subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint)
      return res.status(400).json({ message: 'Subscription invalide' });

    await User.updateOne(
      { _id: req.user._id },
      { $set: { pushSubscription: subscription, pushEnabled: true } }
    );

    // Envoyer une notif de bienvenue
    try {
      await webpush.sendNotification(subscription, JSON.stringify({
        title: '🔔 Notifications activées !',
        body: 'Tu recevras des rappels pour ne jamais manquer une session de révision.',
        icon: '/logo192.png',
        badge: '/logo192.png',
        url: '/'
      }));
    } catch (_) { /* ignorer si ça échoue */ }

    res.json({ message: 'Abonnement enregistré' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /api/notifications/unsubscribe ─────────────────────────────────── */
exports.unsubscribe = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { pushSubscription: null, pushEnabled: false } }
    );
    res.json({ message: 'Désabonnement effectué' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /api/notifications/send-all  (admin) ───────────────────────────── */
exports.sendToAll = async (req, res) => {
  try {
    const { title, body, url = '/' } = req.body;
    if (!title || !body)
      return res.status(400).json({ message: 'Titre et corps requis' });

    const users = await User.find({ pushEnabled: true, pushSubscription: { $ne: null } });
    let sent = 0, failed = 0;

    const payload = JSON.stringify({ title, body, icon: '/logo192.png', badge: '/logo192.png', url });

    await Promise.all(users.map(async (u) => {
      try {
        await webpush.sendNotification(u.pushSubscription, payload);
        sent++;
      } catch (err) {
        failed++;
        // Si la subscription est expirée, on la supprime
        if (err.statusCode === 410 || err.statusCode === 404) {
          await User.updateOne({ _id: u._id }, { $set: { pushSubscription: null, pushEnabled: false } });
        }
      }
    }));

    res.json({ message: `Envoyé : ${sent}, échoué : ${failed}`, sent, failed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── POST /api/notifications/send-streak-reminder  (admin / cron) ────────── */
exports.sendStreakReminder = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Utilisateurs abonnés qui ne se sont PAS connectés aujourd'hui
    const users = await User.find({ pushEnabled: true, pushSubscription: { $ne: null } });
    let sent = 0, failed = 0;

    const payload = JSON.stringify({
      title: '🔥 Ne laisse pas tomber ton streak !',
      body: 'Tu n\'as pas encore révisé aujourd\'hui. Garde ton élan !',
      icon: '/logo192.png',
      badge: '/logo192.png',
      url: '/'
    });

    await Promise.all(users.map(async (u) => {
      const lastDate = u.progress?.lastActivity
        ? new Date(u.progress.lastActivity).toISOString().split('T')[0]
        : null;
      if (lastDate === today) return; // déjà actif aujourd'hui

      try {
        await webpush.sendNotification(u.pushSubscription, payload);
        sent++;
      } catch (err) {
        failed++;
        if (err.statusCode === 410 || err.statusCode === 404) {
          await User.updateOne({ _id: u._id }, { $set: { pushSubscription: null, pushEnabled: false } });
        }
      }
    }));

    res.json({ message: `Rappels streak envoyés : ${sent}, échoué : ${failed}`, sent, failed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── GET /api/notifications/stats  (admin) ───────────────────────────────── */
exports.getStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const subscribed = await User.countDocuments({ pushEnabled: true, pushSubscription: { $ne: null } });
    res.json({ total, subscribed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
