'use client';

import { removeMember, updateMemberRole } from '@/services/organization';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
} from '@packages/ui-components';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteMemberRoles, OrganizationRole } from '@/utils/constants';
import { redirect, RedirectType } from 'next/navigation';

const editMemberSchema = () =>
	z.object({
		role: z.enum([OrganizationRole.DOCTOR, OrganizationRole.SECRETARY]),
	});

type EditMemberInputs = z.infer<ReturnType<typeof editMemberSchema>>;

const MemberActions = ({ member }: { member: Member }) => {
	const [open, setOpen] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const t = useTranslations('settings.members');
	const tCommon = useTranslations('fields');

	const inviteSchema = editMemberSchema();

	const form = useForm<EditMemberInputs>({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			role: OrganizationRole.DOCTOR,
		},
	});

	const onSubmit: SubmitHandler<EditMemberInputs> = async (data) => {
		const { error } = await updateMemberRole({
			...data,
			id: member.id,
			organizationId: member.organizationId,
		});
		if (error) {
			toast.error(error);
		} else {
			toast.success(t('member-changed-successfully'));

			setOpen(false);
			setOpenDialog(false)

			form.reset({
				role: OrganizationRole.DOCTOR,
			});
		}
	};
	
	async function handleRemoveUser() {
		const { error } = await removeMember(
			member.user.email,
			member.organizationId,
		);

		if (error) {
			return toast.error(error);
		}

		setOpen(false);
		
		return redirect(`members`, RedirectType.push);
	}

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Dialog open={openDialog} onOpenChange={setOpenDialog}>
						<DialogTrigger
							disabled={member.role === OrganizationRole.OWNER}
							className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 disabled:opacity-50"
						>
							{t('edit-member')}
						</DialogTrigger>
						<DialogContent className="p-0">
							<DialogHeader>
								<DialogTitle className="p-4">
									{t('edit-member-title')}
								</DialogTitle>
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
												{t('update')}
											</Button>
										</DialogFooter>
									</form>
								</FormProvider>
							</div>
						</DialogContent>
					</Dialog>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="text-red-600"
					onClick={() => handleRemoveUser()}
					disabled={member.role === OrganizationRole.OWNER}
				>
					{t('remove-member')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default MemberActions;
