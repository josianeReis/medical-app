'use client';

import React, { useRef } from 'react';
import { updatePrintMask } from '@/services/print-masks';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Card,
	CardContent,
	ScrollArea,
	PlateEditor,
	PlateEditorHandle,
	CardFooter,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Switch,
	Button,
} from '@packages/ui-components';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useTranslations } from 'next-intl';

const updateMaskSchema = (tCommon: (key: string) => string) =>
	z.object({
		name: z.string().min(1, tCommon('name.errors.required')),
		active: z.boolean(),
	});

type MaskInputs = z.infer<ReturnType<typeof updateMaskSchema>>;

export default function UpdatePrintMaskForm({
	mask,
	slug,
}: {
	mask: PrintMask;
	slug: string;
}) {
	const headerEditorRef = useRef<PlateEditorHandle>(null);
	const footerEditorRef = useRef<PlateEditorHandle>(null);
	const tCommon = useTranslations('fields');
	const t = useTranslations('common.print_masks');
	const schema = updateMaskSchema(tCommon);

	const form = useForm<MaskInputs>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: mask.name,
			active: mask.active,
		},
	});

	const onSubmit: SubmitHandler<MaskInputs> = async (data) => {
		const headerHtml = await headerEditorRef.current?.getContent();
		const footerHtml = await footerEditorRef.current?.getContent();

		const { error, message } = await updatePrintMask(slug, mask.id, {
			...data,
			headerHtml: headerHtml ?? undefined,
			footerHtml: footerHtml ?? undefined,
		});

		if (error) {
			toast.error(error);
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

							<ScrollArea>
								<div className="w-full max-w-full border-t h-[15rem]">
									<FormLabel className="p-2 block">
										{tCommon('header_html.label') || 'Header'}
									</FormLabel>
									<PlateEditor
										key={mask.headerHtml ?? 'header'}
										ref={headerEditorRef}
										initialValue={mask.headerHtml ?? ''}
									/>
							</div>
							<div className="w-full max-w-full border-t h-[15rem] mt-4">
								<FormLabel className="p-2 block">
									{tCommon('footer_html.label') || 'Footer'}
									</FormLabel>
									<PlateEditor
										key={mask.footerHtml ?? 'footer'}
										ref={footerEditorRef}
										initialValue={mask.footerHtml ?? ''}
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