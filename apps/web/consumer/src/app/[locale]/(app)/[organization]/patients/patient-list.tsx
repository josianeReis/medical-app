import { DataTable } from '@/components/data-table';
import { Button } from '@packages/ui-components';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { GetPatientsResponse } from '@/services/patients';
import { getTranslations } from 'next-intl/server';
import { columns } from './columns';

interface Props {
	patients: GetPatientsResponse;
	organization: string;
}

export default async function PatientsList({ patients, organization }: Props) {
	const t = await getTranslations('common.patient');

	// function handleRemove(id: string) {
	// 	alert('Removido');
	// }

	return (
		<div className=" w-full mx-auto">
			<div className="flex justify-between p-2">
				<div className="font-semibold text-3xl">{t('title-patient-list')}</div>
				<Link href={`/${organization}/patients/new`}>
					<Button>
						<Plus />
						{t('register-patient')}
					</Button>
				</Link>
			</div>

			{/* <ScrollArea className="h-[600px]">
				<table className="w-full text-sm">
					<thead className="items-center justify-center text-left border-b sticky top-0 z-50 bg-white">
						<tr className="text-muted-foreground">
							<th className="py-2 px-2">{t('common.name')}</th>
							<th className="py-2 px-2">{t('common.birth-date')}</th>
							<th className="py-2 px-2">{t('age')}</th>
							<th className="py-2 px-2">{t('common.sex')}</th>
							<th className="py-2 px-2">{t('common.document-type')}</th>
							<th className="py-2 px-2">{t('common.document')}</th>
							<th className="py-2 px-2">{t('common.phone')}</th>
							<th className="py-2 px-2">{t('common.email')}</th>
							<th className="py-2 px-2">{t('edit')}</th>
							<th className="py-2 px-2">{t('delete')}</th>
						</tr>
					</thead>
					<tbody>
						{patients.map((patient) => (
							<tr
								key={patient.id}
								className="items-center justify-center border-b hover:bg-muted/50 transition-colors"
							>
								<td className="py-3 px-2">{patient.name}</td>
								<td className="py-3 px-2">{patient.birthdate}</td>
								<td className="py-3 px-2">10</td>
								<td className="py-3 px-2">{patient.gender}</td>
								<td className="py-3 px-2">{patient.document_type}</td>
								<td className="py-3 px-2">{patient.document}</td>
								<td className="py-3 px-2">{patient.email}</td>
								<td className="py-3 px-2">{patient.phone_number}</td>
								<td>
									<Link href={`/${organization}/patients/${patient.id}`}>
										<Button className="bg-white text-black hover:text-white hover:bg-blue-500">
											<PencilLine className="w-4 h-4" />
										</Button>
									</Link>
								</td>
								<td>
									<Button
										onClick={() => handleRemove(patient.id)}
										className="bg-white text-black hover:text-white hover:bg-red-500"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</ScrollArea> */}
			<DataTable
				columns={columns}
				data={patients.data.items}
				filterColumName="name"
			/>
		</div>
	);
}
