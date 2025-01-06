import Login from './components/Login';
import CodeEditor from './components/CodeEditor';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import Register from './components/Register';
import Home from './components/Home';




function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/editor/:roomId/:problemId" element={<CodeEditor />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
