import * as React from 'react';

import { EmailVerificationTemplate } from '@packages/email-templates';
import { sendEmail } from '../../utils/clients/email';

export const sendEmailVerification = async (email: string, token: string, url: string, firstName: string) => {
  return sendEmail({
    to: email,
    subject: 'Verify your email address',
    react: <EmailVerificationTemplate code={token} link={url} name={firstName} />,
  });
};
