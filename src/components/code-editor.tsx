import React from "react";
import Editor, { EditorProps } from "@monaco-editor/react";
import { useState } from "react";

const CodeEditor: React.FC = (): JSX.Element => {
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  );

  const editorOptions: EditorProps["options"] = {
    inlineSuggest: { enabled: true },
    fontSize: 16,
    formatOnType: true,
    autoClosingBrackets: "always",
    minimap: { scale: 10 },
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value); // 코드 상태 업데이트
    }
  };

  const handleSubmit = () => {
    console.log(code);
  };

  return (
    <div>
      <Editor
        height="100px"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={editorOptions}
        onChange={handleEditorChange}
      />
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
};

export default CodeEditor;
