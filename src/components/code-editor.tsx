import React from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import { useState } from 'react';
import styles from 'styles/code-editor.module.css';

const CodeEditor: React.FC = (): JSX.Element => {
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  );
  const [language, setLanguage] = useState<string>('javascript');

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

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = () => {
    console.log(code);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <select
          onChange={handleLanguageChange}
          value={language}
          className={styles.languageMenu}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
        </select>
      </div>
      <div className={styles.body}>
        <Editor
          height="300px"
          language={language}
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
