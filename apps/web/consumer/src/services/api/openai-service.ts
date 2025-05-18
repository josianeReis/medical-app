export async function generateText(
  actionType: "expand" | "refine" | "summarize",
  selectedText: string,
  apiKey?: string,
  model?: string
): Promise<string | null> {

  try {
    const response = await fetch('https://api.openai.com/v1/engines/' + model + '/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `${actionType.toUpperCase()}:\n\n${selectedText}`,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].text;
    }
    return null;
  } catch (error) {
    console.error("❌ Erro ao gerar texto:", error);
    return null;
  }
}
