import React from 'react';

const Avatar = ({ url }) => (
  <div className="lazyload avatar">
    <img data-src={url} alt="user avatar" />
  </div>
);

export default Avatar;
