import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
  Button,
} from "@react-email/components";

export interface OrganizationInvitationTemplateProps {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

export const OrganizationInvitationTemplate: React.FC<
  OrganizationInvitationTemplateProps
> = ({ invitedByUsername, invitedByEmail, teamName, inviteLink }) => {
  return (
    <Html>
      <Head />
      <Preview>Você foi convidado para se juntar ao {teamName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Convite para o time</Heading>

          <Text style={text}>Olá!</Text>

          <Text style={text}>
            <strong>{invitedByUsername}</strong> ({invitedByEmail}) convidou
            você para se juntar ao time <strong>{teamName}</strong>.
          </Text>

          <Text style={text}>
            Para aceitar o convite e começar a colaborar com o time, clique no
            botão abaixo:
          </Text>

          <div style={buttonContainer}>
            <Button href={inviteLink} style={button}>
              Aceitar Convite
            </Button>
          </div>

          <Text style={text}>Ou copie e cole este link no seu navegador:</Text>

          <div style={linkStyle}>
            <Link href={inviteLink} style={linkText}>
              {inviteLink}
            </Link>
          </div>

          <Text style={text}>
            Se você não esperava este convite ou não conhece quem o enviou, pode
            ignorar este email com segurança.
          </Text>

          <Text style={footer}>
            Esta é uma mensagem automática — por favor, não responda a este
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

(OrganizationInvitationTemplate as any).PreviewProps = {
  email: "usuario@exemplo.com",
  invitedByUsername: "João Silva",
  invitedByEmail: "joao@empresa.com",
  teamName: "Equipe de Desenvolvimento",
  inviteLink: "https://app.exemplo.com/convites/abc123",
};

export default OrganizationInvitationTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  lineHeight: "1.25",
};

const linkStyle = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  padding: "12px",
  margin: "0 0 20px",
  wordBreak: "break-all" as const,
};

const linkText = {
  color: "#007ee6",
  fontSize: "14px",
  textDecoration: "none",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};
