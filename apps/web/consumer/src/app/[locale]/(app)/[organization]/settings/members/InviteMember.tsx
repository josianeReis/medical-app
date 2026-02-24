'use client';
import { inviteMemberToOrganization } from '@/services/organization';
import { inviteMemberRoles, OrganizationRole } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
} from '@packages/ui-components';
import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const inviteMemberSchema = (tCommon: (key: string) => string) =>
	z.object({
		email: z
			.string()
			.min(1, tCommon('email.errors.required'))
			.email(tCommon('email.errors.invalid')),
		role: z.enum([OrganizationRole.DOCTOR, OrganizationRole.SECRETARY]),
	});

export type InviteMemberInputs = z.infer<ReturnType<typeof inviteMemberSchema>>;

const InviteMember = () => {
	const t = useTranslations('settings.members');
	const params = useParams();
	const slug = params.organization as string;
	const tCommon = useTranslations('fields');
	const inviteSchema = inviteMemberSchema(tCommon);
	const [open, setOpen] = useState(false);

	const form = useForm<InviteMemberInputs>({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			email: '',
			role: OrganizationRole.DOCTOR,
		},
	});

	const onSubmit: SubmitHandler<InviteMemberInputs> = async (data) => {
		const { error } = await inviteMemberToOrganization({
			...data,
			slug,
		});
		if (error) {
			toast.error(error);
		}
		toast.success('invite-sent-successfully');

		setOpen(false);

		form.reset({
			email: '',
			role: OrganizationRole.DOCTOR,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<UserPlus className="h-4 w-4" />
					{t('invite')}
				</Button>
			</DialogTrigger>
			<DialogContent className="p-0">
				<DialogHeader>
					<DialogTitle className="p-4">{t('invite-member.title')}</DialogTitle>
					<Separator />
				</DialogHeader>

				<div className="px-4 space-y-4">
					<FormProvider {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4 pb-4"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>{tCommon('email.label')}</FormLabel>
										<FormControl>
											<Input
												placeholder={tCommon('email.placeholder')}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{tCommon('role.label')}</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue
														placeholder={tCommon('role.placeholder')}
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{inviteMemberRoles
													.flat()
													.map((role: OrganizationRole) => (
														<SelectItem key={role} value={role}>
															{tCommon(`role.${role}`)}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter>
								<DialogClose asChild>
									<Button type="button" variant="outline">
										{t('cancel')}
									</Button>
								</DialogClose>
								<Button type="submit" variant="default">
									{t('invite-member.submit')}
								</Button>
							</DialogFooter>
						</form>
					</FormProvider>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default InviteMember;
