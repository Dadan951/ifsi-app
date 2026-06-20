const RANK = { free: 0, pro: 1, premium: 2 };

module.exports = function requirePlan(minPlan) {
  return (req, res, next) => {
    const userRank = RANK[req.user?.subscription] ?? 0;
    if (userRank >= RANK[minPlan]) return next();
    res.status(403).json({
      message: `Abonnement ${minPlan === 'pro' ? 'Pro' : 'Premium'} requis pour cette fonctionnalité.`,
      requiredPlan: minPlan,
      currentPlan: req.user?.subscription || 'free',
    });
  };
};
