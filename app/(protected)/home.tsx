// app/(tabs)/index.tsx  (HomeScreen)

import { useLatestCalculations } from "@/api/calculations";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { TopBarLoader } from "@/components/shared/TopBarLoader";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { GoalProgressSection } from "@/features/home/goalProgress/GoalProgress";
import {
  ActiveGoalResponse,
  GoalContext,
} from "@/features/home/goalProgress/models";
import QuickActions from "@/features/home/quickActions/QuickActions";
import RecentSection from "@/features/home/recentSection/RecentSection";
import { TipsSection } from "@/features/home/tipsSection/TipsSection";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// --- mock goal data (as you had) ---
const backend: ActiveGoalResponse = {
  activeGoal: {
    id: "f8b422cf-c387-4d75-b6fc-d0f6eb3997fc",
    userId: "abf393e0-6fa3-463e-aa61-93c1c1cd9f97",
    created_at: "2025-09-01T09:46:57.729407+00:00",
    goal_type: "muscleGain",
    target_weight: 90,
    target_body_fat: null,
    target_lbm: null,
    target_date: "2025-12-31",
    notes: "Bulking phase",
    completed: false,
    isactive: true,
  },
};

const ctx: GoalContext = {
  currentWeightKg: 88,
  startWeightKg: 85,
};

export default function HomeScreen() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");

  const { session } = useAuth();
  const userId = session?.user.id ?? "";

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    isFetching, // 👈 bind to subtle top bar loader
  } = useLatestCalculations(userId);

  const isEmpty =
    !error &&
    !isLoading &&
    (!data || (typeof data === "object" && Object.keys(data).length === 0));

  // ----- Loading -----
  if (isLoading) {
    return (
      <ThemedView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <TopBarLoader active={true} />
        <LoadingIndicator styleVariant={10} />
        <Text style={[styles.helperText, { color: icon, marginTop: 12 }]}>
          Loading your latest stats…
        </Text>
      </ThemedView>
    );
  }

  // ----- Error -----
  if (error) {
    const message =
      (typeof error === "object" &&
        // @ts-ignore
        (error?.message || error?.data?.message || error?.error)) ||
      "Something went wrong. Please try again.";

    return (
      <ThemedView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <TopBarLoader active={false} />
        <View style={styles.errorCard}>
          <Text style={[styles.errorTitle, { color: textColor }]}>
            Couldn’t load your data
          </Text>
          <Text
            style={[styles.errorMessage, { color: icon }]}
            numberOfLines={3}
          >
            {String(message)}
          </Text>

          <Pressable
            onPress={() => refetch()}
            disabled={isRefetching}
            style={({ pressed }) => [
              styles.retryBtn,
              {
                backgroundColor: tint,
                opacity: isRefetching || pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Retry"
            testID="retry-button"
          >
            {isRefetching ? (
              <LoadingIndicator styleVariant={5} size={28} />
            ) : (
              <Text style={styles.retryText}>Retry</Text>
            )}
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  // ----- Empty -----
  if (isEmpty) {
    return (
      <>
        <TopBarLoader
          active={isLoading || isFetching || isRefetching}
          left={0}
          right={0}
        />
        <ThemedView
          style={[styles.container, { justifyContent: "flex-start", gap: 12 }]}
        >
          {/* Show Quick Actions even when empty */}
          <QuickActions />

          <View style={styles.emptyCard}>
            <LoadingIndicator styleVariant={4} size={44} />
            <Text
              style={[styles.emptyTitle, { color: textColor, marginTop: 12 }]}
            >
              No calculations yet
            </Text>
            <Text
              style={[styles.helperText, { color: icon, textAlign: "center" }]}
            >
              Run your first calculation to see recent results here.
            </Text>

            <Pressable
              onPress={() => refetch()}
              style={({ pressed }) => [
                styles.ctaBtn,
                { backgroundColor: tint, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.ctaText}>Refresh</Text>
            </Pressable>
          </View>
        </ThemedView>
      </>
    );
  }

  // ----- Success -----
  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <TopBarLoader
        active={isLoading || isFetching || isRefetching}
        left={-16}
        right={-16}
      />
      <GoalProgressSection response={backend} ctx={ctx} />
      <QuickActions />
      <RecentSection data={data || {}} />
      <TipsSection />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
    justifyContent: "space-between",
  },

  helperText: {
    fontSize: 13,
  },

  // Error state
  errorCard: {
    width: "100%",
    maxWidth: 520,
    padding: 16,
    borderRadius: 16,
    gap: 10,
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // Empty state
  emptyCard: {
    width: "100%",
    maxWidth: 520,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  ctaBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "600",
  },
});
