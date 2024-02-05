import React, { PropTypes } from "react";

export default function PostTitle({ config }) {
  return (
    <div className="postTitle">
      <div className="imageWrap">
        <img className="image" src={config.image} alt="" />
      </div>
      <h1>{config.title}</h1>
      <div className="timestamp">{config.displayTimestamp}</div>
    </div>
  );
}

PostTitle.propTypes = {
  config: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    displayTimestamp: PropTypes.string.isRequired,
  }).isRequired,
};
