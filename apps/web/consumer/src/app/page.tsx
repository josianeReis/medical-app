import { getCurrentUser } from "@/services/auth";
import { Button } from "@packages/ui-components";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mt-4 mb-2">
          Welcome to Laudos
        </h1>
        <p className="text-xl max-w-2xl mx-auto my-4">
          Our secure platform helps you manage your medical reports
        </p>
        
        {user ? (
          <div className="mt-8">
            <p className="text-lg mb-4">
              You are logged in as <span className="font-semibold">{user.firstName} {user.lastName}</span>
            </p>
            <Button className="text-lg px-6 py-2" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="text-lg px-6 py-2" asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
            <Button className="text-lg px-6 py-2" asChild>
              <Link href="/signup">
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
