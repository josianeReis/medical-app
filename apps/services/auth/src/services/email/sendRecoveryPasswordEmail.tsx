import * as React from 'react';

import { RecoveryPasswordTemplate } from '@packages/email-templates';

import { sendEmail } from '../../utils/clients/email';

export const sendRecoveryPasswordEmail = async (email: string, token: string, url: string, firstName: string) => {
  return sendEmail({
    to: email,
    subject: 'Reset your password',
    react: <RecoveryPasswordTemplate code={token} link={url} name={firstName} />,
  });
};
