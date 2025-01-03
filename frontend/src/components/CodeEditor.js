import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import './CodeEditor.css';
import { jumpGame } from "../utils/problems/jump-game.ts";

function CodeEditor() {
  const [code, setCode] = useState(jumpGame.starterCode);
  const [problem, setProblem] = useState(null);
  const editorRef = useRef(null);

  // Handle code changes in the editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.editor.layout();  // Trigger Monaco layout update manually
      }
    };

    // Attach resize event listener to the window
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="code-editor-container">
      {/* Left column: Problem statement */}
      <div className="problem-statement">
      <div dangerouslySetInnerHTML={{ __html: jumpGame.problemStatement }} />
      </div>

      {/* Right column: Code editor */}
      <div className="code-editor">
        <MonacoEditor
          height="100%" // Ensuring Monaco Editor has full height inside its container
          language="javascript"
          value={code}
          theme="vs-dark"
          onChange={handleCodeChange}
          options={{
            selectOnLineNumbers: true,
            minimap: { enabled: false },
            fontSize: 14,
          }}
          editorDidMount={(editor, monaco) => {
            editorRef.current = { editor, monaco };
            // Manually trigger layout update when the editor is mounted
            editor.layout();
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
