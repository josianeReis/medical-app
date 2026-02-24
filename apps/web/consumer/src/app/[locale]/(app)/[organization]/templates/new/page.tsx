'use client';

import { getProcedures } from '@/services/procedure';
import { createTemplates } from '@/services/templates';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Card,
	CardContent,
	PlateEditor,
	ScrollArea,
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
	CardFooter,
	Button,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	PlateEditorHandle,
	Input,
	Switch,
} from '@packages/ui-components';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const createTemplateSchema = (tCommon: (key: string) => string) =>
	z.object({
		procedureId: z.string().min(1),
		active: z.boolean(),
		name: z.string().min(1, tCommon('name.errors.required')),
	});

export type TemplateInputs = z.infer<ReturnType<typeof createTemplateSchema>>;

const Page = () => {
	const params = useParams();
	const slug = params?.organization as string;
	const tCommon = useTranslations('fields');
	const templateSchema = createTemplateSchema(tCommon);
	const [procedures, setProcedures] = useState<Procedure[]>(() => []);
	const [loaded, setLoaded] = useState(false);
	const editorRef = useRef<PlateEditorHandle>(null);
	const t = useTranslations('common.templates');

	const form = useForm<TemplateInputs>({
		resolver: zodResolver(templateSchema),
		defaultValues: {
			procedureId: '',
			active: true,
			name: '',
		},
	});

	const onSubmit: SubmitHandler<TemplateInputs> = async (data) => {
		const contentHtml = await editorRef.current!.getContent();

		const { error } = await createTemplates(slug, {
			...data,
			content: contentHtml,
		});

		if (error) {
			return toast.error(error, {
				id: error,
			});
		}

		return redirect(`/${slug}/templates`);
	};

	async function fetchProcedures() {
		if (loaded) return;
		try {
			const procs = await getProcedures(slug);
			setProcedures(procs.data.items);
			setLoaded(true);
		} catch (err: any) {
			toast.error(err, {
				id: err,
			});
		}
	}

	return (
		<div className="flex flex-col h-full">
			<Card className="p-0">
				<FormProvider {...form}>
					<CardContent className="p-0 w-full flex flex-col h-full">
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="flex items-center p-4 gap-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>{tCommon('name.label')}</FormLabel>

											<Input {...field} />
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="procedureId"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>{tCommon('procedure.label')}</FormLabel>

											<Select
												onOpenChange={(open) => open && fetchProcedures()}
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															placeholder={tCommon('procedure.placeholder')}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{procedures.map((procedure) => (
														<SelectItem key={procedure.id} value={procedure.id}>
															{procedure.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="active"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel></FormLabel>
											<div className="flex items-center gap-2">
												<FormLabel>{tCommon('active_template.label')}</FormLabel>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<ScrollArea content="">
								<div className="w-full max-w-full border-t h-[33rem]">
									<PlateEditor ref={editorRef} />
								</div>
							</ScrollArea>

							<CardFooter className="border-t py-2 flex justify-end">
								<Button type="submit">{t('create_template')}</Button>
							</CardFooter>
						</form>
					</CardContent>
				</FormProvider>
			</Card>
		</div>
	);
};

export default Page;
