import "@packages/ui-components/globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@packages/ui-components";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/services/auth";
import { updateUser } from "@/services/user";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.home.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { organization: string };
}>) {
  const user = await getCurrentUser();
  const { organization } = await params;


  if(!user?.email) {
    redirect('/login')
  }

  const currentOrganization = user?.members?.find(
    (member: any) => member.organization?.slug === organization
  );

  if (
    user &&
    currentOrganization?.organization?.id &&
    currentOrganization.organization.id !== user.lastUsedOrganizationId
  ) {
    await updateUser({
      data: { lastUsedOrganizationId: currentOrganization?.organization?.id },
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="w-[100px]">
        <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
