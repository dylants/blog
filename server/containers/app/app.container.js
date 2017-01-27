import React, { PropTypes } from 'react';

export default function App({ children }) {
  return (
    <div>
      Hi
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};
