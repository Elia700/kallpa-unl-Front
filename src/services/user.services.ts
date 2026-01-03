import { CreateUserRequest, CreateUserResponse } from "../types/user";


const API_URL = "http://localhost:5000/api";

export const userService = {
  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await fetch(`${API_URL}/save-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || result.status === "error") {
      throw new Error(result.msg || "Error al crear usuario");
    }

    return result;
  },
};
