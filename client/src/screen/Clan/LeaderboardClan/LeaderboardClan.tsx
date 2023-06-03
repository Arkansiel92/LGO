import {useEffect, useState} from "react";
import Navbar from "../../../component/Navbar/Navbar";


function LeaderboardClan() {

    const [clans, setClans] = useState(null);

    useEffect(() => {
        fetch('https://localhost:8000/api/clans', {
            method: 'GET',
            headers: {
                'accept':'application/json'
            }
        })
        .then(res => res.json())
        .then(data => setClans(data));
    }, [clans])

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Classement des villages</h1>
            </div>
        </div>
    )
}

export default LeaderboardClan;