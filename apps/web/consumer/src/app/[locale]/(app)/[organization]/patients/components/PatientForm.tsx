'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
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
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

const getPatientFormSchema = (tCommon: (key: string) => string) =>
	z.object({
		name: z.string().min(1, tCommon('first-name.errors.required')),
		birthdate: z.string().min(1, tCommon('birthday.errors.required')),
		document_type: z.string(),
		document: z.string(),
		phoneNumber: z.string().min(1,tCommon('phoneNumber.errors.required')),
		email: z.string().optional(),
		gender: z.string().optional(),
	});

export type PatientFormData = z.infer<ReturnType<typeof getPatientFormSchema>>;

export interface PatientFormProps {
	onSubmit(data: PatientFormData): void;
	data?: PatientFormData;
}
export function PatientForm(props: PatientFormProps) {
	const params = useParams();
	const t = useTranslations('common.patient');
	const tCommon = useTranslations('fields');
	const patientFormSchema = getPatientFormSchema(tCommon);
	const form = useForm<PatientFormData>({
		resolver: zodResolver(patientFormSchema),
		defaultValues: {
			name: props.data?.name ?? '',
			birthdate: props.data?.birthdate ?? '',
			document_type: props.data?.document_type ?? '',
			document: props.data?.document ?? '',
			email: props.data?.email ?? '',
			phoneNumber: props.data?.phoneNumber ?? '',
			gender: props.data?.gender ?? '',
		},
	});
	return (
		<div className="border bg-white rounded-sm px-4 mt-4">
			<FormProvider {...form}>
				<form
					className="space-y-4 py-4"
					onSubmit={form.handleSubmit(props.onSubmit)}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormLabel className="w-full">{t('common.name')}</FormLabel>
								<FormControl>
									<div className="w-full relative ">
										<Input {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Separator />

					<FormField
						control={form.control}
						name="birthdate"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormLabel className="w-full">
									{t('common.birth-date')}
								</FormLabel>
								<FormControl>
									<div className="w-full relative ">
										<Input {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Separator />

					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormLabel className="w-full">{t('common.sex')}</FormLabel>

								<FormControl>
									<div className="w-full relative ">
										<Input {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Separator />
					<FormField
						control={form.control}
						name="document_type"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormLabel className="w-full">
									{t('common.document-type')}
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="RG">{t('common.identifier')}</SelectItem>
										<SelectItem value="CPF">
											{t('common.physical-personnel')}
										</SelectItem>
										<SelectItem value="Passaporte">
											{t('common.passport')}
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Separator />
					<FormField
						control={form.control}
						name="document"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormLabel className="w-full">{t('common.document')}</FormLabel>

								<FormControl>
									<div className="w-full relative ">
										<Input {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Separator />
					<FormField
						control={form.control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormLabel className="w-full">{t('common.phone')}</FormLabel>

								<FormControl>
									<div className="w-full relative ">
										<Input {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Separator />
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormLabel className="w-full">{t('common.email')}</FormLabel>

								<FormControl>
									<div className="w-full relative ">
										<Input {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full mt-4 mb-4">
						<Link href={`/${params.organization}/patients`}>
							{t('save')}
						</Link>
					</Button>
				</form>
			</FormProvider>
		</div>
	);
}
