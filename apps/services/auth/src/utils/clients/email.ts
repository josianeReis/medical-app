import { Resend } from 'resend';
import { env } from '../../config/env';

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailProps = {
	to: string;
	subject: string;
	react: React.ReactNode;
	from?: string;
};

export const sendEmail = ({
	to,
	subject,
	react,
	from = env.DEFAULT_EMAIL_FROM,
}: SendEmailProps) => {
	if (env.DISABLE_OUTBOUND_EMAIL) {
		// Hard stop for test environments to avoid notifying real users.
		console.log('[email] Outbound email disabled by DISABLE_OUTBOUND_EMAIL=true');
		return Promise.resolve({
			id: 'disabled-outbound-email',
		} as never);
	}

	return resend.emails.send({
		from,
		to,
		subject,
		react,
	});
};
