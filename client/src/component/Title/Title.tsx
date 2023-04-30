import { CSSProperties } from 'react';
import "./Title.css";

interface props {
    title: string,
    color: string
}

function Title({title, color}: props) {

    const style: CSSProperties = {
        fontSize: "14px",
        fontStyle: "italic",
        color: color
    }

    return (
        <span style={style}>« {title} »</span>
    )
};

export default Title;