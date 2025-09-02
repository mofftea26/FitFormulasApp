// src/api/calculations/client.ts
import {
  AllReq,
  AllRes,
  AnyCalc,
  BmrCalc,
  ByDateReq,
  ByDateRes,
  ByIdReq,
  ByIdRes,
  ByTypeReq,
  DeleteReq,
  DeleteRes,
  LatestReq,
  LatestRes,
  MacrosCalc,
  TdeeCalc,
} from "@/features/home/recentSection/models";
import { FN, functionHeaders, functionUrl } from "./endpoints";

/** Tiny, typed, abortable POST helper */
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

// Overloads for byType to return strongly-typed arrays
function byTypeCall(
  body: { userId: string; type: "BMR" },
  signal?: AbortSignal
): Promise<BmrCalc[]>;
function byTypeCall(
  body: { userId: string; type: "TDEE" },
  signal?: AbortSignal
): Promise<TdeeCalc[]>;
function byTypeCall(
  body: { userId: string; type: "Macros" },
  signal?: AbortSignal
): Promise<MacrosCalc[]>;
function byTypeCall(body: ByTypeReq, signal?: AbortSignal): Promise<AnyCalc[]> {
  return postJson<ByTypeReq, AnyCalc[]>(FN.byType, body, signal);
}

export const calculationsClient = {
  all: (body: AllReq, signal?: AbortSignal) =>
    postJson<AllReq, AllRes>(FN.all, body, signal),

  byDate: (body: ByDateReq, signal?: AbortSignal) =>
    postJson<ByDateReq, ByDateRes>(FN.byDate, body, signal),

  byId: (body: ByIdReq, signal?: AbortSignal) =>
    postJson<ByIdReq, ByIdRes>(FN.byId, body, signal),

  latest: (body: LatestReq, signal?: AbortSignal) =>
    postJson<LatestReq, LatestRes>(FN.latest, body, signal),

  byType: byTypeCall,

  delete: (body: DeleteReq, signal?: AbortSignal) =>
    postJson<DeleteReq, DeleteRes>(FN.delete, body, signal),
};
