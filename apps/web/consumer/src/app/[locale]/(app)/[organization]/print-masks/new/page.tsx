'use client';

import { createPrintMask } from '@/services/print-masks';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	PlateEditor,
	PlateEditorHandle,
	ScrollArea,
	Switch
} from '@packages/ui-components';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { useRef } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const createMaskSchema = (tCommon: (key: string) => string) =>
	z.object({
		name: z.string().min(1, tCommon('name.errors.required')),
		active: z.boolean(),
	});

type MaskInputs = z.infer<ReturnType<typeof createMaskSchema>>;

const Page = () => {
	const params = useParams();
	const slug = params?.organization as string;
	const tCommon = useTranslations('fields');
	const t = useTranslations('common.print_masks');
	const schema = createMaskSchema(tCommon);

	const headerEditorRef = useRef<PlateEditorHandle>(null);
	const footerEditorRef = useRef<PlateEditorHandle>(null);

	const form = useForm<MaskInputs>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			active: true,
		},
	});

	const onSubmit: SubmitHandler<MaskInputs> = async (data) => {
		const headerHtml = await headerEditorRef.current?.getContent();
		const footerHtml = await footerEditorRef.current?.getContent();

		const { error } = await createPrintMask(slug, {
			...data,
			headerHtml: headerHtml ?? '',
			footerHtml: footerHtml ?? '',
		});

		if (error) {
			return toast.error(error, { id: error });
		}

		return redirect(`/${slug}/print-masks`);
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
								<div className="w-full max-w-full border-t h-[15rem]">
									<FormLabel className="p-2 block">
										{tCommon('header_html.label') || 'Header'}
									</FormLabel>
									<PlateEditor ref={headerEditorRef} />
								</div>
								<div className="w-full max-w-full border-t h-[15rem] mt-4">
									<FormLabel className="p-2 block">
										{tCommon('footer_html.label') || 'Footer'}
									</FormLabel>
									<PlateEditor ref={footerEditorRef} />
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