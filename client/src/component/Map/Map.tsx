import { useRef, useEffect } from 'react';
import "./Map.css";

function Map() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    const image = new Image();
    image.src = "assets/img/forest.svg";
    image.onload = () => {
      ctx?.drawImage(image, 0, 0);
    };
  }, []);

    return (
        <canvas id="map" ref={canvasRef}></canvas>
    )
}

export default Map;