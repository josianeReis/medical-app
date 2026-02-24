import { SettingsSidebar } from '@/components/settings-sidebar/settings-sidebar';
import { getCurrentUser } from '@/services/auth';
import '@packages/ui-components/globals.css';
import { redirect } from 'next/navigation';
export default async function SettingsLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: { organization: string };
}>) {
	const user = await getCurrentUser();
	const { organization } = await params;

	const currentOrganization = user?.members?.find(
		(member: any) => member.organization?.slug === organization,
	);

	if (!user?.email || !currentOrganization?.role) {
		redirect('/login');
	}

	return (
		<div>
			<SettingsSidebar {...currentOrganization} />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
		</div>
	);
}
