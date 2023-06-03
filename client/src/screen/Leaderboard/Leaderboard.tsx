import { useEffect, useState } from "react";
import Navbar from "../../component/Navbar/Navbar";
import RankPlayer from "../../component/RankPlayer/RankPlayer";
import Spinner from "../../component/Spinner/Spinner";

export interface user {
    username: string,
    points: string,
    win: number,
    loose: number,
    index?: number
}

function Leaderboard() {

    const [users, setUsers] = useState<user[] | null>(null);

    useEffect(() => {
        if (!users) {
            fetch('https://localhost:8000/api/users?itemsPerPage=30', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => setUsers(data))
        }
    }, [users])

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Classement</h1>
                <p>Les meilleurs joueurs de Moonrise !</p>
                {
                    users
                        ? <div className="card bg-dark box-shadow">
                            <div className="card-body">
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
                                            <RankPlayer key={index} username={user.username} points={user.points} win={user.win} loose={user.loose} index={index + 1} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        : <div className="text-center">
                            <Spinner />
                        </div>
                }
            </div>
        </div>
    )
}

export default Leaderboard;