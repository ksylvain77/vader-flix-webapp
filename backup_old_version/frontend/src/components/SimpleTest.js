import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const Home = () => <div>Home Page</div>;
const About = () => <div>About Page</div>;

const SimpleTest = () => {
  return (
    <div>
      <nav>
        <Link to="/simple">Home</Link> | <Link to="/simple/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

export default SimpleTest; 