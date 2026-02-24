import * as React from 'react';

import { EmailVerificationTemplate } from '@packages/email-templates';
import { sendEmail } from '../../utils/clients/email';
import { env } from '../../config/env';

export const sendEmailVerification = async (email: string, token: string) => {
	return sendEmail({
		to: email,
		from: env.DEFAULT_EMAIL_FROM,
		subject: 'Verify your email address',
		react: <EmailVerificationTemplate code={token} />,
	});
};
