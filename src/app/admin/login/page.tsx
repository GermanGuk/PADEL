import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-lg font-bold text-ink">Supabase ещё не подключён</h1>
        <p className="text-sm text-grey-1">
          Добавь NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local, чтобы включить админку.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="text-xl font-bold text-ink">Вход в админку</h1>
      <LoginForm />
    </main>
  );
}
