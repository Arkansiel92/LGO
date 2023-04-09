import { CSSProperties } from 'react';
import "./Cloud.css";

function Cloud() {

    const style: CSSProperties = {
        display: 'inline-block',
        position: 'absolute',
        left: getRandomNumber(200, 1000) + "px",
        top: getRandomNumber(0, 100) + "px",
        animation: "clouds " + getRandomNumber(4, 8) + "s linear infinite"
    }

    function getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
        <div>
            <img style={style} className="cloud" src={`assets/img/sprites/cloud${getRandomNumber(1, 9)}.png`} alt="cloud" />
        </div>
    )
};

export default Cloud;