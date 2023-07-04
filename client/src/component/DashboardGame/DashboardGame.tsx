import { useContext, useEffect, useState } from 'react';
import { socketContext,  } from '../../context/socket';
import { Room } from '../../screen/Game/interface';
import Chat from '../Chat/Chat';

interface props {
    room: Room | undefined
}

function DashboardGame({ room }: props) {

    const [roleScreen, setRoleScreen] = useState(false);
    const [roles, setRoles] = useState(null);
    const socket = useContext(socketContext);

    useEffect(() => {

    }, [])

    return (
        <div className={`col-md-3 sidebar-${false} px-2`}>
            
        </div>
    )
}

export default DashboardGame;