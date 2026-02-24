// Application output port for large-language-model providers
export type LlmProvider = {
	/**
	 * Sends a user prompt and returns the model response as plain text.
	 * @param prompt Free-form prompt or chat history.
	 * @param options Model-specific options (temperature, model name…).
	 */
	chat(prompt: string, options?: Record<string, unknown>): Promise<string>;
};
