import {useEffect, useContext, useState} from "react";
import { socketContext } from "../../context/socket";
import Map from "../../component/Map/Map";
import { Room } from "./interface";
import Player from "../../component/Player/Player";

function Game() {
    const socket = useContext(socketContext);
    const [currentRoom, setRoom] = useState<Room>();

    useEffect(()=> {
        function onRoom(room: Room) {
            console.log(room);
            
            setRoom(room);
        }

        socket.on('get-room' , onRoom)
        socket.emit('get-room');

        return () => {
            socket.off('get-room', onRoom);
        }
    }, [socket]);

    return (
        <div>
            <Map room={currentRoom} />
            {currentRoom?.players.map((player, index) => (
                <Player key={index} player={player} />
            ))}
        </div>
    )
}

export default Game;