// screens/Calculators.tsx
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";

import { ThemedView } from "@/components/ui/ThemedView";
import { CARD_COLORS } from "@/constants/calculators/cardColors";
import { CARD_ICONS } from "@/constants/calculators/cardIcons";
import { CalculatorsButton } from "@/features/calculators/components/CalculatorsButton";

// forms
import BmiForm from "@/features/calculators/forms/BmiForm";
import BmrForm from "@/features/calculators/forms/BmrForm";
import BodyCompForm from "@/features/calculators/forms/BodyCompForm";
import MacrosForm from "@/features/calculators/forms/MacrosForm";
import TdeeForm from "@/features/calculators/forms/TdeeForm";
import { useThemeColor } from "@/hooks/useThemeColor";

// ⬇️ read/clear ?open=...
import { useLocalSearchParams, useRouter } from "expo-router";

type CalcKey = "BMR" | "TDEE" | "Macros" | "BodyComposition" | "BMI";

const FormByKey: Record<CalcKey, React.FC<{ onDone: () => void }>> = {
  BMR: BmrForm,
  TDEE: TdeeForm,
  Macros: MacrosForm,
  BodyComposition: BodyCompForm,
  BMI: BmiForm,
};

// accept common aliases (case-insensitive)
const OPEN_MAP: Record<string, CalcKey> = {
  bmr: "BMR",
  tdee: "TDEE",
  macros: "Macros",
  bmi: "BMI",
  bodycomp: "BodyComposition",
  bodycomposition: "BodyComposition",
};

export default function CalculatorsScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const [active, setActive] = useState<CalcKey | null>(null);
  const bgColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const snapPoints = useMemo(() => ["55%", "90%"], []);

  const router = useRouter();
  const params = useLocalSearchParams<{ open?: string | string[] }>();
  const openParam =
    typeof params.open === "string"
      ? params.open
      : Array.isArray(params.open)
      ? params.open[0]
      : undefined;

  const open = useCallback((k: CalcKey) => {
    setActive(k);
    // open immediately; expand tends to feel a tad snappier
    requestAnimationFrame(() => {
      sheetRef.current?.expand();
    });
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.close();
    setTimeout(() => setActive(null), 150);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const ActiveForm = active ? FormByKey[active] : null;

  const items: { key: CalcKey; title: string }[] = [
    { key: "BMR", title: "BMR" },
    { key: "TDEE", title: "TDEE" },
    { key: "Macros", title: "Macros" },
    { key: "BodyComposition", title: "Body Composition" },
    { key: "BMI", title: "BMI" },
  ];

  useLayoutEffect(() => {
    if (!openParam) return;
    const normalized = openParam.toLowerCase().replace(/[_\s-]/g, "");
    const key = OPEN_MAP[normalized];
    if (!key) return;

    requestAnimationFrame(() => {
      open(key);
      try {
        router.setParams({ open: undefined });
      } catch {}
    });
  }, [openParam, open, router]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.grid}>
        {items.map((item, idx) => {
          const isLastOdd = items.length % 2 === 1 && idx === items.length - 1;
          const Icon = CARD_ICONS[item.key];
          const color = CARD_COLORS[item.key];
          return (
            <CalculatorsButton
              key={item.key}
              title={item.title}
              Icon={Icon}
              color={color}
              action={() => open(item.key)}
              style={[styles.cell, isLastOdd && styles.cellFull]}
            />
          );
        })}
      </View>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan"
        backgroundStyle={{
          backgroundColor: bgColor,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        handleIndicatorStyle={{ ...styles.handle, backgroundColor: tintColor }}
        onChange={(i) => {
          if (i === -1) setTimeout(() => setActive(null), 100);
        }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          {ActiveForm ? <ActiveForm onDone={close} /> : null}
        </BottomSheetScrollView>
      </BottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  grid: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  cell: {
    flexBasis: "48%",
    flexGrow: 1,
    maxWidth: "100%",
  },
  cellFull: {
    flexBasis: "100%",
  },
  handle: { width: 36, height: 4, borderRadius: 2 },
  sheetContent: { padding: 16 },
});
