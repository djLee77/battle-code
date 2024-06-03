import React, { useEffect, useState } from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import styles from 'styles/code-editor.module.css';

interface IProps {
  className?: string;
  language: string;
  code: string;
  setCode: (str: string) => void;
}

const CodeEditor = React.memo(
  ({ language, code, setCode }: IProps): JSX.Element => {
    useEffect(() => {
      console.log(language);
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

    return (
      <div className={styles.container}>
        <div className={styles.header}></div>
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
      </div>
    );
  }
);

export default CodeEditor;
