import { isAuthenticated } from "@/services/auth";
import { PropsWithChildren } from "react";

export async function ProtectedItem({ children }: PropsWithChildren) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
