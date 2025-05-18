import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt, apiKey, model } = await request.json();

  console.log("🔎 Recebido no /copilot:");
  console.log("Prompt:", prompt);
  console.log("API Key:", apiKey);
  console.log("Model:", model);

  if (!prompt || !apiKey) {
    console.error("❌ Prompt ou API Key não fornecidos.");
    return NextResponse.json({ error: "Prompt ou API Key não fornecidos" }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4',
        messages: [{ role: "user", content: prompt }],
        stream: false,
      }),
    });

    console.log("🔎 Resposta do OpenAI:", response.status);

    if (!response.ok) {
      console.error("❌ Erro ao chamar OpenAI (copilot):", response.statusText);
      const errorText = await response.text();
      console.error("❌ Detalhes do erro:", errorText);
      return NextResponse.json({ error: `Erro ao chamar OpenAI: ${errorText}` }, { status: 500 });
    }

    const data = await response.json();
    const completion = data.choices[0].message.content;

    console.log("📝 Resposta da OpenAI (copilot):", completion);

    return NextResponse.json({ text: completion });
  } catch (error) {
    console.error("❌ Erro ao processar requisição Copilot:", error);
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 });
  }
}
