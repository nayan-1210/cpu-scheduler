
import './App.css';
import Navbar from './Components/Navbar.js';
import Home from './Components/Home.js';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Results from './Components/Result.js';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/result" element={<Results/>}/>
      </Routes>
    </Router>
  );
}

export default App;
