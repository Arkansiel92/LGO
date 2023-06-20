import { useRef, useEffect, useContext, useState, useMemo } from 'react';
import { socketContext } from '../../context/socket';
import s from "./Map.module.css";
import { Room } from "../../screen/Game/interface";
import player_sprite from "../../assets/img/sprites/player/player.png";
import map_sprite from "../../assets/maps/map1.png";

interface inputs {
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean
}

interface props {
  room?: Room
}

function Map({ room }: props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useContext(socketContext);
  const [loadMap, setLoadMap] = useState<boolean>(false);

  const inputs: inputs = useMemo(() => ({
    up: false,
    down: false,
    left: false,
    right: false
  }), []);

  const spritePlayer = useMemo(() => {
    const sprite = new Image();
    sprite.src = player_sprite;
    return sprite;
  }, []);

  const map = useMemo(() => {
    const mapImage = new Image();
    mapImage.src = map_sprite;
    return mapImage;
  }, []);

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
            if (!player.isDead) {
              ctx.drawImage(
                spritePlayer,
                64 * player.frames.x,
                64 * player.frames.y,
                64,
                64,
                player.x,
                player.y,
                64,
                64
              );
            }
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
          console.log("coucou");
          
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
      };
    }
  }, [socket, room, loadMap, inputs, map, spritePlayer]);

  useEffect(() => {
    map.onload = () => {
      setLoadMap(true);
    };
  }, [map]);

  return (
    <canvas id="map" className={s.map} ref={canvasRef}></canvas>
  )
}

export default Map;