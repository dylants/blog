import React, { PropTypes } from 'react';

export default function PostTitle({ title, timestamp }) {
  return (
    <div className="postTitle">
      <h1>{title}</h1>
      <div className="timestamp">{timestamp}</div>
    </div>
  );
}

PostTitle.propTypes = {
  title: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
};
