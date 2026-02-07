import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
        routing="path"
        path="/signup"
        signInUrl="/login"
        afterSignUpUrl="/dashboard"
        // Configure to use magic links only (passwordless)
        // Note: You must also disable password authentication in Clerk Dashboard:
        // Dashboard → User & Authentication → Email, Phone, Username → Disable "Password"
        // And enable "Magic Link" as a sign-in method
      />
    </div>
  );
}
