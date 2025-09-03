// screens/Calculators.tsx
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { Colors } from "@/theme/constants/Colors";

type CalcKey = "BMR" | "TDEE" | "Macros" | "Body Composition" | "BMI";

const FormByKey: Record<CalcKey, React.FC<{ onDone: () => void }>> = {
  BMR: BmrForm,
  TDEE: TdeeForm,
  Macros: MacrosForm,
  "Body Composition": BodyCompForm,
  BMI: BmiForm,
};

export default function CalculatorsScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const [active, setActive] = useState<CalcKey | null>(null);

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const open = useCallback((k: CalcKey) => {
    setActive(k);
    requestAnimationFrame(() => {
      sheetRef.current?.snapToIndex(1);
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.grid}>
        <CalculatorsButton
          title="BMR"
          Icon={CARD_ICONS.BMR}
          color={CARD_COLORS.BMR}
          action={() => open("BMR")}
        />
        <CalculatorsButton
          title="TDEE"
          Icon={CARD_ICONS.TDEE}
          color={CARD_COLORS.TDEE}
          action={() => open("TDEE")}
        />
        <CalculatorsButton
          title="Macros"
          Icon={CARD_ICONS.Macros}
          color={CARD_COLORS.Macros}
          action={() => open("Macros")}
        />
        <CalculatorsButton
          title="Body Composition"
          Icon={CARD_ICONS.BodyComposition}
          color={CARD_COLORS.BodyComposition}
          action={() => open("Body Composition")}
        />
        <CalculatorsButton
          title="BMI"
          Icon={CARD_ICONS.BMI}
          color={CARD_COLORS.BMI}
          action={() => open("BMI")}
        />
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
          backgroundColor: Colors.light.icon,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        handleIndicatorStyle={styles.handle}
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
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sheetBg: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  handle: { width: 36, height: 4, borderRadius: 2, opacity: 0.4 },
  sheetContent: { padding: 16 },
});
