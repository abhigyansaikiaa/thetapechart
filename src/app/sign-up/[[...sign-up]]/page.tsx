import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradients for aesthetics */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-positive/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
