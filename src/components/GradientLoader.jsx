import React from 'react';

const GradientLoader = () => {
  const loaderStyle = {
    width: '1.5em',
    height: '1.5em',
    background: 'linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)',
    animation: 'spin 3s infinite',
    position: 'relative',
    marginRight: 5,
  };

  const loaderBeforeStyle = {
    content: '""',
    zIndex: '-1',
    position: 'absolute',
    inset: '0',
    background: 'linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)',
    transform: 'translate3d(0, 0, 0) scale(0.95)',
    filter: 'blur(20px)'
  };

  const spinKeyframes = `
    @keyframes spin {
      0% {
        transform: rotate(-45deg);
      }
      50% {
        transform: rotate(-360deg);
        border-radius: 50%;
      }
      100% {
        transform: rotate(-45deg);
      }
    }
  `;

  return (
    <>
      <style>{spinKeyframes}</style>
      <div style={loaderStyle}>
        <div style={loaderBeforeStyle}></div>
      </div>
    </>
  );
};

export default GradientLoader;
