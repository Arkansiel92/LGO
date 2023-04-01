import { useRef, useEffect, useContext, useState } from 'react';
import { ExtendedSocket, socketContext } from '../../context/socket';
import "./Map.css";
import { room } from '../../screen/Game/Game';

interface inputs {
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean
}

interface props {
  room: room | null
}

function Map({room}: props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useContext<ExtendedSocket>(socketContext);
  const [loadMap, setLoadMap] = useState<boolean>(false);

  const inputs: inputs = {
    up: false,
    down: false,
    left: false,
    right: false
  }

  const spritePlayer = new Image();
  spritePlayer.src = "assets/img/sprites/player.png"

  const map = new Image();
  map.src = "assets/maps/map1.png";
 
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (loadMap) {
          ctx.drawImage(map, 0, 0, window.innerWidth, window.innerHeight);
        }

        if (room && loadMap) {
          for (const player of room.players) {
            ctx.drawImage(
              spritePlayer,
              32 * player.frameX,
              32 * player.frameY,
              32,
              32,
              player.x,
              player.y,
              64,
              64
            );
          }
        }

        requestAnimationFrame(draw);
      };

      draw();

      const handleKeyDown = (e: any) => {
        if (e.key === "z") {
          inputs["up"] = true;
        } else if (e.key === "q") {
          inputs["left"] = true;
        } else if (e.key === "d") {
          inputs["right"] = true;
        } else if (e.key === "s") {
          inputs["down"] = true;
        }

        if (!room?.night) {
          socket.emit("inputs", inputs);
        }

      };

      const handleKeyUp = (e: any) => {
        if (e.key === "z") {
          inputs["up"] = false;
        } else if (e.key === "q") {
          inputs["left"] = false;
        } else if (e.key === "d") {
          inputs["right"] = false;
        } else if (e.key === "s") {
          inputs["down"] = false;
        }
        
        if (!room?.night) {
          socket.emit("inputs", inputs);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        socket.off("inputs");
      };
    }
  }, [socket, room, loadMap]);

  useEffect(() => {
    map.onload = () => {
      setLoadMap(true);
    };
  }, []);

  return (
      <canvas id="map" ref={canvasRef}></canvas>
  )
}

export default Map;