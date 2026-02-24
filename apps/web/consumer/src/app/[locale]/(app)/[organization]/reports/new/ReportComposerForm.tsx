'use client';

import { createReport } from '@/services/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	PlateEditor,
	PlateEditorHandle,
	ScrollArea,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@packages/ui-components';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

interface ComposerProps {
	patients: Patient[];
	procedures: Procedure[];
	templates: Template[];
	printMasks: PrintMask[];
	currentUserId: string;
}

export default function ReportComposerForm(props: ComposerProps) {
	const { patients, procedures, templates, printMasks, currentUserId } = props;
	const params = useParams();
	const slug = params?.organization as string;
	const tCommon = useTranslations('fields');
	const t = useTranslations('common.reports');
	const reportSchema = z.object({
		patientId: z.string().min(1),
		doctorId: z.string().min(1),
		procedureId: z.string().min(1),
		templateId: z.string().min(1),
		printMaskId: z.string().min(1),
		status: z
			.enum(['draft', 'review', 'published'])
			.default('draft')
			.optional(),
		title: z.string().optional(),
	});

	type ReportFormInputs = z.infer<typeof reportSchema>;
	const editorRef = useRef<PlateEditorHandle>(null);
	const [previewHtml, setPreviewHtml] = useState<string>('');

	const form = useForm<ReportFormInputs>({
		resolver: zodResolver(reportSchema),
		defaultValues: {
			patientId: '',
			doctorId: currentUserId,
			procedureId: '',
			templateId: '',
			printMaskId: '',
			status: 'draft',
		},
	});

	const printMaskIdWatch = form.watch('printMaskId');

	useEffect(() => {
		async function updatePreview() {
			const bodyHtml = await editorRef.current?.getContent();
			const selectedMask = printMasks.find((m) => m.id === printMaskIdWatch);
			const header = selectedMask?.headerHtml ?? '';
			const footer = selectedMask?.footerHtml ?? '';
			setPreviewHtml(`${header || ''}${bodyHtml || ''}${footer || ''}`);
		}
		updatePreview();
	}, [form, printMaskIdWatch, printMasks]);

	const onSubmit: SubmitHandler<ReportFormInputs> = async (data) => {
		const htmlContent = await editorRef.current?.getContent();
		if (!htmlContent) {
			toast.error('Content required');
			return;
		}

		const { error, id } = await createReport(slug, {
			...data,
			htmlContent,
		});

		if (error) {
			toast.error(error);
		} else {
			toast.success('Report saved');
			redirect(`/${slug}/reports/${id}`);
		}
	};

	return (
		<div className="flex flex-col h-full gap-4">
			<Card>
				<FormProvider {...form}>
					<CardContent className="p-4">
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="patientId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{tCommon('patient.label')}</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={tCommon('patient.placeholder')} />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{patients.map((p) => (
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
									name="procedureId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{tCommon('procedure.label')}</FormLabel>
											<Select onValueChange={field.onChange} value={field.value} onOpenChange={() => { }}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={tCommon('procedure.placeholder')} />
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
									name="templateId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{tCommon('template.label')}</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={tCommon('template.placeholder')} />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{templates.map((t) => (
														<SelectItem key={t.id} value={t.id}>
															{t.name}
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
									name="printMaskId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{tCommon('print_mask.label') || 'Print Mask'}</FormLabel>
											<Select onValueChange={field.onChange} value={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={tCommon('print_mask.placeholder') || 'Select'} />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{printMasks.map((m) => (
														<SelectItem key={m.id} value={m.id}>
															{m.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<ScrollArea className="border rounded-md mt-4">
								<PlateEditor ref={editorRef} />
							</ScrollArea>

							{/* Preview */}
							<div className="border rounded-md mt-4 p-2 bg-gray-50">
								<FormLabel className="block mb-2">Preview</FormLabel>
								<div dangerouslySetInnerHTML={{ __html: previewHtml }} />
							</div>

							<CardFooter className="flex justify-end">
								<Button type="submit">{t('save_changes') || 'Save Draft'}</Button>
							</CardFooter>
						</form>
					</CardContent>
				</FormProvider>
			</Card>
		</div>
	);
}