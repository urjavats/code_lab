import Login from './components/Login';
import CodeEditor from './components/CodeEditor';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/editor" element={<CodeEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
