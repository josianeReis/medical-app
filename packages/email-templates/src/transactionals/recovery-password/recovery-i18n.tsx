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
import { useTranslations } from "next-intl";

interface RecoveryPasswordTemplateProps {
  code: string;
}

export const RecoveryPasswordTemplate: React.FC<
  RecoveryPasswordTemplateProps
> = ({ code }) => {
  const t = useTranslations("recovery-password");

  return (
    <Html>
      <Head />
      <Preview>{t("title")}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t("heading")}</Heading>
          <Text style={text}>{t("hi")}</Text>
          <Text style={text}>{t("description")}</Text>

          <div style={codeStyle}>{code}</div>
          <Text style={text}>{t("ignore-email")}</Text>
          <Text style={footer}>{t("automated-message")}</Text>
        </Container>
      </Body>
    </Html>
  );
};

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

export default RecoveryPasswordTemplate;
