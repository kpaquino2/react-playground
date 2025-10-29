import { AuthButton } from "@/components/auth/auth-button";

export default function SignInPage() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Sign in
        </h3>
        <p className="text-muted-foreground mb-4">
          Sign in to start building your components
        </p>
        <AuthButton provider="github" />
      </div>
    </div>
  );
}
