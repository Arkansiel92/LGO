import { useEffect, useState } from "react";
import Navbar from "../../../component/Navbar/Navbar";


interface clan {
    name: string,
    points: number
}

function LeaderboardClan() {

    const [clans, setClans] = useState<clan[] | null>(null);

    useEffect(() => {
        fetch('https://localhost:8000/api/clans', {
            method: 'GET',
            headers: {
                'accept': 'application/json'
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
                <table className="table text-white">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Village</th>
                            <th scope="col">Chef</th>
                            <th scope="col">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clans?.map((clan: clan, index: number) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{clan.name}</td>
                                <td>X</td>
                                <td>{clan.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LeaderboardClan;