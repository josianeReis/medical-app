"use client";

import { authClient } from "@/services/auth/auth-client";
import { useRouter, useParams, redirect } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { data: organizations } = authClient.useListOrganizations();
  const params = useParams();
  const organizationSlug = params.organization as string;

  useEffect(() => {
    if (!organizations) return;

    const existsInOrganizations = organizations.some(
      (org) => org.slug === organizationSlug
    );

    if (!existsInOrganizations && organizations.length) {
      redirect(`/organizations`);
    } else if (existsInOrganizations) {
      redirect(`/${organizationSlug}/dashboard`);
    }
  }, [organizations, organizationSlug, router]);

  return null;
};

export default Page;
