import { useTranslations } from 'next-intl';

const ColumnTranslation = ({ name }: { name: string }) => {
	const t = useTranslations('fields');
	return t(`${name}.label`);
};

export default ColumnTranslation;
