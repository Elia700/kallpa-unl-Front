import { ApiResponse } from "@/types/api";
import { del, get, post, postWithAuth, put } from "./apiUtils";
import type { Participant, InitiationRequest } from "@/types/participant";
import { AssessmentData, AssessmentResponseData, BmiDistributionItem } from "@/types/assessment";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import {
  ParticipantProgressResponse,
  RegisterTestFormData,
  TestData,
  TestHistoryData,
  TestListItem,
  TestListItemForParticipant,
  TestResponseData,
} from "@/types/test";

// ==================== AUTH ====================

// Login - Conecta con tu Proxy / AuthController
export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse | undefined> => {
  const response = await post<LoginResponse, LoginRequest>(
    "/api/auth/login",
    credentials,
  );
  return response;
};

// ==================== PARTICIPANTES ====================

export const getParticipants = async (): Promise<Participant[] | undefined> => {
  const response = await get<ApiResponse<Participant[]>>("/api/users");
  return response?.data;
};

// Crear usuario estándar
export const createParticipant = async (
  data: Participant,
): Promise<ApiResponse<Participant> | undefined> => {
  const response = await postWithAuth<ApiResponse<Participant>, Participant>(
    "/api/users",
    data,
  );
  return response;
};

// Búsqueda segura por DNI
export const searchParticipantByDni = async (
  dni: string,
): Promise<Participant | null | undefined> => {
  try {
    const response = await postWithAuth<
      ApiResponse<Participant>,
      { dni: string }
    >("/api/users/search", { dni });
    return response?.data;
  } catch (error) {
    return null;
  }
};

// ==================== MEDIDAS ANTROPOMÉTRICAS ====================
export const saveAssessment = async (
  data: AssessmentData,
): Promise<ApiResponse<AssessmentResponseData> | undefined> => {
  const response = await post<
    ApiResponse<AssessmentResponseData>,
    AssessmentData
  >("/api/save-assessment", data);
  return response;
};

export const getRecords = async (): Promise<AssessmentResponseData[] | undefined> => {
  const response =
    await get<ApiResponse<AssessmentResponseData[]>>("/api/list-assessment");
  return response?.data;
};

export const getAssessmentsByParticipant = async (
  participantExternalId: string,
): Promise<{
  participant: Participant;
  assessments: AssessmentResponseData[];
} | undefined> => {
  const response = await get<
    ApiResponse<{
      participant: Participant;
      assessments: AssessmentResponseData[];
    }>
  >(`/api/participants/${participantExternalId}/assessments`);

  return response?.data;
};

// ==================== TEST FORMULARIOS ====================
export const getTests = async (): Promise<TestListItem[] | undefined> => {
  const response = await get<ApiResponse<TestListItem[]>>("/api/list-test");
  return response?.data.map(test => ({
    ...test,
    already_done: !!test.already_done,
  }));
};

export const saveTest = async (
  data: TestData,
): Promise<ApiResponse<TestResponseData> | undefined> => {
  const response = await post<ApiResponse<TestResponseData>, TestData>(
    "/api/save-test",
    data,
  );

  return response;
};

export const registerForm = async (
  data: RegisterTestFormData,
): Promise<ApiResponse<any> | undefined> => {
  const response = await post<ApiResponse<any>, RegisterTestFormData>(
    "/api/apply_test",
    data,
  );

  return response;
};

export const getTestsForParticipant = async (
  participant_external_id: string,
): Promise<TestListItemForParticipant[] | undefined> => {
  const response = await get<ApiResponse<TestListItemForParticipant[]>>(
    `/api/list-tests-participant?participant_external_id=${participant_external_id}`,
  );
  return response?.data;
};

export const getParticipantProgress = async (
  participant_external_id: string,
): Promise<ParticipantProgressResponse | undefined> => {
  const response = await get<ApiResponse<ParticipantProgressResponse>>(
    `/api/participant-progress?participant_external_id=${participant_external_id}`,
  );

  if (!response || response.code !== 200) {
    throw new Error(response?.msg || "Error al obtener progreso");
  }

  return response.data;
};

export const getTestById = async (
  external_id: string
): Promise<any | undefined> => {
  const response = await get<ApiResponse<any>>(`/api/get-test/${external_id}`);

  if (!response || response.status !== "ok") {
    throw new Error(response?.msg || "Error al obtener el detalle del test");
  }

  return response.data;
};

export const updateTest = async (
  data: TestData & { test_external_id: string }
): Promise<ApiResponse<TestResponseData> | undefined> => {
  const response = await put<ApiResponse<TestResponseData>, typeof data>(
    "/api/update-test",
    data
  );

  return response;
};

export const deleteTest = async (
  external_id: string
): Promise<ApiResponse<any> | undefined> => {
  const response = await del<ApiResponse<any>>(
    `/api/delete-test/${external_id}`
  );
  return response;
};