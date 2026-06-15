import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check
app.get("/make-server-401429d1/health", (c) => c.json({ status: "ok" }));

// Helper: verify JWT and return user
const getAuthUser = async (authHeader: string | undefined) => {
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
};

// GET /progress — load user progress
app.get("/make-server-401429d1/progress", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const data = await kv.get(`progress:${user.id}`);
  return c.json(data ?? {
    xp: 0,
    level: 1,
    completed_modules: [],
    current_module_id: "1.1",
  });
});

// POST /progress — save user progress
app.post("/make-server-401429d1/progress", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json();
  await kv.set(`progress:${user.id}`, {
    xp: body.xp ?? 0,
    level: body.level ?? 1,
    completed_modules: body.completed_modules ?? [],
    current_module_id: body.current_module_id ?? "1.1",
    updated_at: new Date().toISOString(),
  });
  return c.json({ ok: true });
});

// GET /profile — load user profile
app.get("/make-server-401429d1/profile", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const data = await kv.get(`profile:${user.id}`);
  return c.json(data ?? {
    username: user.user_metadata?.username ?? "Astronauta",
    school: "Escola Jardelino Ramos",
  });
});

// POST /profile — save user profile
app.post("/make-server-401429d1/profile", async (c) => {
  const user = await getAuthUser(c.req.header("Authorization"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json();
  await kv.set(`profile:${user.id}`, {
    username: body.username ?? "Astronauta",
    school: body.school ?? "Escola Jardelino Ramos",
  });
  return c.json({ ok: true });
});

Deno.serve(app.fetch);
