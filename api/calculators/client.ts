// src/api/calculators/client.ts
import { FN, functionHeaders, functionUrl } from "./endpoints";
import {
  BmiReq,
  BmiRes,
  BmrReq,
  BmrRes,
  BodyCompReq,
  BodyCompRes,
  MacrosReq,
  MacrosRes,
  TdeeReq,
  TdeeRes,
  zBmiRes,
  zBmrRes,
  zBodyCompRes,
  zMacrosRes,
  zTdeeRes,
} from "./models";

/** Centralized, abortable POST JSON */
async function postJson<TReq, TRes>(
  fnName: string,
  body: TReq,
  signal?: AbortSignal
): Promise<TRes> {
  const res = await fetch(functionUrl(fnName), {
    method: "POST",
    headers: functionHeaders(),
    body: JSON.stringify(body),
    signal,
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Invalid JSON from ${fnName}: ${text}`);
  }

  if (!res.ok) {
    const msg =
      json && typeof json === "object" && "error" in (json as any)
        ? (json as any).error
        : `HTTP ${res.status}`;
    throw new Error(`${fnName} failed: ${msg}`);
  }
  return json as TRes;
}

export const calculatorsClient = {
  bmr: (body: BmrReq, signal?: AbortSignal) =>
    postJson<BmrReq, BmrRes>(FN.bmr, body, signal).then(zBmrRes.parse),

  tdee: (body: TdeeReq, signal?: AbortSignal) =>
    postJson<TdeeReq, TdeeRes>(FN.tdee, body, signal).then(zTdeeRes.parse),

  macros: (body: MacrosReq, signal?: AbortSignal) =>
    postJson<MacrosReq, MacrosRes>(FN.macros, body, signal).then(
      zMacrosRes.parse
    ),

  bmi: (body: BmiReq, signal?: AbortSignal) =>
    postJson<BmiReq, BmiRes>(FN.bmi, body, signal).then(zBmiRes.parse),

  bodyComp: (body: BodyCompReq, signal?: AbortSignal) =>
    postJson<BodyCompReq, BodyCompRes>(FN.bodyComp, body, signal).then(
      zBodyCompRes.parse
    ),
};
