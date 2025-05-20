"use client";

import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { useSettings } from "@/components/editor/settings";
import { generateText } from "@/services/api/openai-service";

export function PlateEditor() {
  const editor = useCreateEditor();
  const [loading, setLoading] = React.useState(false);
  const [generatedText, setGeneratedText] = React.useState<string>("");
  const { keys, model } = useSettings();

  const handleCommand = async (
    actionType: "expand" | "refine" | "summarize"
  ) => {
    const selectedText = window.getSelection()?.toString();
    if (!selectedText) {
      alert("Selecione um texto para gerar conteúdo.");
      return;
    }

    setLoading(true);

    try {
      const result = await generateText(
        actionType,
        selectedText,
        keys.openai,
        model.value
      );
      if (result) {
        console.log("📝 Texto Gerado:", result);
        setGeneratedText(result);
      }
    } catch (error) {
      console.error("❌ Erro ao gerar texto:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <EditorContainer>
          <Editor variant="demo" />
        </EditorContainer>

        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={() => handleCommand("expand")}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Processando..." : "Expandir"}
          </button>
          <button
            onClick={() => handleCommand("refine")}
            className="bg-green-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Processando..." : "Refinar"}
          </button>
          <button
            onClick={() => handleCommand("summarize")}
            className="bg-orange-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Processando..." : "Resumir"}
          </button>
        </div>

        {loading && (
          <div className="absolute right-4 bottom-4 p-2 bg-gray-800 text-white rounded">
            Processando...
          </div>
        )}

        {generatedText && (
          <div className="mt-4 p-2 border border-gray-300 rounded">
            <h3 className="font-bold text-lg">Texto Gerado:</h3>
            <p>{generatedText}</p>
          </div>
        )}
      </Plate>
    </DndProvider>
  );
}
