import * as React from 'react';

import { sendEmail } from '../../utils/clients/email';
import { env } from '../../config/env';
import { EmailSignInTemplate } from '@packages/email-templates';

export const sendSignInEmail = async (email: string, token: string) => {
	return sendEmail({
		to: email,
		from: env.DEFAULT_EMAIL_FROM,
		subject: 'Your sign in code',
		react: <EmailSignInTemplate code={token} />,
	});
};
