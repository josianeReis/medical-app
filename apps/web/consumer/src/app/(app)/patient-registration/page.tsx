/* eslint-disable @typescript-eslint/no-unused-vars */
// app/patient-register/page.tsx

"use client";

import { useForm } from "react-hook-form";
import { Input } from "../../../../../../../packages/ui-components/src/components/ui/input";
import { Label } from "../../../../../../../packages/ui-components/src/components/ui/label";
import { Button } from "../../../../../../../packages/ui-components/src/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../../../packages/ui-components/src/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../packages/ui-components/src/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

type PatientFormData = {
  name: string;
  birthDate: string;
  age: string;
  gender: string;
  rg: string;
  cpf: string;
  healthInsurance: string;
  phone: number;
  email: string;
};

export default function PatientRegistration() {

  const [patientName, setPatientName] = useState('')

  function handlePatientRegistration() {
    const data = {
      patientName
    } 
    console.log(data)
  }

  const { register, handleSubmit, setValue } = useForm<PatientFormData>();

  const onSubmit = (data: PatientFormData) => {
    console.log("Paciente cadastrado:", data);
  };

  return (
    
    <div className="w-180 mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center p-2">
          <CardTitle className="ml-4 text-2xl">Cadastro de Paciente</CardTitle>
          <Button variant="outline" asChild className="ml-85 font-bold">
            <Link href="/patient-list">
              <ChevronLeft />
              Voltar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Nome Completo
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="João da Silva"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="birthDate" className="mb-2">
                Data de Nascimento
              </Label>
              <Input id="birthDate" type="date" {...register("birthDate")} />
            </div>
            <div>
              <Label htmlFor="age" className="mb-2">
                Idade
              </Label>
              <Input id="age" type="date" {...register("age")} />
            </div>

            <div>
              <Label htmlFor="gender" className="mb-2">
                Sexo
              </Label>
              <Select onValueChange={(value) => setValue("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rg" className="mb-2">
                RG
              </Label>
              <Input id="rg" {...register("rg")} placeholder="12.345.678-9" />
            </div>

            <div>
              <Label htmlFor="cpf" className="mb-2">
                CPF
              </Label>
              <Input
                id="cpf"
                {...register("cpf")}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="flex flex-row gap-2">
              <Label htmlFor="healthInsurance" className="mb-2">
                Convênio
              </Label>
              <Input
                id="healthInsurance"
                placeholder="Ex: Unimed, Amil, SulAmérica"
                {...register("healthInsurance")}
              />
              <Label htmlFor="healthInsurance" className="mb-2">
                Número
              </Label>
              <Input
                id="healthInsurance"
                placeholder="Digite o número da carteirinha"
                {...register("healthInsurance")}
              />
            </div>

            <div>
              <Label htmlFor="phone" className="mb-2">
                Telefone
              </Label>
              <Input
                id="phone"
                placeholder="+55 ( ) 00000-0000"
                {...register("phone")}
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@gmail.com"
                {...register("email")}
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Salvar 
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
