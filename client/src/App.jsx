import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Feed from './Feed';
import Saved from './Saved';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Link to="/home">
          <button>Home</button>
        </Link>
        <Link to="/feed">
          <button>Feed</button>
        </Link>
        <Link to="/saved">
          <button>Saved</button>
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
