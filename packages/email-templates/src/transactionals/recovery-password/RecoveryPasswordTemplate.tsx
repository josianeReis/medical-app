import * as React from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface RecoveryPasswordTemplateProps {
  name: string;
  link: string;
  code: string;
}

export const RecoveryPasswordTemplate: React.FC<
  RecoveryPasswordTemplateProps
> = ({ name, link, code }) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We received a request to reset your password. Click the button below
            to create a new password or use the verification code.
          </Text>
          <Section style={buttonContainer}>
            <Button
              style={{
                ...button,
                padding: '12px 20px',
              }}
              href={link}
            >
              Reset Password
            </Button>
          </Section>
          <Text style={text}>Or use this verification code:</Text>
          <div style={codeStyle}>{code}</div>
          <Text style={text}>
            If you didn't request a password reset, you can safely ignore this
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

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const buttonContainer = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#007bff',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
};

const codeStyle = {
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  letterSpacing: '4px',
  padding: '12px 24px',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

export default RecoveryPasswordTemplate;
