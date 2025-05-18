/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt, action } = await request.json();

  // Definindo o tipo de ação no prompt
  const endpoint: any = {
    expand: "Expanda o seguinte conteúdo:",
    refine: "Melhore a gramática e a clareza do seguinte conteúdo:",
    summarize: "Resuma o seguinte conteúdo:"
  };

  try {
    // ✅ Fazendo a requisição para OpenAI usando o fetch nativo
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer SEU_TOKEN_AQUI`, // 🔴 Insira seu token diretamente aqui
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `${endpoint[action]} ${prompt}`,
        max_tokens: 150,
        temperature: 0.7,
      })
    });

    // ✅ Processando a resposta
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ text: data.choices[0].text });
    } else {
      console.error("Erro na resposta da OpenAI");
      return NextResponse.error();
    }
  } catch (error) {
    console.error("Erro ao processar OpenAI:", error);
    return NextResponse.error();
  }
}
