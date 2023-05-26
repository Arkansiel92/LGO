import "./Join.css";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../context/auth";
import { socketContext } from "../../context/socket";

type params = {
    id: string
}

function Join() {

    const { id } = useParams<params>();
    const auth = useContext(AuthContext);
    const socket = useContext(socketContext);
    const navigate = useNavigate();

    socket.on('navigate', (path: string) => {
        return navigate(path);
    })


    
    useEffect(() => {
        if (!localStorage.getItem('token')) return navigate('/');
        
        if (id) socket.emit('join', {
            id: id, 
            pseudo: auth.authState.user?.username
        });
    }, [id, auth, navigate, socket])

    return (
        <div id="loader-join"></div>
    )
}

export default Join;