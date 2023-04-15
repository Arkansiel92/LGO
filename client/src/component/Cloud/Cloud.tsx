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
        position: 'absolute',
        left: left + "vh",
        top: top + "vh",
        animation: "clouds " + animationDelay + "s linear infinite"
    }

    return (
        <img style={style} className="cloud" src={`assets/img/sprites/cloud${nb}.png`} alt="cloud" />
    )
};

export default Cloud;