import { env } from "@/utils/env";
import LandingPage from "./landing-page";
import MysteriousComingSoon from "./mysterious-coming-soon";
import { getCurrentUser } from "@/services/auth";
import { redirect } from "@/i18n/navigation";

export default async function Home() {
	const user = await getCurrentUser();

	if (user?.lastUsedOrganizationId && user?.members?.length) {
		const matchedMember = user.members.find(
			(member: any) => member.organization?.id === user.lastUsedOrganizationId,
		);

		if (matchedMember) {
			return redirect({
				href: `/${matchedMember.organization.slug}/dashboard`,
				locale: user.language,
			});
		}
	}

	if (user?.email) {
		return redirect({
			href: `/organizations`,
			locale: user.language,
		});
	}

	return env.DEPLOY_ENVIRONMENT === 'production' ? (
		<MysteriousComingSoon />
	) : (
		<LandingPage />
	);
}
