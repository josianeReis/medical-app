'use client';

import React, { useRef, useState } from 'react';
import { getProcedures } from '@/services/procedure';
import { updateTemplate } from '@/services/templates';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Card,
	CardContent,
	CardFooter,
	ScrollArea,
	PlateEditor,
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Input,
	Switch,
	Button,
	PlateEditorHandle,
} from '@packages/ui-components';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useTranslations } from 'next-intl';

const updateTemplateSchema = (tCommon: (key: string) => string) =>
	z.object({
		procedureId: z.string().min(1),
		active: z.boolean(),
		name: z.string().min(1, tCommon('name.errors.required')),
	});

export type TemplateInputs = z.infer<ReturnType<typeof updateTemplateSchema>>;

export default function UpdateTemplateForm({
	template,
	slug,
}: {
	template: Template;
	slug: string;
}) {
	const [procedures, setProcedures] = useState<Procedure[]>(() => [
		template.procedure,
	]);
	const [loaded, setLoaded] = useState(false);
	const editorRef = useRef<PlateEditorHandle>(null);
	const tCommon = useTranslations('fields');
	const t = useTranslations('common.templates');
	const templateSchema = updateTemplateSchema(tCommon);

	const form = useForm<TemplateInputs>({
		resolver: zodResolver(templateSchema),
		defaultValues: {
			name: template.name,
			procedureId: template?.procedureId,
			active: template.active,
		},
	});

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

	const onSubmit: SubmitHandler<TemplateInputs> = async (data) => {
		const contentHtml = await editorRef.current!.getContent();
		const { error, message } = await updateTemplate(slug, template.id, {
			...data,
			content: contentHtml,
		});
		if (error) {
			toast.error(error, { id: error });
		} else {
			toast.success(message);
		}
	};

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
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															placeholder={tCommon('procedure.placeholder')}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{procedures.map((p) => (
														<SelectItem key={p.id} value={p.id}>
															{p.name}
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
												<FormLabel>
													{tCommon('active_template.label')}
												</FormLabel>
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

							<ScrollArea>
								<div className="w-full max-w-full border-t h-[33rem]">
									<PlateEditor
										key={template.content}
										ref={editorRef}
										initialValue={template.content}
									/>
								</div>
							</ScrollArea>

							<CardFooter className="border-t py-2 flex justify-end">
								<Button type="submit">{t('save_changes')}</Button>
							</CardFooter>
						</form>
					</CardContent>
				</FormProvider>
			</Card>
		</div>
	);
}
