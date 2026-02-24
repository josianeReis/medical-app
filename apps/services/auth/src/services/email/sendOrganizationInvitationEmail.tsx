import * as React from 'react';

import { sendEmail } from '../../utils/clients/email';
import { env } from '../../config/env';
import {
	OrganizationInvitationTemplate,
	OrganizationInvitationTemplateProps,
} from '@packages/email-templates';

export const sendOrganizationInvitation = async (
	data: OrganizationInvitationTemplateProps,
) => {
	return sendEmail({
		to: data.email,
		from: env.DEFAULT_EMAIL_FROM,
		subject: 'Your sign in code',
		react: <OrganizationInvitationTemplate {...data} />,
	});
};
