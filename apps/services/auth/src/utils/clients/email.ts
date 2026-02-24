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
	// Global hard stop to avoid any outbound email delivery in this environment.
	console.log('[email] Outbound email disabled by security lockdown');
	void to;
	void subject;
	void react;
	void from;
	return Promise.resolve({
		id: 'disabled-outbound-email',
	} as never);
};
