// import { env } from "@/utils/env";

type GetPatientsProps = {
  query?: string;
  sort?: string;
};

export type GetPatientsResponse = {
  picture?: string;
  label: string;
  cpf: string;
};

const PATIENTS_MOCK: GetPatientsResponse[] = [
  {
    cpf: "123.456.789-20",
    label: "Joao da Silva",
    picture:
      "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8",
  },
  {
    cpf: "123.456.789-21",
    label: "Suzete Cristina",
    picture:
      "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8",
  },
  {
    cpf: "123.456.789-22",
    label: "Maria da balança",
    picture:
      "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8",
  },
  {
    cpf: "123.456.789-23",
    label: "Jorge Duarte",
    picture:
      "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8",
  },
];

// export async function getPatients() {
export async function getPatients(props?: GetPatientsProps) {
  console.log("🚀 ~ query:", props?.query);
  // TODO: mock of the fetch, remove after BE is done
  const response = { ok: true, json: () => PATIENTS_MOCK };
  // TODO: use this fetc(...........) after BE is done;
  // const response = await fetch("http://locahost:4010/api/signup/email", {
  //   method: "GET",
  //   body: JSON.stringify({
  //     query,
  //   }),
  // });

  if (response.ok) {
    return response.json();
  }

  // TODO: need to handle errors when we have it nmore mature;
  throw Error("Error not treat on the getPatients method");
}
