# Plano: NEXA Learning OS — Autenticação e Persistência com Supabase

## Contexto
O NEXA Learning OS é atualmente um protótipo visual completo (3.076 linhas, App.tsx único): todas as telas, módulos 1.1–1.5 + Missão Final implementados, mas sem persistência real — todo o estado (XP, progresso, módulos concluídos) é perdido ao recarregar a página, e login/cadastro não validam nada. O objetivo é transformar em aplicação funcional com auth real e dados persistidos na nuvem via **Supabase**.

## Abordagem

### 1. Conectar Supabase e instalar SDK
- Chamar `supabase_connect` MCP para vincular o projeto e injetar `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` como variáveis de ambiente
- `npm install @supabase/supabase-js`
- Criar `src/lib/supabase.ts`:
```ts
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 2. Schema do banco de dados (executar no SQL Editor do Supabase)

**Tabela `profiles`:**
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  school text default 'Escola Jardelino Ramos',
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "users can read/write own profile"
  on profiles for all using (auth.uid() = id);
```

**Tabela `user_progress`:**
```sql
create table user_progress (
  user_id uuid references auth.users on delete cascade primary key,
  xp integer default 0,
  level integer default 1,
  completed_modules text[] default '{}',
  current_module_id text default '1.1',
  updated_at timestamptz default now()
);
alter table user_progress enable row level security;
create policy "users can read/write own progress"
  on user_progress for all using (auth.uid() = user_id);
```

**Trigger para criar profile + progress automaticamente ao sign up:**
```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username) values (new.id, new.raw_user_meta_data->>'username');
  insert into user_progress (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

### 3. Estado e tipos no App.tsx

Novos estados no `App()`:
```ts
const [authLoading, setAuthLoading] = useState(true);   // checando sessão
const [authError, setAuthError] = useState<string | null>(null);
const [userId, setUserId] = useState<string | null>(null);
const [userEmail, setUserEmail] = useState<string>("");
const [username, setUsername] = useState<string>("Astronauta_Leo");
```

Modificar estados existentes para inicializar em zero (dados vêm do DB):
```ts
const [xp, setXP] = useState(0);
const [completedModules, setCompletedModules] = useState<string[]>([]);
```

### 4. Verificação de sessão ao carregar (substituir o redirect automático para "login")

```ts
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      setUserId(session.user.id);
      setUserEmail(session.user.email ?? "");
      loadProgress(session.user.id);
    } else {
      setScreen("login");
    }
    setAuthLoading(false);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) { setScreen("login"); setUserId(null); }
  });
  return () => subscription.unsubscribe();
}, []);
```

**`loadProgress(userId)`** — busca `user_progress` + `profiles` e preenche `xp`, `completedModules`, `username`.

### 5. Autenticação real nos formulários

**LoginScreen** — `onLogin(email, password)` passa para o App:
```ts
const handleLogin = async (email: string, password: string) => {
  setAuthError(null);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) setAuthError(error.message);
  // onAuthStateChange cuida do redirect
};
```

**RegisterScreen** — `onRegister(email, password, username)`:
```ts
const handleRegister = async (email: string, password: string, username: string) => {
  const { error } = await supabase.auth.signUp({
    email, password,
    options: { data: { username } }
  });
  if (error) setAuthError(error.message);
};
```

Ambas as telas recebem: prop `onSubmit`, `isLoading: boolean`, `error: string | null` e exibem feedback visual (botão com spinner, badge de erro em vermelho sob o campo).

### 6. Persistência de progresso

**`saveProgress()`** — chamado após cada `handleLessonComplete` e `handleFinalMissionComplete`:
```ts
const saveProgress = async (newXP: number, newCompleted: string[]) => {
  if (!userId) return;
  await supabase.from("user_progress").upsert({
    user_id: userId,
    xp: newXP,
    level: Math.floor(newXP / 500) + 1,
    completed_modules: newCompleted,
    current_module_id: currentModuleId,
    updated_at: new Date().toISOString(),
  });
};
```

### 7. Loading screen

Enquanto `authLoading === true`, exibir um `LoadingScreen` estilizado (fundo espacial + NexaBot animado + "Verificando sua missão…") em vez de `LoginScreen` ou app.

### 8. Sign out

Adicionar botão de logout no `Header` (ou `ProfileScreen`):
```ts
const handleSignOut = async () => {
  await supabase.auth.signOut();
  setXP(0); setCompletedModules([]); setCurrentModuleId("1.1");
};
```

### 9. Exibir dados reais do usuário

- `Header` e `ProfileScreen` já exibem `"Astronauta_Leo"` hardcoded → substituir por `username` e `userEmail` do estado
- Nível calculado dinamicamente: `Math.floor(xp / 500) + 1`

### 10. Arquivos modificados/criados
- **`src/lib/supabase.ts`** — novo (cliente Supabase)
- **`src/app/App.tsx`** — auth state, loadProgress, saveProgress, handleLogin, handleRegister, handleSignOut, LoadingScreen, propagação de props reais

## Verificação
1. Abrir app → `authLoading` mostra LoadingScreen → sem sessão → LoginScreen
2. Cadastrar com email válido → verificar na aba Auth do Supabase → tabelas `profiles` e `user_progress` criadas via trigger
3. Fazer login → dados carregam do DB → XP e completedModules corretos
4. Completar módulo 1.1 → verificar `user_progress` no Supabase Table Editor → `completed_modules` atualizado, XP somado
5. Recarregar página → auto-login via sessão → progresso preservado
6. Sign out → volta para login → dados zerados no estado local
7. Login de novo → progresso carrega corretamente do DB
