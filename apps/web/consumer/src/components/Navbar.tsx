"use client";
import { logout } from "@/services/auth";
import { User } from "@/services/auth/auth-client";
import { Button } from "@packages/ui-components";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    // router.refresh();
    router.replace("/login");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-semibold">
          Laudos
        </Link>

        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <span>Welcome, {user.firstName}!</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
