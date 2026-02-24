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

interface EmailVerificationTemplateProps {
  code: string;
}

export const EmailVerificationTemplate: React.FC<
  EmailVerificationTemplateProps
> = ({ code }) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Confirm your email</Heading>
          <Text style={text}>Hi,</Text>
          <Text style={text}>
            Thanks for signing up! Please confirm your email address by using
            the verification code below.
          </Text>
          <div style={codeStyle}>{code}</div>

          <Text style={text}>
            If you didn't create an account with us, you can safely ignore this
            email.
          </Text>
          <Text style={footer}>
            This is an automated message, please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

(EmailVerificationTemplate as any).PreviewProps = {
  name: "John Doe",
  link: "https://example.com",
  code: "123456",
};

export default EmailVerificationTemplate;

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
