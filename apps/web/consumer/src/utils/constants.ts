export const statesOfBrazil = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

export enum OrganizationRole {
  OWNER = "owner",
  DOCTOR = "doctor",
  SECRETARY = "secretary",
  PATIENT = "patient"
}

export const inviteMemberRoles = [
  [OrganizationRole.DOCTOR],
  [OrganizationRole.SECRETARY],
];


