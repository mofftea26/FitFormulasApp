import { Calculation } from "@/types/calculationTypes";

export const format = {
  date: (iso: string) =>
    new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso)),
  summary: (c: Calculation) => {
    if (c.type === "BMR" && c.result_json["bmr"] != null)
      return `BMR: ${c.result_json["bmr"]}`;
    if (c.type === "BMI" && c.result_json["bmi"] != null)
      return `BMI: ${c.result_json["bmi"]}${c.result_json["category"] ? ` (${c.result_json["category"]})` : ""}`;
    if (c.type === "BodyComposition") {
      const bf = c.result_json["bodyFatPercent"];
      const lbm = c.result_json["leanBodyMassKg"];
      return `BF: ${bf ?? "?"}%  LBM: ${lbm ?? "?"}kg`;
    }
    const firstKey = Object.keys(c.result_json ?? {})[0];
    return firstKey ? `${firstKey}: ${String(c.result_json[firstKey])}` : "—";
  },
};
