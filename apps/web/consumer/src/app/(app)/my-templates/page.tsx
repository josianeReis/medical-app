"use client";

import {
  Card,
  CardHeader,
} from "@packages/ui-components/src/components/ui/card";
import { ScrollArea } from "@packages/ui-components/src/components/ui/scroll-area";
import { cn } from "@packages/ui-components/src/libs/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

const statusColors = {
  filled: "bg-green-500",
  empty: "bg-gray-300",
  alert: "bg-red-500",
};

const statusDot = (type: keyof typeof statusColors) => (
  <div className={cn("w-2 h-2 rounded-full", statusColors[type])} />
);

const templates = [
  {
    num: 1895,
    date: "24/04/25 - 15:32",
    name: "Naiara Regina Filó Fonseca",
    exam: "Ultrassonografia Pélvica Transvaginal",
    status: ["filled", "filled", "filled", "filled", "empty", "empty", "empty"],
    doctor: "Dr. Igor Bernardes M. de Melo",
    requester: "?",
  },
  {
    num: 1892,
    date: "24/04/25 - 15:06",
    name: "Mirela Rodrigues da Luz",
    exam: "Eletrocardiograma",
    status: ["alert", "empty", "empty", "empty", "empty", "empty", "empty"],
    doctor: "Dr. Igor Bernardes M. de Melo",
    requester: "?",
  },
  // adicione mais registros aqui
];

export default function MyTemplates() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="p-4">
        <CardHeader className="flex flex-row p-2">
          <div className="font-semibold text-3xl">
            Meus templates
          </div>
          <Link href="#" className="ml-175">
            <Plus className="w-10 h-10"></Plus>
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
                <th className="py-2 px-2">S D I L E P A</th>
                <th className="py-2 px-2">EXAMINADOR</th>
                <th className="py-2 px-2">SOLICITANTE</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((p) => (
                <tr
                  key={p.num}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-2">{p.num}</td>
                  <td className="py-3 px-2">{p.date}</td>
                  <td className="py-3 px-2">{p.name}</td>
                  <td className="py-3 px-2">{p.exam}</td>
                  <td className="py-3 px-2">
                    <div className="flex gap-1">
                      {p.status.map((s, i) => (
                        <div key={i}>
                          {statusDot(s as keyof typeof statusColors)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2">{p.doctor}</td>
                  <td className="py-3 px-2">{p.requester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
    </div>
  );
}
