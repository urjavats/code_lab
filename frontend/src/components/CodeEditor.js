import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import './CodeEditor.css';
import axios from 'axios';

function CodeEditor() {
  const [code, setCode] = useState('// Write your code here\n');
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

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        // Fetch problem list from the proxy, which will forward the request to Codeforces API
        const response = await axios.get('/problemset/problems');

        // Example: Fetching the first problem for demo purposes
        const firstProblem = response.data.result.problems[0];
        setProblem({
          title: firstProblem.name,
          content: `
            <p>Problem ID: ${firstProblem.contestId}</p>
            <p>Index: ${firstProblem.index}</p>
            <p>Tags: ${firstProblem.tags.join(', ')}</p>
          `,
        });
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    fetchProblem();
  }, []);

  return (
    <div className="code-editor-container">
      {/* Left column: Problem statement */}
      <div className="problem-statement">
        {problem ? (
          <>
            <h3>{problem.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: problem.content }} />
          </>
        ) : (
          <p>Loading problem statement...</p>
        )}
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
