"use client";
import {
  Card,
  CardContent,
  ScrollArea,
} from "@packages/ui-components";
import Editor from "../../../components/editor";

const CreateReport = () => {

  return (
    <div className="w-full ">
      <Card>
        <div className="flex flex-col md:flex-row gap-4 px-4 pb-4">
          <ScrollArea
            className="whitespace-nowrap flex-[2] border rounded-md p-2 bg-white shadow overflow-y-auto"
            style={{ height: "calc(100vh - 100px)" }} 
          >
            <CardContent className="w-full max-w-full">
              <Editor />
            </CardContent>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default CreateReport;




// 'use client';

// import { useEffect, useState } from "react";
// import { PlateEditor } from "@/components/editor/plate-editor";

// export default function CreateReportPage() {
//   const [initialValue, setInitialValue] = useState("");

//   useEffect(() => {
//     const stored = localStorage.getItem("selectedTemplate");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setInitialValue(parsed.content);
//       localStorage.removeItem("selectedTemplate"); // Limpa para não carregar sempre
//     }
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Gerar novo laudo</h1>
//       <PlateEditor initialValue={initialValue} />
//     </div>
//   );
// }
