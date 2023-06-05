import { useEffect, useState } from "react";
import Navbar from "../../component/Navbar/Navbar";
import Rank from "../../component/Rank/Rank";

interface user {
    username: string,
    points: string,
    win: number,
    loose: number,
    index?: number
}

interface member {

}

interface clan {
    name: string,
    points: number,
    membersClans: member[]
}

function Leaderboard() {

    const [users, setUsers] = useState<user[] | null>(null);
    const [clans, setClans] = useState<clan[] | null>(null);
    const [leaderboard, setLeaderboard] = useState<string>('players');

    useEffect(() => {
        if (!users && leaderboard === 'players') {
            setClans(null)
            fetch('https://localhost:8000/api/users?itemsPerPage=30', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => setUsers(data))
        }

        if (!clans && leaderboard === 'clans') {
            setUsers(null);
            fetch('https://localhost:8000/api/clans?itemsPerPage=30', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => setClans(data))
        }
    }, [users, clans, leaderboard])

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Classement</h1>
                <button onClick={() => { setLeaderboard('players') }} className={`btn ${leaderboard !== "players" ? "btn-outline-warning" : "btn-warning"}  rounded-pill`}>Joueurs</button>
                <button onClick={() => { setLeaderboard('clans') }} className={`btn ${leaderboard !== "clans" ? "btn-outline-warning" : "btn-warning"} rounded-pill m-1`}>Villages</button>
                {
                    users &&
                    <table className="table text-white">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nom</th>
                                <th scope="col">Points</th>
                                <th scope="col">Victoires</th>
                                <th scope="col">Défaites</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user: user, index: number) => (
                                <Rank key={index} index={index + 1} col1={user.username} col2={user.points} col3={user.win} col4={user.loose} />
                            ))}
                        </tbody>
                    </table>
                }
                {
                    clans &&
                    <table className="table text-white">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nom</th>
                                <th scope="col">Membres</th>
                                <th scope="col">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clans?.map((clan, index: number) => (
                                <Rank key={index} index={index + 1} col1={clan.name} col2={clan.membersClans.length} col3={clan.points} />
                            ))}
                        </tbody>
                    </table>

                }
            </div>
        </div>
    )
}

export default Leaderboard;