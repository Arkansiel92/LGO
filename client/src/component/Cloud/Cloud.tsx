import { CSSProperties } from 'react';
import "./Cloud.css";

interface props {
    nb: number
    animationDelay: number
    left: number
    top: number
}

function Cloud({nb, animationDelay, left, top}: props) {

    const style: CSSProperties = {
        display: 'inline-block',
        position: 'absolute',
        left: left + "px",
        top: top + "px",
        animation: "clouds " + animationDelay + "s linear infinite"
    }

    return (
        <div>
            <img style={style} className="cloud" src={`assets/img/sprites/cloud${nb}.png`} alt="cloud" />
        </div>
    )
};

export default Cloud;