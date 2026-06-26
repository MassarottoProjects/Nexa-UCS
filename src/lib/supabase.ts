import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// ─── Types ────────────────────────────────────────────────────────────────────

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

export type RankingEntry = {
  userId: string;
  username: string;
  xp: number;
  level: number;
  isCurrentUser: boolean;
};

// ─── Progress — lê/escreve direto na tabela user_progress ────────────────────

export const loadProgress = async (_token: string): Promise<ProgressData> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { xp: 0, level: 1, completed_modules: [], current_module_id: "1.1" };

    const { data, error } = await supabase
      .from("user_progress")
      .select("xp, level, completed_modules, current_module_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) return { xp: 0, level: 1, completed_modules: [], current_module_id: "1.1" };
    return {
      xp: data.xp ?? 0,
      level: data.level ?? 1,
      completed_modules: data.completed_modules ?? [],
      current_module_id: data.current_module_id ?? "1.1",
    };
  } catch {
    return { xp: 0, level: 1, completed_modules: [], current_module_id: "1.1" };
  }
};

export const saveProgress = async (_token: string, data: ProgressData): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_progress").upsert({
      user_id: user.id,
      xp: data.xp,
      level: data.level,
      completed_modules: data.completed_modules,
      current_module_id: data.current_module_id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch { /* silently ignore */ }
};

// ─── Profile — lê/escreve direto na tabela profiles ──────────────────────────

export const loadProfile = async (_token: string): Promise<ProfileData> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { username: "Astronauta", school: "" };

    const { data, error } = await supabase
      .from("profiles")
      .select("username, school")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) return { username: "Astronauta", school: "" };
    return {
      username: data.username ?? "Astronauta",
      school: data.school ?? "",
    };
  } catch {
    return { username: "Astronauta", school: "" };
  }
};

export const saveProfile = async (_token: string, data: ProfileData): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").upsert({
      id: user.id,
      username: data.username,
      school: data.school,
    }, { onConflict: "id" });
  } catch { /* silently ignore */ }
};

// ─── Ranking — lê user_progress + profiles ordenado por XP ──────────────────

export const loadRanking = async (): Promise<RankingEntry[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id ?? "";

    const [progressRes, profilesRes] = await Promise.all([
      supabase
        .from("user_progress")
        .select("user_id, xp, level")
        .order("xp", { ascending: false })
        .limit(20),
      supabase
        .from("profiles")
        .select("id, username"),
    ]);

    if (progressRes.error || !progressRes.data) return [];

    const profileMap = new Map(
      (profilesRes.data ?? []).map((p) => [p.id, p.username as string])
    );

    const EXCLUDED_NAMES = ["astronauta", "teste", "test", "admin", "default"];

    return progressRes.data
      .map((row) => ({
        userId: row.user_id,
        username: profileMap.get(row.user_id) || "Astronauta",
        xp: row.xp ?? 0,
        level: row.level ?? 1,
        isCurrentUser: row.user_id === currentUserId,
      }))
      .filter((entry) =>
        !EXCLUDED_NAMES.includes(entry.username.toLowerCase().trim())
      );
  } catch {
    return [];
  }
};