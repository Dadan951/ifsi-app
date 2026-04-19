import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

/* Convertit la clé VAPID base64 en Uint8Array pour le navigateur */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const [supported,  setSupported]  = useState(false);
  const [permission, setPermission] = useState('default'); // 'default' | 'granted' | 'denied'
  const [subscribed, setSubscribed] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  /* ── Détection support + état initial ─────────────────────────────────── */
  useEffect(() => {
    const ok = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setSupported(ok);
    if (ok) setPermission(Notification.permission);

    if (ok && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        setSubscribed(!!sub);
      });
    }
  }, []);

  /* ── Enregistrer le Service Worker ────────────────────────────────────── */
  const registerSW = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    return reg;
  }, []);

  /* ── S'abonner aux notifications ───────────────────────────────────────── */
  const subscribe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Demander la permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        setError('Permission refusée');
        setLoading(false);
        return false;
      }

      // 2. Récupérer la clé VAPID publique
      const { data: { publicKey } } = await axios.get(`${API_URL}/notifications/vapid-public-key`);

      // 3. Enregistrer le SW + créer la subscription
      const reg = await registerSW();
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // 4. Envoyer la subscription au backend
      await axios.post(`${API_URL}/notifications/subscribe`, { subscription });

      setSubscribed(true);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'abonnement');
      setLoading(false);
      return false;
    }
  }, [registerSW]);

  /* ── Se désabonner ─────────────────────────────────────────────────────── */
  const unsubscribe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();

      await axios.post(`${API_URL}/notifications/unsubscribe`);

      setSubscribed(false);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Erreur lors du désabonnement');
      setLoading(false);
      return false;
    }
  }, []);

  return { supported, permission, subscribed, loading, error, subscribe, unsubscribe };
}
