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
	from = env.DEFAULT_EMAIl_FROM,
}: SendEmailProps) => {
	return resend.emails.send({
		from,
		to,
		subject,
		react,
	});
};
