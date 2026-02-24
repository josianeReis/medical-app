import i18next from 'i18next';
import en from '../../locales/en/translation.json';
import pt from '../../locales/pt/translation.json';

export const createI18n = () => {
	i18next.init({
		fallbackLng: 'en',
		resources: {
			en: {
				translation: en,
			},
			pt: {
				translation: pt,
			},
		},
	});
};
