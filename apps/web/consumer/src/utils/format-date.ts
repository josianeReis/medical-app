export const formatDate = (dateString: string | Date) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('pt-BR', {
		month: 'short',
		day: 'numeric',
	});
};
