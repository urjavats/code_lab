import React, { useState,useEffect,useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

function CodeEditor() {
  const [code, setCode] = useState('// Write your code here\n');
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Set the container's height explicitly */}
      <div style={{ flexGrow: 1 }}>
        <MonacoEditor
          height="100%"  // Ensuring Monaco Editor has full height inside its container
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
