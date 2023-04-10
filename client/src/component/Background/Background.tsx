import "./Background.css";
import Cloud from "../Cloud/Cloud";



function Background() {
    return (
        <div>
            <Cloud nb={1} animationDelay={15} left={1200} top={20} />
            <Cloud nb={2} animationDelay={25} left={600} top={80} />
            <Cloud nb={3} animationDelay={20} left={400} top={40} />
        </div>
    )
};

export default Background;