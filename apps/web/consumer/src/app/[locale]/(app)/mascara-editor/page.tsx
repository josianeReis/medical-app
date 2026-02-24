'use client';

import { useParams } from "next/navigation";
import type React from 'react';
import { useState, useRef } from 'react';
import {
	Upload,
	Download,
	Printer,
	Eye,
	Settings,
	ChevronLeft,
} from 'lucide-react';
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Separator,
} from '@packages/ui-components';
import Link from 'next/link';

interface MascaraData {
	clinicName: string;
	address: string;
	phone: string;
	email: string;
	logo: string;
	doctorName: string;
	crm: string;
	specialty: string;
	patientName: string;
	patientAge: string;
	examType: string;
	examDate: string;
	findings: string;
	conclusion: string;
}

export default function MascaraEditor() {
  const params = useParams();
   const slug = params?.organization as string;
	const [MascaraData, setMascaraData] = useState<MascaraData>({
		clinicName: 'Clínica Médica Exemplo',
		address: 'Rua das Flores, 123 - Centro - São Paulo/SP',
		phone: '(11) 1234-5678',
		email: 'contato@clinica.com.br',
		logo: '',
		doctorName: 'Dr. João Silva',
		crm: 'CRM/SP 123456',
		specialty: 'Radiologia',
		patientName: 'Nome do Paciente',
		patientAge: '45 anos',
		examType: 'Radiografia de Tórax',
		examDate: new Date().toLocaleDateString('pt-BR'),
		findings: 'Descreva aqui os achados do exame...',
		conclusion: 'Conclusão do laudo médico...',
	});

	const [showPreview, setShowPreview] = useState(true);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const printRef = useRef<HTMLDivElement>(null);

	const handleInputChange = (field: keyof MascaraData, value: string) => {
		setMascaraData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				handleInputChange('logo', e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handlePrint = () => {
		window.print();
	};

	const handleSaveMascara = () => {
		const dataStr = JSON.stringify(MascaraData, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'mascara-laudo.json';
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Mascaras</h1>
					<Button>
						<ChevronLeft />
						<Link href={`/${slug}/dashboard`}>Voltar</Link>
					</Button>
				</div>
				<p className="text-gray-600 mb-4">Customize sua mascara para impresão</p>

				{/* Toolbar */}
				<div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
					<div className="flex items-center gap-4 flex-wrap">
						<Button
							variant={showPreview ? 'default' : 'outline'}
							onClick={() => setShowPreview(true)}
							className="flex items-center gap-2"
						>
							<Eye className="w-4 h-4" />
							Visualizar
						</Button>
						<Button
							variant={!showPreview ? 'default' : 'outline'}
							onClick={() => setShowPreview(false)}
							className="flex items-center gap-2"
						>
							<Settings className="w-4 h-4" />
							Editar
						</Button>
						<Separator orientation="vertical" className="h-6" />
						<Button
							onClick={handlePrint}
							variant="outline"
							className="flex items-center gap-2 bg-transparent"
						>
							<Printer className="w-4 h-4" />
							Imprimir
						</Button>
						<Button
							onClick={handleSaveMascara}
							variant="outline"
							className="flex items-center gap-2 bg-transparent"
						>
							<Download className="w-4 h-4" />
							Salvar mascara
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Editor Panel */}
					{!showPreview && (
						<div className="lg:col-span-1 space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Dados da Clínica</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Label htmlFor="logo">Logo da Clínica</Label>
										<div className="mt-2">
											<Button
												onClick={() => fileInputRef.current?.click()}
												variant="outline"
												className="w-full flex items-center gap-2"
											>
												<Upload className="w-4 h-4" />
												Upload Logo
											</Button>
											<input
												ref={fileInputRef}
												type="file"
												accept="image/*"
												onChange={handleLogoUpload}
												className="hidden"
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="clinicName">Nome da Clínica</Label>
										<Input
											id="clinicName"
											value={MascaraData.clinicName}
											onChange={(e) =>
												handleInputChange('clinicName', e.target.value)
											}
										/>
									</div>
									<div>
										<Label htmlFor="address">Endereço</Label>
										<textarea
											id="address"
											value={MascaraData.address}
											onChange={(e) =>
												handleInputChange('address', e.target.value)
											}
											rows={2}
										/>
									</div>
									<div>
										<Label htmlFor="phone">Telefone</Label>
										<Input
											id="phone"
											value={MascaraData.phone}
											onChange={(e) =>
												handleInputChange('phone', e.target.value)
											}
										/>
									</div>
									<div>
										<Label htmlFor="email">E-mail</Label>
										<Input
											id="email"
											value={MascaraData.email}
											onChange={(e) =>
												handleInputChange('email', e.target.value)
											}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Dados do Médico</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Label htmlFor="doctorName">Nome do Médico</Label>
										<Input
											id="doctorName"
											value={MascaraData.doctorName}
											onChange={(e) =>
												handleInputChange('doctorName', e.target.value)
											}
										/>
									</div>
									<div>
										<Label htmlFor="crm">CRM</Label>
										<Input
											id="crm"
											value={MascaraData.crm}
											onChange={(e) => handleInputChange('crm', e.target.value)}
										/>
									</div>
									<div>
										<Label htmlFor="specialty">Especialidade</Label>
										<Input
											id="specialty"
											value={MascaraData.specialty}
											onChange={(e) =>
												handleInputChange('specialty', e.target.value)
											}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Dados do Exame</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Label htmlFor="patientName">Nome do Paciente</Label>
										<Input
											id="patientName"
											value={MascaraData.patientName}
											onChange={(e) =>
												handleInputChange('patientName', e.target.value)
											}
										/>
									</div>
									<div>
										<Label htmlFor="patientAge">Idade</Label>
										<Input
											id="patientAge"
											value={MascaraData.patientAge}
											onChange={(e) =>
												handleInputChange('patientAge', e.target.value)
											}
										/>
									</div>
									<div>
										<Label htmlFor="examType">Tipo de Exame</Label>
										<Input
											id="examType"
											value={MascaraData.examType}
											onChange={(e) =>
												handleInputChange('examType', e.target.value)
											}
										/>
									</div>
									<div>
										<Label htmlFor="examDate">Data do Exame</Label>
										<Input
											id="examDate"
											type="date"
											value={MascaraData.examDate}
											onChange={(e) =>
												handleInputChange('examDate', e.target.value)
											}
										/>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* A4 Preview */}
					<div
						className={`${showPreview ? 'lg:col-span-4' : 'lg:col-span-3'} flex justify-center`}
					>
						<div
							className="bg-white shadow-lg"
							style={{ width: '210mm', minHeight: '297mm' }}
						>
							<div ref={printRef} className="p-8 h-full">
								{/* Header */}
								<div className="flex items-start justify-between mb-8">
									<div className="flex-1">
										{MascaraData.logo && (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={MascaraData.logo || '/placeholder.svg'}
												alt="Logo"
												className="w-20 h-20 object-contain mb-4"
											/>
										)}
										<h1 className="text-2xl font-bold mb-2">
											{MascaraData.clinicName}
										</h1>
										<div className="text-sm text-gray-600 space-y-1">
											<p>{MascaraData.address}</p>
											<p>
												Tel: {MascaraData.phone} | E-mail: {MascaraData.email}
											</p>
										</div>
									</div>
								</div>

								<Separator className="my-6" />

								{/* Patient Info */}
								<div className="grid grid-cols-2 gap-4 mb-6">
									<div>
										<strong>Paciente:</strong> {MascaraData.patientName}
									</div>
									<div>
										<strong>Idade:</strong> {MascaraData.patientAge}
									</div>
									<div>
										<strong>Exame:</strong> {MascaraData.examType}
									</div>
									<div>
										<strong>Data:</strong> {MascaraData.examDate}
									</div>
								</div>

								<Separator className="my-6" />

								{/* Findings */}
								<div className="mb-6">
									<h3 className="font-bold text-gray-800 mb-3">ACHADOS:</h3>
									<div className="min-h-[200px] p-4 border border-gray-200 rounded">
										{!showPreview ? (
											<textarea
												value={MascaraData.findings}
												onChange={(e) =>
													handleInputChange('findings', e.target.value)
												}
												className="w-full h-full border-none resize-none focus:ring-0"
												placeholder="Descreva os achados do exame..."
											/>
										) : (
											<p className="whitespace-pre-wrap">
												{MascaraData.findings}
											</p>
										)}
									</div>
								</div>

								{/* Conclusion */}
								<div className="mb-8">
									<h3 className="font-bold text-gray-800 mb-3">CONCLUSÃO:</h3>
									<div className="min-h-[100px] p-4 border border-gray-200 rounded">
										{!showPreview ? (
											<textarea
												value={MascaraData.conclusion}
												onChange={(e) =>
													handleInputChange('conclusion', e.target.value)
												}
												className="w-full h-full border-none resize-none focus:ring-0"
												placeholder="Conclusão do laudo..."
											/>
										) : (
											<p className="whitespace-pre-wrap">
												{MascaraData.conclusion}
											</p>
										)}
									</div>
								</div>

								{/* Signature */}
								<div className="mt-16 text-center">
									<div className="border-t border-gray-400 w-64 mx-auto mb-2"></div>
									<div className="font-semibold">{MascaraData.doctorName}</div>
									<div className="text-sm text-gray-600">{MascaraData.crm}</div>
									<div className="text-sm text-gray-600">
										{MascaraData.specialty}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx global>{`
				@media print {
					body * {
						visibility: hidden;
					}
					.print-area,
					.print-area * {
						visibility: visible;
					}
					.print-area {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
					}
					@page {
						size: A4;
						margin: 0;
					}
				}
			`}</style>
		</div>
	);
}
