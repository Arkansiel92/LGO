import { CSSProperties } from 'react';
import "./Cloud.css";
import cloud from "../../assets/img/sprites/cloud.png";

interface props {
    animationDelay: number
    left: number
    top: number
}

function Cloud({animationDelay, left, top}: props) {

    const style: CSSProperties = {
        position: 'absolute',
        left: left + "vh",
        top: top + "vh",
        animation: "clouds " + animationDelay + "s linear infinite"
    }

    return (
        <img style={style} className="cloud" src={`${cloud}`} alt="cloud" />
    )
};

export default Cloud;