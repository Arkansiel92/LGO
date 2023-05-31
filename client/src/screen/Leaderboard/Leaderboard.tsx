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
                                <div className="row my-3 fw-bold">
                                    <div className="col">
                                        #
                                    </div>
                                    <div className="col">
                                        Nom
                                    </div>
                                    <div className="col">
                                        Points
                                    </div>
                                    <div className="col">
                                        Victoires
                                    </div>
                                    <div className="col">
                                        Défaites
                                    </div>
                                </div>
                                {users?.map((user: user, index: number) => (
                                    <RankPlayer key={index} username={user.username} points={user.points} win={user.win} loose={user.loose} index={index + 1} />
                                ))}
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