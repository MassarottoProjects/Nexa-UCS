# Fix: Login flow broken + manual edit regressions

## Context
The user reports that entering correct credentials on the login screen does nothing — no navigation, no error. Investigation revealed two root causes:

1. **Pre-existing bug**: `onAuthStateChange` in `AuthProvider` handles the sign-out case (navigate to `/login`) but NOT the sign-in case — it only sets `tokenRef.current` without calling `fetchData` or navigating to `/home`. So login silently succeeds at the Supabase level but the app never reacts.

2. **Manual edit regressions** (user edited App.tsx directly, introducing three syntax/logic errors):
   - `handleFinalMissionComplete`: `setXP((prev) => {` wrapper was removed, leaving `prev` undefined and `setXP` never called.
   - `AppLayout`: duplicate `useAppContext()` destructuring calls for `level` and `handleSignOut` (const redeclaration — crashes TypeScript).

## Files to modify
- `/workspaces/default/code/src/app/App.tsx` — three targeted fixes below.

---

## Fix 1 — `onAuthStateChange`: navigate + load data on login (lines ~3510–3518)

**Current (broken):**
```ts
const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
  if (!session) {
    tokenRef.current = null;
    setXP(0); setCompletedModules([]); setUsername("Astronauta");
    nav("/login", { replace: true });
  } else {
    tokenRef.current = session.access_token;
  }
});
```

**Fix:** In the `else` branch, call `fetchData` and navigate to `/home` only when `authReady` is already true (meaning it's a real login, not the initial session restore which is handled by `getSession()`).

```ts
const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
  if (!session) {
    tokenRef.current = null;
    setXP(0); setCompletedModules([]); setUsername("Astronauta");
    nav("/login", { replace: true });
  } else {
    tokenRef.current = session.access_token;
    if (authReady) {
      fetchData(session.access_token).then(() => nav("/home", { replace: true }));
    }
  }
});
```

Note: `authReady` must be added to the `useEffect` dependency array.

---

## Fix 2 — `handleFinalMissionComplete`: restore missing `setXP` wrapper (lines ~3535–3543)

**Current (broken — `prev` is undefined):**
```ts
const handleFinalMissionComplete = useCallback(() => {
  const next = prev + 100;
  setCompletedModules((pc) => { ... });
  return next;
}, [persist]);
```

**Fix:** Restore the `setXP((prev) => { ... })` functional updater:
```ts
const handleFinalMissionComplete = useCallback(() => {
  setXP((prev) => {
    const next = prev + 100;
    setCompletedModules((pc) => {
      const nc = pc.includes("1.F") ? pc : [...pc, "1.F"];
      persist(next, nc, "1.F");
      return nc;
    });
    return next;
  });
}, [persist]);
```

---

## Fix 3 — `AppLayout`: remove duplicate destructuring (lines ~3556–3560)

**Current (broken — `level` and `handleSignOut` redeclared as const):**
```ts
function AppLayout() {
  const { xp, level, username, handleSignOut, authReady } = useAppContext();
  const nav = useNavigate();
  const { level } = useAppContext();
  const { handleSignOut } = useAppContext();
```

**Fix:** Remove the two redundant lines; the first destructuring already covers both:
```ts
function AppLayout() {
  const { xp, level, username, handleSignOut, authReady } = useAppContext();
  const nav = useNavigate();
```

---

## Verification
1. Log out (or open in fresh session).
2. Enter valid email + password → should navigate to `/home` and display correct username/XP.
3. Enter wrong credentials → should show Supabase error message.
4. Complete the final mission → XP should increase by 100 and module "1.F" should be marked done.
