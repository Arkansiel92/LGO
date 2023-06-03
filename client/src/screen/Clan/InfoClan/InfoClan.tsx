import { useEffect, useState } from "react";
import Navbar from "../../../component/Navbar/Navbar";
import { useParams } from "react-router-dom";

interface rank {
    name: string,
    level: number
}

interface user {
    username: string,
    points: number
}

interface member {
    id: number,
    rank_clan: rank,
    user: user
}

interface clan {
    name: string,
    description: string,
    points: number,
    banner: string,
    emblem: string,
    membersClans: member[]
}

function InfoClan() {

    const { id } = useParams();

    const [clan, setClan] = useState<clan | null>(null);

    useEffect(() => {
        if (!clan) {
            fetch('https://localhost:8000/api/clans/' + id, {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => setClan(data))
        }
    }, [clan, id])

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>{clan?.name}</h1>
                <p className="lead">{clan?.description}</p>
                <div className="row">
                    <div className="col-4">
                        <div className="card bg-dark box-shadow">
                            <div className="position-relative">
                                <img className="banner-village" src={clan?.banner} alt="" />
                                <img className="emblem-village" src={clan?.emblem} alt="" />
                            </div>
                            <p className="lead text-center">Points : {clan?.points}</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card bg-dark box-shadow">
                            <div className="card-header">
                                <h3>Membres</h3>
                            </div>
                            <div className="card-body">
                                {clan?.membersClans.map((member: member, index: number) => (
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p>{member.rank_clan.name}</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted">{member.user.username} ({member.user.points}pts)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoClan;