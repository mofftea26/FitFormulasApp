import { Colors } from "@/theme/constants/Colors";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";

// ✅ Correct type for v4
export type CalculatorSheetHandle = BottomSheetModal;

type Props = {
  children: React.ReactNode;
  initialSnap?: number;
};

export const CalculatorSheet = forwardRef<CalculatorSheetHandle, Props>(
  ({ children, initialSnap = 1 }, ref) => {
    const scheme = useColorScheme() ?? "light";
    const bg = Colors[scheme].background;
    const snapPoints = useMemo(() => ["50%", "85%"], []);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={initialSnap}
        enablePanDownToClose
        backdropComponent={(p) => (
          <BottomSheetBackdrop
            {...p}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
        handleIndicatorStyle={{ backgroundColor: Colors[scheme].icon }}
        backgroundStyle={{
          backgroundColor: bg,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <View style={styles.content}>{children}</View>
      </BottomSheetModal>
    );
  }
);

CalculatorSheet.displayName = "CalculatorSheet";

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
});
