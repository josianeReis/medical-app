import { isAuthenticated } from "@/services/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export async function ProtectedRoute({ children }: PropsWithChildren) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}
