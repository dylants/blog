import React from 'react';
import { Link } from 'react-router';

export default function Header() {
  return (
    <header>
      <div className="title">
        <Link to="/">Randomness in Code</Link>
      </div>
      <div className="links">
        <Link to="/" className="link">Home</Link>
        <a href="https://resume.dylants.com" className="link">Resume</a>
        <a href="https://github.com/dylants" className="link">GitHub</a>
        <a href="http://www.linkedin.com/in/dylants" className="link">LinkedIn</a>
      </div>
    </header>
  );
}
