import { env } from '@/infrastructure/config/env';
import { createI18n } from '@/infrastructure/config/i18n';
import { patientRoutes } from '@/interfaces/http/routes/patient.routes';
import { Elysia } from 'elysia';
// Register custom TypeBox formats (phone, etc.)
import '@/infrastructure/plugins/elysia-validators';
import { errorPlugin } from '@/infrastructure/plugins/error-plugin';
import { i18nPlugin } from '@/infrastructure/plugins/i18n-plugin';
import { cors } from '@elysiajs/cors';
import { categoryRoutes } from '@/interfaces/http/routes/category.routes';
import { procedureRoutes } from '@/interfaces/http/routes/procedure.routes';
import { templateRoutes } from '@/interfaces/http/routes/template.routes';
import { appointmentRoutes } from '@/interfaces/http/routes/appointment.routes';
import { queueRoutes } from '@/interfaces/http/routes/queue.routes';
import { printMaskRoutes } from '@/interfaces/http/routes/print-mask.routes';
import { swagger } from '@elysiajs/swagger';
import { notificationRoutes } from '@/interfaces/http/routes/notification.routes';
import { reportRoutes } from '@/interfaces/http/routes/report.routes';

createI18n();

const app = new Elysia({ prefix: '/api' })
	.use(swagger())
	.use(cors())
	.onRequest(({ request }) => {
		// eslint-disable-next-line no-console
		console.log(
			`[${new Date().toISOString()}] ${request.method} ${request.url}`,
		);
	})
	.onError(({ error, request }) => {
		// eslint-disable-next-line no-console
		console.error('🚀 ~ .onError ~ error:', error);
		// eslint-disable-next-line no-console
		console.error(`[ERROR] ${request.method} ${request.url}:`, error);
	})
	.get('/health', ({ status }) => status(200))
	.use(i18nPlugin)
	// .use(createAuthMacroPlugin())
	.use(errorPlugin)
	.group('/organizations/:organizationId', (app) =>
		app
			.use(patientRoutes)
			.use(categoryRoutes)
			.use(procedureRoutes)
			.use(templateRoutes)
			.use(appointmentRoutes)
			.use(queueRoutes)
			.use(printMaskRoutes)
			.use(notificationRoutes)
			.use(reportRoutes),
	);
app.listen(env.API_PORT, () => {
	// eslint-disable-next-line no-console
	console.log(
		`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
	);
});
