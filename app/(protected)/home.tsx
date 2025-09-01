import { ThemedView } from "@/components/ui/ThemedView";
import { GoalProgressSection } from "@/features/home/goalProgress/GoalProgress";
import {
  ActiveGoalResponse,
  GoalContext,
} from "@/features/home/goalProgress/models";
import QuickActions from "@/features/home/quickActions/QuickActions";
import RecentSection from "@/features/home/recentSection/RecentSection";
import { RecentCalculationsResponse } from "@/features/home/recentSection/models";
import { TipsSection } from "@/features/home/tipsSection/TipsSection";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet } from "react-native";

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
  currentWeightKg: 88, // from profile / latest progress
  startWeightKg: 85, // from first snapshot when goal started (optional)
};
const mockData: RecentCalculationsResponse = {
  BMR: {
    id: "ab34d6a4-c5db-40bb-ad6e-f8fd778ae736",
    created_at: "2025-08-28T08:19:38.754566+00:00",
    userId: "abf393e0-6fa3-463e-aa61-93c1c1cd9f97",
    type: "BMR",
    result_json: { bmr: 1694, equation: "mifflin" },
    input_json: {
      age: 31,
      gender: "male",
      equation: "mifflin",
      heightCm: 175,
      weightKg: 75,
    },
    goal: null,
  },
  TDEE: {
    id: "63f455a1-7b9d-4fb1-96a2-49e6033d73e0",
    created_at: "2025-08-04T07:38:42.68435+00:00",
    userId: "abf393e0-6fa3-463e-aa61-93c1c1cd9f97",
    type: "TDEE",
    result_json: { tdee: 2790 },
    input_json: { bmr: 1800, activityLevel: "moderate" },
    goal: null,
  },
  Macros: {
    id: "9eaeb164-4cc1-45d8-9883-0909c3fc51c8",
    created_at: "2025-08-04T07:46:40.195413+00:00",
    userId: "abf393e0-6fa3-463e-aa61-93c1c1cd9f97",
    type: "Macros",
    result_json: { fat: 68, carbs: 438, protein: 176, calories: 3069 },
    input_json: {
      bmr: 1800,
      goal: "muscleGain",
      weightKg: 80,
      activityLevel: "moderate",
    },
    goal: null,
  },
  BMI: {
    id: "c492f9b6-accb-4f75-8a32-17e7e8f7c2b7",
    created_at: "2025-08-25T09:25:11.584707+00:00",
    userId: "abf393e0-6fa3-463e-aa61-93c1c1cd9f97",
    type: "BMI",
    result_json: { bmi: 27.1, category: "Overweight" },
    input_json: { heightCm: 175, weightKg: 83 },
    goal: null,
  },
  BodyComposition: {
    id: "14cf5655-987d-4034-8fd3-e80be472a97f",
    created_at: "2025-08-04T07:56:44.544766+00:00",
    userId: "abf393e0-6fa3-463e-aa61-93c1c1cd9f97",
    type: "BodyComposition",
    result_json: {
      fatMassKg: -1.8,
      bodyFatPercent: -2.3,
      leanBodyMassKg: 81.8,
    },
    input_json: {
      hipCm: 40,
      gender: "female",
      neckCm: 39,
      waistCm: 90,
      heightCm: 175,
      weightKg: 80,
    },
    goal: null,
  },
};

export default function HomeScreen() {
  const background = useThemeColor({}, "background");

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <GoalProgressSection response={backend} ctx={ctx} />
      <QuickActions />
      <RecentSection data={mockData} />
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
});
