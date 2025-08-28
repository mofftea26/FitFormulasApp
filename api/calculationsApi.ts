import { postJson } from "./httpClient";
import {
  CalculationsAllRequest,
  CalculationsAllResponse,
  CalculationsByDateRequest,
  CalculationsByDateResponse,
  CalculationsByIdRequest,
  CalculationsByIdResponse,
  CalculationsLatestRequest,
  CalculationsLatestResponse,
  CalculationsByTypeRequest,
  CalculationsByTypeResponse,
  CalculationsDeleteRequest,
  CalculationsDeleteResponse,
} from "@/types/calculationTypes";

export const calcApi = {
  all: (req: CalculationsAllRequest) =>
    postJson<CalculationsAllRequest, CalculationsAllResponse>("calculations-all", req),
  byDate: (req: CalculationsByDateRequest) =>
    postJson<CalculationsByDateRequest, CalculationsByDateResponse>("calculations-by-date", req),
  byId: (req: CalculationsByIdRequest) =>
    postJson<CalculationsByIdRequest, CalculationsByIdResponse>("calculations-by-id", req),
  latest: (req: CalculationsLatestRequest) =>
    postJson<CalculationsLatestRequest, CalculationsLatestResponse>("calculations-latest", req),
  byType: (req: CalculationsByTypeRequest) =>
    postJson<CalculationsByTypeRequest, CalculationsByTypeResponse>("calculations-by-type", req),
  delete: (req: CalculationsDeleteRequest) =>
    postJson<CalculationsDeleteRequest, CalculationsDeleteResponse>("calculations-delete", req),
};
