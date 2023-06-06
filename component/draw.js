import React, { useRef, useEffect } from 'react';

const DrawableCanvas = (props) => {
  const canvasRef = useRef(null);
  let ctx = null;
  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  useEffect(() => {
    ctx = canvasRef.current.getContext('2d');

  }, []);

  useEffect(() => {
    if (props.clear) {
      resetCanvas();
   
    }
  }, [props.clear]);

  const resetCanvas = () => {
    canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.getContext('2d').canvas.width, canvasRef.current.getContext('2d').canvas.height);
 
  };

  const handleOnTouchStart = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    canvasRef.current.getContext('2d').beginPath();
    
    lastX = e.targetTouches[0].pageX - rect.left;
    lastY = e.targetTouches[0].pageY - rect.top;
    drawing = true;
  };

  const handleOnMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    canvasRef.current.getContext('2d').beginPath();

    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    drawing = true;
  };

  const handleOnTouchMove = (e) => {
    if (drawing) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = e.targetTouches[0].pageX - rect.left;
      const currentY = e.targetTouches[0].pageY - rect.top;
      draw(lastX, lastY, currentX, currentY);
      lastX = currentX;
      lastY = currentY;
    }
  };

  const handleOnMouseMove = (e) => {
    if (drawing) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      draw(lastX, lastY, currentX, currentY);
      lastX = currentX;
      lastY = currentY;
    }
  };

  const handleOnMouseUp = () => {
    canvasRef.current.getContext('2d').drawImage(canvasRef.current, 0, 0, 28, 28);
  //  canvasRef.current.getContext('2d').fillRect(0, 0, canvasRef.current.getContext('2d').canvas.width, canvasRef.current.getContext('2d').canvas.height);
    drawing = false;

    if (typeof props.onGetImage === 'function') {
      props.onGetImage(canvasRef.current.getContext('2d').getImageData(0, 0, 28, 28));
    }
  };

  const draw = (lX, lY, cX, cY) => {
    canvasRef.current.getContext('2d').strokeStyle = props.brushColor;
    canvasRef.current.getContext('2d').lineWidth = props.lineWidth;

    canvasRef.current.getContext('2d').moveTo(lX, lY);
    canvasRef.current.getContext('2d').lineTo(cX, cY);
    canvasRef.current.getContext('2d').stroke();
  };



  const style = {
    cursor: 'crosshair',
    border: '1px black solid',
    backgroundColor:'black',
  };

  return (
    <canvas
      ref={canvasRef}
      width={props.width}
      style={style}
      height={props.height}
      onMouseDown={handleOnMouseDown}
      onTouchStart={handleOnTouchStart}
      onMouseMove={handleOnMouseMove}
      onTouchMove={handleOnTouchMove}
      onMouseUp={handleOnMouseUp}
      onTouchEnd={handleOnMouseUp}
    />
  );
};

export default DrawableCanvas;
