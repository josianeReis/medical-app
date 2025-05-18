"use client";
import {
  SearchComboboxData,
  SearchCombobox,
} from "@packages/ui-components/src/components/ui/sarch-combobox";

import { getPatients } from "@/services/patients";
import {
  Button,
  Card,
  CardContent,
  DatePicker,
  NoOptionIcon,
  ScrollArea,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import Editor from "../../../components/editor";
import { Bitcoin } from "lucide-react";

const CreateReport = () => {
  const t = useTranslations("create-report");
  const [patientsList, setPatientsList] = useState<SearchComboboxData[]>([]);

  const [form, setForm] = useState({
    examDate: new Date(),
    examName: "",
    patientName: "",
    dateOfBirth: new Date(),
    age: "",
    sex: "",
    reportText: "",
  });

  const priorities: SearchComboboxData[] = [
    {
      value: "no-priority",
      label: "No priority",
      icon: <NoOptionIcon />,
    },
    {
      value: "urgent",
      label: "Urgent",
      icon: <Bitcoin />,
    },
    { value: "high", label: "High", icon: <Bitcoin /> },
    {
      value: "medium",
      label: "Medium",
      icon: <Bitcoin />,
    },
    { value: "low", label: "Low", icon: <Bitcoin /> },
  ];

  const handleGetPatients = async () => {
    const patients = await getPatients();
    const parsedPatients: SearchComboboxData[] = patients.map((patient) => ({
      icon: patient.picture && (
        <Image
          src={patient.picture}
          alt="Patient profile picture"
          width={50}
          height={50}
        />
      ),
      label: `${patient.label} - CPF: ${patient.cpf} `,
      value: patient.cpf,
    }));
    setPatientsList(parsedPatients);
  };

  useEffect(() => {
    handleGetPatients();
  }, []);

  return (
    <div className="w-full ">
      <Card>
        <div className="flex flex-col md:flex-row gap-4 px-4 pb-4">
          {/* EDITOR */}
          <ScrollArea className="flex-[2] border rounded-md p-2 bg-white shadow h-[500px]">
            <CardContent className="w-[210mm] h-[247.5mm] scale-[auto] origin-top-left print:scale-100 print:w-full print:h-full print:border-none">
              {/* <textarea
              className="w-full h-full resize-none outline-none p-4"
              placeholder={t("reportTextPlaceholder")}
              value={form.reportText}
              onChange={(e) => setForm({ ...form, reportText: e.target.value })}
            /> */}
              <Editor />
            </CardContent>
          </ScrollArea>
          <ScrollArea className="flex-[1] border rounded-md p-2 bg-white shadow h-[500px]">
            <CardContent className="w-[210mm] h-[247.5mm] scale-[0.5] origin-top-left print:scale-100 print:w-full print:h-full print:border-none">
              <div className="prose">
                <h2 className="text-xl font-semibold mb-2">
                  {form.examName || t("examNamePlaceholder")}
                </h2>
                <p>
                  <strong>{t("patientName")}:</strong> {form.patientName || "-"}
                </p>
                <p>
                  <strong>{t("dateOfBirth")}:</strong>{" "}
                  {form.examDate
                    ? form.examDate.toLocaleDateString("pt-BR")
                    : "-"}
                </p>
                <p>
                  <strong>{t("sex")}:</strong> {form.sex || "-"}
                </p>
                <p>
                  <strong>{t("age")}:</strong> {form.age || "-"}
                </p>
                <p>
                  <strong>{t("examDate")}:</strong>{" "}
                  {form.examDate
                    ? form.examDate.toLocaleDateString("pt-BR")
                    : "-"}
                </p>
                <hr className="my-4" />
                <p>{form.reportText || t("reportTextPlaceholder")}</p>
              </div>
            </CardContent>
          </ScrollArea>
        </div>
        <div className="flex flex-row gap-2 flex-wrap px-4 pb-4">
          <DatePicker
            onValueChange={(date) => setForm({ ...form, examDate: date })}
          />
          <SearchCombobox name="Nome do exame" data={patientsList} />
          <SearchCombobox name="Nome do paciente" data={patientsList} />
          <DatePicker
            onValueChange={(date) => setForm({ ...form, dateOfBirth: date })}
          />
          <SearchCombobox name="Idade" data={priorities} />
          <SearchCombobox name="Sexo" data={priorities} />
        </div>
        <div className="flex flex-wrap gap-2 justify-end px-4 pb-4">
          <Button
            size="sm"
            className="w-fit px-4 h-8  text-[0.8125rem] leading-normal font-medium"
          >
            {t("salveButton")}
          </Button>
          <Button
            size="sm"
            className="w-fit px-4 h-8  text-[0.8125rem] leading-normal font-medium"
          >
            {t("printButton")}
          </Button>
        </div>

        {/* <CardFooter>
          <UploadImage></UploadImage>  
          <Button className="ml-auto p-4">{t("cancelButton")}</Button> */}
        {/* </CardFooter> */}
      </Card>
    </div>
  );
};

export default CreateReport;
