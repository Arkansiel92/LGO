import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext } from "react";
import Loader from "../../component/Loader/Loader";
import { AuthContext } from "../../context/auth";
import { socketContext } from "../../context/socket";

function Join() {

    const { id } = useParams();
    const auth = useContext(AuthContext);
    const socket = useContext(socketContext);
    const navigate = useNavigate();

    socket.on('join-room', (path: string) => {
        navigate(path);
    })

    useEffect(() => {
        if (auth.authState.isAuthenticated) {
            socket.emit('join-room', id, {
                id: auth.authState.user?.id,
                username: auth.authState.user?.username,
                clan: auth.authState.user?.membersClan.clan,
                title: auth.authState.user?.title
            });
        }

    }, [id, auth, socket])

    return (
        <div className="m-5">
            <Loader />
        </div>
    )
}

export default Join;