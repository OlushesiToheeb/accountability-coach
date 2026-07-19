import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string) ?? 'http://localhost:3000';

/**
 * Today — the home surface (docs/04 §9). Placeholder: proves the app ↔ API wiring
 * by pinging /health. Real content (the rep, the check-in, the chain) lands in Phase 1.
 */
export function TodayScreen() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((d) => setStatus(d.status === 'ok' ? 'ok' : 'error'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
      <Text style={styles.subtitle}>Your rep, your check-in, your chain — coming soon.</Text>
      <View style={styles.badge}>
        {status === 'loading' ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.badgeText}>
            API: {status === 'ok' ? 'connected' : 'unreachable — start the backend'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 34, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  badge: { marginTop: 16, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#f0f0f0' },
  badgeText: { fontSize: 14 },
});
