import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCalculations } from '@/hooks/queries/useUserCalculations';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const QUICK = [
  { key: 'BMR', icon: 'flame' },
  { key: 'TDEE', icon: 'pulse' },
  { key: 'Macros', icon: 'restaurant' },
  { key: 'BMI', icon: 'body' },
] as const;

export default function HomeScreen() {
  const { session } = useAuth();
  const userId = session?.user.id || '';
  const { data: calculations } = useUserCalculations(userId);
  const router = useRouter();
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  const recent = calculations?.slice(0, 5) || [];

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}> 
      <ThemedText style={styles.section}>Recent Calculations</ThemedText>
      {recent.length ? (
        <FlatList
          data={recent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ThemedText>{item.type}: {JSON.stringify(item.resultJson)}</ThemedText>
          )}
        />
      ) : (
        <ThemedText>No recent calculations</ThemedText>
      )}

      <ThemedText style={styles.section}>Quick Actions</ThemedText>
      <View style={styles.quickGrid}>
        {QUICK.map((q) => (
          <TouchableOpacity
            key={q.key}
            style={[styles.quickCard, { backgroundColor: background, borderColor: text }]}
            onPress={() =>
              router.push({ pathname: '/(protected)/calculators', params: { type: q.key } })
            }
          >
            <Ionicons name={q.icon as any} size={28} color={text} />
            <ThemedText>{q.key}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ThemedText style={styles.section}>Fitness Tip</ThemedText>
      <ThemedText>
        Your BMR represents the minimum calories your body needs to function at rest. Knowing this helps you create
        effective nutrition and fitness plans.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
});
