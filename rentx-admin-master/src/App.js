import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={ <Home />} />
      </Routes>
    </Router>
  );
};

export default App;
