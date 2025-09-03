// src/api/calculators/queries.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { calculatorsClient } from "./client";
import { BmiReq, BmrReq, BodyCompReq, MacrosReq, TdeeReq } from "./models";

/**
 * These are actions that also INSERT into `calculations`,
 * so mutations are the right fit. On success we invalidate the
 * "calculations" cache tree to refresh lists/cards elsewhere.
 */
const CALCULATIONS_ROOT_KEY = ["calculations"] as const;

export const useCalcBmr = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BmrReq) => calculatorsClient.bmr(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CALCULATIONS_ROOT_KEY }),
  });
};

export const useCalcTdee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TdeeReq) => calculatorsClient.tdee(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CALCULATIONS_ROOT_KEY }),
  });
};

export const useCalcMacros = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MacrosReq) => calculatorsClient.macros(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CALCULATIONS_ROOT_KEY }),
  });
};

export const useCalcBmi = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BmiReq) => calculatorsClient.bmi(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CALCULATIONS_ROOT_KEY }),
  });
};

export const useCalcBodyComp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BodyCompReq) => calculatorsClient.bodyComp(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CALCULATIONS_ROOT_KEY }),
  });
};
