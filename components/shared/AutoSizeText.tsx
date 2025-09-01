// features/home/components/recentSection/AutoSizeText.tsx
import React, { useState } from "react";
import { Text, TextProps } from "react-native";

interface AutoSizeTextProps extends TextProps {
  text: string;
  maxFontSize?: number;
  minFontSize?: number;
  step?: number;
}

export const AutoSizeText: React.FC<AutoSizeTextProps> = ({
  text,
  maxFontSize = 22,
  minFontSize = 12,
  step = 1,
  style,
  ...rest
}) => {
  const [fontSize, setFontSize] = useState(maxFontSize);

  return (
    <Text
      {...rest}
      style={[style, { fontSize }]}
      numberOfLines={1}
      adjustsFontSizeToFit={false} // we control it manually
      onTextLayout={(e) => {
        const { lines } = e.nativeEvent;
        if (lines.length > 1 && fontSize > minFontSize) {
          setFontSize((prev) => Math.max(prev - step, minFontSize));
        }
      }}
    >
      {text}
    </Text>
  );
};
