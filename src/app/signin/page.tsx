import AuthButton from "@/components/auth/AuthButton";

export default function SignInPage() {
  return (
    <div className="grid h-full place-items-center">
      <div className="flex flex-col">
        <p className="text-3xl">Sign in</p>
        <p className="mb-4 text-white/50">
          Sign in to start building your components
        </p>
        <AuthButton provider="github" />
      </div>
    </div>
  );
}
