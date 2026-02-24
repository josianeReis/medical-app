import * as React from 'react';

import { RecoveryPasswordTemplate } from '@packages/email-templates';
import { env } from '../../config/env';

import { sendEmail } from '../../utils/clients/email';

export const sendRecoveryPasswordEmail = async (
	email: string,
	token: string,
) => {
	return sendEmail({
		to: email,
		from: env.DEFAULT_EMAIL_FROM,
		subject: 'Reset your password',
		react: <RecoveryPasswordTemplate code={token} />,
	});
};
