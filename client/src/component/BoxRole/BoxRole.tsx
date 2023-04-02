import { boxRole } from "../../screen/Game/Game";
import Counter from "../Counter/Counter";
import "./BoxRole.css";

function BoxRole({description}: boxRole) {
    return (
        <div id="boxDialog" className="bg-dark card text-center lead p-3 m-auto">
            <div className="card-header">
                <Counter />
            </div>
            <div className="card-body">
                {description}
            </div>
        </div>
    )
}

export default BoxRole;