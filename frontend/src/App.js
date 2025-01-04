import Login from './components/Login';
import CodeEditor from './components/CodeEditor';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import Register from './components/Register';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/editor" element={<CodeEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
