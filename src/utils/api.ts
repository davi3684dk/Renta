import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/Consts";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = await AsyncStorage.getItem("jwt");

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getUserProfile() {
  return fetchWithAuth("/auth/profile");
}

export async function getCars(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  const endpoint = queryString ? `/cars?${queryString}` : "/cars";
  return fetchWithAuth(endpoint);
}
