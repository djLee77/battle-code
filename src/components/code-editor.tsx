import React, { useEffect, useState } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import styles from 'styles/code-editor.module.css';

const CodeEditor = (props: { language: string }): JSX.Element => {
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  );
  useEffect(() => {
    console.log(props.language);
  });

  const editorOptions: EditorProps['options'] = {
    inlineSuggest: { enabled: true },
    fontSize: 16,
    formatOnType: true,
    autoClosingBrackets: 'always',
    minimap: { enabled: false },
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
    <div className={styles.container}>
      <div className={styles.header}></div>
      <div className={styles.body}>
        <Editor
          height="300px"
          language={props.language}
          theme="vs-dark"
          value={code}
          options={editorOptions}
          onChange={handleEditorChange}
        />
      </div>
      <div className={styles.footer}>
        <button onClick={handleSubmit}>submit</button>
      </div>
    </div>
  );
};

export default CodeEditor;
