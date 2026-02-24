import { Elysia } from 'elysia';
import i18next from 'i18next';

export const i18nPlugin = new Elysia({ name: 'i18n' }).derive(
	async ({ request }) => {
		const lng = request.headers
			.get('accept-language')
			?.split(',')[0]
			.split(';')[0];

		if (lng) {
			await i18next.changeLanguage(lng);
		}

		return {
			t: i18next.t,
		};
	},
);
