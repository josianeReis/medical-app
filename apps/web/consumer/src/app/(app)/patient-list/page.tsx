// app/patients/page.tsx

"use client";

import { Button } from "@packages/ui-components";
import {
  Card,
  CardHeader,
} from "@packages/ui-components/src/components/ui/card";
import { ScrollArea } from "@packages/ui-components/src/components/ui/scroll-area";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialPatients = [
  {
    id: 1891,
    date: "24/04/25 - 15:32",
    name: "Naiara Regina Filó Fonseca",
    examType: "Ultra Pélvica Transvaginal",
    status: "requested",
    doctor: "Dr. Igor M. de Melo",
    requester: "Dr Mushu ",
  },
  {
    id: 1892,
    date: "24/04/25 - 15:06",
    name: "Mirela Rodrigues da Luz",
    examType: "Eletrocardiograma",
    status: "sent",
    doctor: "Dr. Igor M. de Melo",
    requester: "Dr Victor Lúcio ",
  },
  {
    id: 1893,
    date: "24/04/25 - 15:06",
    name: "Alison da Cruz Souza",
    examType: "Abdomen total",
    status: "reported",
    doctor: "Dr. Igor M. de Melo",
    requester: "Dr Josiane  ",
  },

  {
    id: 1894,
    date: "24/04/25 - 15:06",
    name: "Celina da Silva Silvano",
    examType: "Ultrassonografia",
    status: "published",
    doctor: "Dr. Igor M. de Melo",
    requester: "DR Lucas  ",
  },
];

export default function PatientList() {
  const [patientsList, setPatientsList] = useState(initialPatients);

  function onDelete(id: number) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este item?"
    );

    if (confirmed) {
      const updatedList = patientsList.filter((patient) => patient.id !== id);
      setPatientsList(updatedList);
    }
  }

  return (
    <div className="p-6 w-full mx-auto">
      <Card className="p-4">
        <CardHeader className="flex flex-row p-2">
          <div className="font-semibold text-3xl">Pacientes</div>
          <Link href="/patient-registration" className="ml-auto">
            <Plus className="w-10 h-10" />
          </Link>
        </CardHeader>

        <ScrollArea className="h-[600px]">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr className="text-muted-foreground">
                <th className="py-2 px-2">NÚM.</th>
                <th className="py-2 px-2">DATA/HORA</th>
                <th className="py-2 px-2">PACIENTE</th>
                <th className="py-2 px-2">EXAME</th>
                <th className="py-2 px-2">STATUS</th>
                <th className="py-2 px-2">EXAMINADOR</th>
                <th className="py-2 px-2">SOLICITANTE</th>
                <th className="py-2 px-2">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {patientsList.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-2">{patient.id}</td>
                  <td className="py-3 px-2">{patient.date}</td>
                  <td className="py-3 px-2">{patient.name}</td>
                  <td className="py-3 px-2">{patient.examType}</td>
                  <td className="py-3 px-2">{patient.status}</td>
                  <td className="py-3 px-2">{patient.doctor}</td>
                  <td className="py-3 px-2">{patient.requester}</td>
                  <td className="py-3 px-2">
                    <div className="flex flex-row gap-2">
                      <Button
                        className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded hover:border-b hover:bg-muted/100 transition"
                        asChild
                      >
                        <Link href={`/patient-registration?id=${patient.id}`}>
                          <PencilLine className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        className="bg-white text-black hover:text-white hover:bg-red-500"
                        onClick={() => onDelete(patient.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
    </div>
  );
}
