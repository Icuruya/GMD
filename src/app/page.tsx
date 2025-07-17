import LoginForm from '@/components/login-form';
import AppLogo from '@/components/app-logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <AppLogo />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
