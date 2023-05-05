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
        textAlign: "center",
        color: color
    }

    return (
        <h6 className='' style={style}>« {title} »</h6>
    )
};

export default Title;