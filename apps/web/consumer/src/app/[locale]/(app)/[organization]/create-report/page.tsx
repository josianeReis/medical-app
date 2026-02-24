'use client';

import Link from 'next/link';

import { getProcedures } from '@/services/procedure';
import {
	Card,
	CardContent,
	Label,
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
	PlateEditor,
	ResizablePanelGroup,
	ResizablePanel,
	ScrollArea,
	ResizableHandle,
	CardFooter,
	Button,
} from '@packages/ui-components';
import { useEffect, useState } from 'react';
import PrintPreview from '@/components/print-previw';
import { useParams } from 'next/navigation';

export const simulateBackendResponse = (
	title: string,
	equipament: string,
): any =>
	`<div class="slate-editor" data-slate-editor="true" data-slate-node="value"><div data-slate-node="element" data-block-id="OYgwnI3w_m" data-slate-type="p" data-slate-align="center" data-slate-id="OYgwnI3w_m" class="slate-p slate-align-center" style="position:relative;text-align:center"><span data-slate-node="text"><span data-slate-leaf="true" data-slate-bold="true" data-slate-underline="true"><u class="slate-underline"><strong class="slate-bold"><span data-slate-string="true">${title}</span></strong></u></span></span></div><div data-slate-node="element" data-block-id="BArY-B5_UL" data-slate-type="p" data-slate-id="BArY-B5_UL" class="slate-p" style="position:relative"><span data-slate-node="text"><span data-slate-leaf="true"><span data-slate-string="true">${equipament}</span></span></span></div></div>`;

export default function CreateReport() {
	const params = useParams();
	const slug = params?.organization as string;
	const [procedures, setProcedures] = useState<any[]>([]);
	const [editorValue, setEditorValue] = useState<string>('');
	const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(
		null,
	);

	useEffect(() => {
		const fetchData = async () => {
			const procedures = await getProcedures(slug);
			setProcedures(procedures.data.items);
		};

		fetchData();
	}, [slug]);

	const handleProcedureChange = (procedureId: string) => {
		const procedure = procedures.find((p) => p.id === procedureId);
		if (!procedure) return;

		setSelectedProcedureId(procedureId);

		setEditorValue(
			simulateBackendResponse(
				procedure.name.toUpperCase(),
				procedure.equipament,
			),
		);
	};

	const handlePrint = () => {
		window.print();
	};
	return (
		<>
			<ResizablePanelGroup
				direction="horizontal"
				className="min-h-[200px] gap-2 p-2 rounded-lg border md:min-w-[450px]"
			>
				<ResizablePanel defaultSize={70}>
					<div className="flex h-full items-center justify-center">
						<Card className="min-w-[450px] items-center justify-center">
							<CardContent>
								<ScrollArea className="h-[400px] sm:h-[400px] md:h-[500px] lg:h-[650px] xl:h-[700px] w-full">
									<div className="flex items-center p-4 gap-2">
										<div className="w-full space-y-2">
											<Label>Paciente</Label>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder="Selecione um paciente" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="teste">Paciente de teste</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="w-full space-y-2">
											<Label>Exame</Label>
											<Select onValueChange={handleProcedureChange}>
												<SelectTrigger>
													<SelectValue placeholder="Selecione um procedimento" />
												</SelectTrigger>
												<SelectContent>
													{procedures.map((procedure) => (
														<SelectItem key={procedure.id} value={procedure.id}>
															{procedure.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="w-full max-w-full border-t">
										<PlateEditor
											key={selectedProcedureId ?? 'default'}
											initialValue={editorValue}
										/>
									</div>
								</ScrollArea>
							</CardContent>
						</Card>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={30}>
					<div
						id="print-area"
						className="flex h-full items-center justify-center"
					>
						<Card>
							<CardContent>
								<ScrollArea className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] xl:h-[700px] w-full">
									<PrintPreview />
								</ScrollArea>
							</CardContent>
						</Card>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
			<CardFooter className="justify-end">
				<div className="flex gap-2">
					<Button onClick={handlePrint}>Imprimir</Button>
					<Button>
						<Link href={`/${params.organization}/dashboard`}>Cancelar</Link>
					</Button>
				</div>
			</CardFooter>
		</>
	);
}
