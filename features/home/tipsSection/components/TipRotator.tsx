// features/home/components/tipsSection/TipRotator.tsx
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  tips: string[];
  /** Visible time per tip (ms) */
  intervalMs?: number; // default 12000
  /** Crossfade duration (ms) */
  fadeMs?: number; // default 700
  /** Border thickness */
  strokeWidth?: number; // default 2
  /** Border radius (inner progress border) */
  borderRadius?: number; // default 12
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const TipRotator: React.FC<Props> = ({
  tips,
  intervalMs = 12000,
  fadeMs = 700,
  strokeWidth = 2,
  borderRadius = 12,
}) => {
  const tint = useThemeColor({}, "tint");
  const icon = useThemeColor({}, "icon");

  const cleanTips = useMemo(() => tips.filter(Boolean), [tips]);

  // index (state + ref to avoid stale closures)
  const [currentIdx, _setCurrentIdx] = useState(0);
  const currentIdxRef = useRef(0);
  const setCurrentIdx = (i: number) => {
    currentIdxRef.current = i;
    _setCurrentIdx(i);
  };

  const [visibleLayer, setVisibleLayer] = useState<"A" | "B">("A");
  const [aText, setAText] = useState(cleanTips[0] ?? "");
  const [bText, setBText] = useState(cleanTips[1] ?? cleanTips[0] ?? "");

  // fade opacities (animate parent Views — smoother on Android)
  const aOpacity = useRef(new Animated.Value(1)).current;
  const bOpacity = useRef(new Animated.Value(0)).current;

  // === Sweeper animation (head keeps moving clockwise) ===
  // phase: 0..1 per dwell
  const phase = useRef(new Animated.Value(0)).current;

  // layout for SVG border
  const [box, setBox] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== box.w || height !== box.h) setBox({ w: width, h: height });
  };

  // rounded-rect perimeter
  const perimeter = useMemo(() => {
    const w = Math.max(0, box.w - strokeWidth);
    const h = Math.max(0, box.h - strokeWidth);
    if (!w || !h) return 1;
    const r = Math.max(0, Math.min(borderRadius, Math.min(w, h) / 2));
    return 2 * (w + h - 2 * r) + 2 * Math.PI * r;
  }, [box, strokeWidth, borderRadius]);

  // Path that STARTS at the TOP-CENTER (12 o'clock)
  const progressPath = useMemo(() => {
    if (!box.w || !box.h) return "";
    const w = Math.max(0, box.w - strokeWidth);
    const h = Math.max(0, box.h - strokeWidth);
    const r = Math.max(0, Math.min(borderRadius, Math.min(w, h) / 2));

    const x = strokeWidth / 2;
    const y = strokeWidth / 2;
    const left = x;
    const top = y;
    const right = x + w;
    const bottom = y + h;
    const cx = x + w / 2;

    return [
      `M ${cx} ${top}`,
      `L ${right - r} ${top}`,
      `A ${r} ${r} 0 0 1 ${right} ${top + r}`,
      `L ${right} ${bottom - r}`,
      `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
      `L ${left + r} ${bottom}`,
      `A ${r} ${r} 0 0 1 ${left} ${bottom - r}`,
      `L ${left} ${top + r}`,
      `A ${r} ${r} 0 0 1 ${left + r} ${top}`,
      `L ${cx} ${top}`,
      "Z",
    ].join(" ");
  }, [box, strokeWidth, borderRadius]);

  // ----- sweeper math -----
  // head moves forward all cycle: H = P * phase
  const head = useMemo(
    () => Animated.multiply(phase, perimeter),
    [phase, perimeter]
  );

  // visible length grows then shrinks: L = [0 → P → 0]
  const peak = perimeter * 0.7;
  const dashLen = useMemo(
    () =>
      phase.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, peak, 0],
        extrapolate: "clamp",
      }),
    [phase, perimeter]
  );

  // tail = head - length
  const tail = useMemo(() => Animated.subtract(head, dashLen), [head, dashLen]);

  // strokeDashoffset expects where the dash *starts* from the path start (top-center).
  // Using our convention: start = P - tail (negative/large values are fine; SVG treats modulo).
  const dashOffset = useMemo(
    () => Animated.subtract(perimeter, tail),
    [tail, perimeter]
  );

  // scheduling
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const animating = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };
  const clearRaf = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const startCycle = (duration = intervalMs) => {
    // reset phase and run one full sweep
    phase.stopAnimation();
    phase.setValue(0);

    // fallback in dev to avoid stalls
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (!animating.current) crossfadeToNext();
    }, duration + 64);

    Animated.timing(phase, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false, // drives SVG props via derived nodes
    }).start(({ finished }) => {
      if (finished) {
        clearTimer();
        crossfadeToNext();
      }
    });
  };

  const crossfadeToNext = () => {
    if (cleanTips.length <= 1) {
      startCycle(intervalMs);
      return;
    }
    if (animating.current) return;
    animating.current = true;

    const idx = currentIdxRef.current;
    const nextIdx = (idx + 1) % cleanTips.length;
    const aIsVisible = visibleLayer === "A";

    // preload hidden with upcoming text
    if (aIsVisible) {
      bOpacity.stopAnimation();
      bOpacity.setValue(0);
      setBText(cleanTips[nextIdx]);
    } else {
      aOpacity.stopAnimation();
      aOpacity.setValue(0);
      setAText(cleanTips[nextIdx]);
    }

    const ease = Easing.inOut(Easing.cubic);

    Animated.parallel([
      Animated.timing(aIsVisible ? aOpacity : bOpacity, {
        toValue: 0,
        duration: fadeMs,
        easing: ease,
        useNativeDriver: true,
      }),
      Animated.timing(aIsVisible ? bOpacity : aOpacity, {
        toValue: 1,
        duration: fadeMs,
        easing: ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisibleLayer(aIsVisible ? "B" : "A");
      setCurrentIdx(nextIdx);
      (aIsVisible ? bOpacity : aOpacity).setValue(1);
      (aIsVisible ? aOpacity : bOpacity).setValue(0);
      animating.current = false;

      startCycle(intervalMs); // next dwell with sweeper again
    });
  };

  // init/reset after first paint
  useEffect(() => {
    if (cleanTips.length === 0) return;

    setCurrentIdx(0);
    setVisibleLayer("A");
    setAText(cleanTips[0] ?? "");
    setBText(cleanTips[1] ?? cleanTips[0] ?? "");
    aOpacity.setValue(1);
    bOpacity.setValue(0);
    animating.current = false;

    clearRaf();
    rafRef.current = requestAnimationFrame(() => startCycle(intervalMs));

    return () => {
      clearTimer();
      clearRaf();
      phase.stopAnimation();
      aOpacity.stopAnimation();
      bOpacity.stopAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanTips.length, intervalMs, perimeter]);

  if (cleanTips.length === 0) return null;

  return (
    <View onLayout={onLayout} style={styles.container} accessibilityRole="text">
      {/* content */}
      <View style={styles.clip}>
        {/* Layer A */}
        <Animated.View
          style={[styles.layer, { opacity: aOpacity }]}
          collapsable={false}
        >
          <Text style={[styles.tip, { color: icon }]} numberOfLines={3}>
            {aText}
          </Text>
        </Animated.View>

        {/* Layer B */}
        <Animated.View
          style={[
            styles.layer,
            StyleSheet.absoluteFillObject,
            { opacity: bOpacity },
          ]}
          collapsable={false}
        >
          <Text style={[styles.tip, { color: icon }]} numberOfLines={3}>
            {bText}
          </Text>
        </Animated.View>
      </View>

      {/* animated border overlay — top-center start */}
      {box.w > 0 && box.h > 0 && (
        <Svg
          pointerEvents="none"
          width={box.w}
          height={box.h}
          style={StyleSheet.absoluteFill}
        >
          {/* Base track (faint) */}
          <Path
            d={progressPath}
            stroke={icon + "55"}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Sweeper stroke: grows then shrinks while moving clockwise */}
          <AnimatedPath
            d={progressPath}
            stroke={tint}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={[
              // animated dash length + static gap
              dashLen as unknown as number,
              perimeter,
            ]}
            strokeDashoffset={dashOffset as unknown as number}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    position: "relative",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  clip: { minHeight: 50, justifyContent: "center", padding: 10 },
  layer: {
    renderToHardwareTextureAndroid: true,
    needsOffscreenAlphaCompositing: true,
    shouldRasterizeIOS: true,
  } as any,
  tip: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    opacity: 0.96,
    letterSpacing: 0.15,
    textAlign: "center",
    justifyContent: "center",
  },
});
