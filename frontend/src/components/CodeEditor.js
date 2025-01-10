import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './CodeEditor.css';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark} from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript'
import { jumpGame } from "../utils/problems/jump-game.ts";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiBot } from 'react-icons/bi';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from './Chat';
import { BsChat } from 'react-icons/bs';
import { Problem } from '../utils/type/problem';
import {problems} from '../utils/problems/index';
import Pusher from 'pusher-js';




function CodeEditor(CodeEditorProps) {
  const { roomId, problemId } = useParams();
  const [code, setCode] = useState('');
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [problem, setProblem] = useState(jumpGame);
  const editorRef = useRef();
  const [isChatLoading, setIsChatLoading] = useState(false);
const [chatResponse, setChatResponse] = useState('');
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const [pusherChannel, setPusherChannel] = useState(null);
const [isChatOpen, setIsChatOpen] = useState(false);
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

useEffect(() => {
  if (problemId && problems[problemId]) {
    setProblem(problems[problemId]);
    setCode(problems[problemId].starterCode);
  } else {
    // Fallback to jumpGame if no problemId is provided
    setProblem(jumpGame);
    setCode(jumpGame.starterCode);
  }
}, [problemId]);


useEffect(() => {
  const pusher = new Pusher('5d9419420d30ef661f76', {
    cluster: 'us3',
    encrypted: true,
    authEndpoint: 'https://code-lab-five.vercel.app/pusher/auth',
  });

  const channel = pusher.subscribe(`private-${roomId}`);
  setPusherChannel(channel);
  // Handle incoming code changes from other users
  channel.bind('code_change', function (data) {
    console.log('Received code update:', data);

    if (editorRef.current) {
      const editorValue = editorRef.current.view.state.doc.toString(); // Accessing editor value

      if (data.code !== editorValue) {
        editorRef.current.view.dispatch({
          changes: { from: 0, to: editorValue.length, insert: data.code },
        });
      }
    }
  });
  return () => {
    pusher.unsubscribe(`private-${roomId}`);
    pusher.disconnect();
  };
}, [roomId]);



const handleChatbot = async () => {
  setIsChatLoading(true);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`Please help me understand and improve this code: ${code}`);
    const response = await result.response;
    const text = response.text();
    setChatResponse(text);
    toast.success("Got response from Gemini AI!");
  } catch (error) {
    console.error('Gemini API Error:', error);
    toast.error("Failed to get AI response");
  } finally {
    setIsChatLoading(false);
  }
};

  // Handle code changes in the editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Send the code update to the backend to broadcast to other users
    fetch(`${API_BASE_URL}/code_change`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: newCode,
        roomId,
      }),
    });
  };
  const handleTestCaseClick = (index) => {
    setSelectedTestCase(index);
  };
  const handleChatMessage = (message) => {
    if (pusherChannel) {
      pusherChannel.trigger('client-chat_message', {
        roomId,
        message
      });
    }
  };
  const handleSubmit = async () => {
    try {
      // Get the function name and user's code
      const functionName = problem.starterFunctionName;
      const userCode = code.trim();
      
      // Create and execute the function
      const fn = new Function(`
        ${userCode}
        return canJump;
      `)();
      
      // Run all test cases using the handler
      const success = problem.handlerFunction(fn);
      
      if (success) {
        toast.success("Congratulations! All test cases passed!", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark"
        });
      }
    } catch (error) {
      if (error.message.includes("Expected values to be strictly deep-equal:")) {
        toast.error("One or more test cases failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark"
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark"
        });
      }
    }
  };
  
  const handleRun = () => {
    try {
      // Get current test case
      const testCase = problem.examples[selectedTestCase];
      
      // Extract the function name and user's code
      const userCode = code.trim();
      
      // Parse the input array from the test case
      const inputStr = testCase.inputText.split('=')[1].trim();
      const input = JSON.parse(inputStr.replace(/nums/g, ''));
      
      // Create and execute the function
      const fn = new Function(`
        ${userCode}
        return canJump;
      `)();
      
      // Run the test case
      const result = fn(input);
      const expected = testCase.outputText.trim() === 'true';
      
      if (result === expected) {
        toast.success("Test case passed!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark"
        });
      } else {
        toast.error("Test case failed!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark"
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark"
      });
    }
  };
  

  return (
    <>
    <ToastContainer
      position="top-center"
      autoClose={2000}
      theme="dark"
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <div className="code-editor-container flex h-screen">
      {/* Split container for problem statement and code editor */}
      <Split
        className="split-horizontal"
        sizes={[40, 60]} 
        minSize={200} // Minimum size of each pane
        gutterSize={2} // Size of the gutter between panes
      >
        {/* Left column: Problem statement */}
        <div className="problem-statement">
          <div className='problem-tile-container'>
            {problem.title}

          </div>
          <div className='.problem-description'>
          <div dangerouslySetInnerHTML={{ __html: problem?.problemStatement }} />
          </div>
          <div className='examples-area'>
            <div className='example-boxes'>
            {problem.examples.map((example, index) => (
            <div key={index} className="example-box">
              <p className="example-heading">Example {index + 1}:</p>
              <div className="example-content">
                <div className="example-input">
                  <strong>Input:</strong> {example.inputText}
                </div>
                <div className="example-output">
                  <strong>Output:</strong> {example.outputText}
                </div>
              </div>
              </div>
          ))}
            </div>
          </div>
          <div className="constraints-area">
        <p className="constraints-heading">Constraints:</p>
        <ul className="constraints-list">
          <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
        </ul>
      </div>
        </div>

        {/* Right column: Code editor and test cases */}
        <Split
          className="split-vertical"
          direction="vertical"
          sizes={[70, 30]} // Adjust size ratios for editor and test cases
          minSize={100}
          gutterSize={2}
        >
          {/* Code editor */}
          <div className="code-editor">
            <CodeMirror
              ref={editorRef}
              value={code}
              theme={vscodeDark}
              extensions={[javascript()]}
              onChange={handleCodeChange}
              options={{
                lineNumbers: true,
                tabSize: 2,
                indentUnit: 2,
                autoCloseBrackets: true,
              }}
              style={{
                fontSize: '16px',
                height: 'calc(100% - 50px)',
              }}
            />

          </div>
          {/* Test cases or console output */}
          <div className="test-cases">
            <h3>Test Cases</h3>
            <div className='test-case-boxes'>
            {problem.examples.map((example, index) => (
          <div 
            key={index}
            className={`test-case-box ${selectedTestCase === index ? 'selected' : ''}`}
            onClick={() => handleTestCaseClick(index)}
            style={{ cursor: 'pointer' }}
          >
            <h4>Case {index + 1}</h4>
          </div>
        ))}
            </div>
            <div className='input'>
              <div className='input-label'>
                  Input:
              </div>
              <div className='input-content'>
              {problem.examples[selectedTestCase].inputText}
              </div>
            </div>
            <div className='input'>
              <div className='input-label'>
                  Output:
              </div>
              <div className='input-content'>
              {problem.examples[selectedTestCase].outputText}
              </div>
            </div>
          </div>
          <div className='editor-footer'>
            <div className='footer-content'>
              <div className='action-buttons'>
                <button className='chat-bot' onClick={handleChatbot}
  disabled={isChatLoading}>
                 {isChatLoading ? (
    <div className="loading-spinner" />
  ) : (
    <BiBot size={20} />
  )}
                </button>
                {chatResponse && (
  <div className="chat-response">
    <div className="chat-response-header">
      <h3>AI Assistant</h3>
      <button onClick={() => setChatResponse('')}>×</button>
    </div>
    <div className="chat-response-content">
      {chatResponse}
    </div>
  </div>
)}
 <button className='chat-button' onClick={() => setIsChatOpen(!isChatOpen)}>
    <BsChat size={20} />
  </button>
  {isChatOpen && <Chat roomId={roomId} />}
                <button className='run-button' onClick={handleRun}>
                  Run
                </button>
                <div className='submit-button' onClick={handleSubmit}>
                    Submit
                </div>

              </div>
            </div>

          </div>
        </Split>
   
      </Split>
     
    </div>
    </>
  );
}

export default CodeEditor;
