import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface EmailSignInTemplateProps {
  code: string;
}

export const EmailSignInTemplate: React.FC<EmailSignInTemplateProps> = ({
  code,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Your login code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your login code</Heading>
          <Text style={text}>Hi,</Text>
          <Text style={text}>
            Use the verification code below to sign in to your account. This
            code is valid for a short time and can only be used once.
          </Text>
          <div style={codeStyle}>{code}</div>

          <Text style={text}>
            If you didn't try to log in, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            This is an automated message — please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

(EmailSignInTemplate as any).PreviewProps = {
  code: "123456",
};

export default EmailSignInTemplate;

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

const codeStyle = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  letterSpacing: "4px",
  padding: "12px 24px",
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};
