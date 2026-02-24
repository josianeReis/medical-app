'use client';

import { publishReport, updateReport } from '@/services/reports';
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
    PlateEditor,
    PlateEditorHandle,
    ScrollArea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@packages/ui-components';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

interface Props {
    report: MedicalReport;
    patients: Patient[];
    procedures: Procedure[];
    templates: Template[];
    printMasks: PrintMask[];
    slug: string;
}

const schema = z.object({
    patientId: z.string().min(1),
    procedureId: z.string().min(1),
    templateId: z.string().min(1),
    printMaskId: z.string().min(1),
});

type Inputs = z.infer<typeof schema>;

export default function EditReportForm({ report, patients, procedures, templates, printMasks, slug }: Props) {

    const tCommon = useTranslations('fields');
    const t = useTranslations('common.reports');

    const editorRef = useRef<PlateEditorHandle>(null);
    const [previewHtml, setPreviewHtml] = useState<string>(report.htmlContent ?? '');

    const form = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            patientId: report.patientId,
            procedureId: report.procedureId,
            templateId: report.templateId,
            printMaskId: report.printMaskId,
        },
    });

    const printMaskIdWatch = form.watch('printMaskId');

    // Update preview when mask changes
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

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const htmlContent = await editorRef.current?.getContent();
        const { error, message } = await updateReport(slug, report.id, {
            ...data,
            htmlContent,
        });
        if (error) {
            toast.error(error);
        } else {
            toast.success(message);
            redirect(`/${slug}/reports/${report.id}`);
        }
    };

    async function handlePublish() {
        const { error, message } = await publishReport(slug, report.id);
        if (error) {
            toast.error(error);
        } else {
            toast.success(message);
            redirect(`/${slug}/reports/${report.id}`);
        }
    }

    return (
        <Card>
            <FormProvider {...form}>
                <CardContent className="p-4 space-y-4">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="patientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tCommon('patient.label')}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormItem>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={tCommon('patient.placeholder')} />
                                                </SelectTrigger>
                                            </FormItem>
                                            <SelectContent>
                                                {patients.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormItem>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={tCommon('procedure.placeholder')} />
                                                </SelectTrigger>
                                            </FormItem>
                                            <SelectContent>
                                                {procedures.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
                                            <FormItem>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={tCommon('template.placeholder')} />
                                                </SelectTrigger>
                                            </FormItem>
                                            <SelectContent>
                                                {templates.map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
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
                                        <FormLabel>Print Mask</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormItem>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormItem>
                                            <SelectContent>
                                                {printMasks.map((m) => (
                                                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <ScrollArea className="border rounded-md">
                            <PlateEditor ref={editorRef} initialValue={report.htmlContent ?? ''} />
                        </ScrollArea>
                        <div className="border rounded-md p-2 bg-gray-50">
                            <FormLabel className="block mb-2">Preview</FormLabel>
                            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </div>
                        <CardFooter className="flex justify-end gap-2">
                            {report.status === 'draft' && (
                                <Button variant="default" type="button" onClick={handlePublish}>
                                    {t('publish') || 'Publish'}
                                </Button>
                            )}
                            <Button type="submit">{t('save_changes')}</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </FormProvider>
        </Card>
    );
}