import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const EDGE_BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-401429d1`;

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export type ProgressData = {
  xp: number;
  level: number;
  completed_modules: string[];
  current_module_id: string;
};

export type ProfileData = {
  username: string;
  school: string;
};

export const loadProgress = async (token: string): Promise<ProgressData> => {
  const res = await fetch(`${EDGE_BASE}/progress`, {
    headers: authHeaders(token),
  });
  if (!res.ok) return { xp: 0, level: 1, completed_modules: [], current_module_id: "1.1" };
  return res.json();
};

export const saveProgress = async (token: string, data: ProgressData): Promise<void> => {
  await fetch(`${EDGE_BASE}/progress`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
};

export const loadProfile = async (token: string): Promise<ProfileData> => {
  const res = await fetch(`${EDGE_BASE}/profile`, {
    headers: authHeaders(token),
  });
  if (!res.ok) return { username: "Astronauta", school: "Escola Jardelino Ramos" };
  return res.json();
};

export const saveProfile = async (token: string, data: ProfileData): Promise<void> => {
  await fetch(`${EDGE_BASE}/profile`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
};
