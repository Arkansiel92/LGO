import { useEffect, useState } from "react";
import Navbar from "../../../component/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import s from "./InfoClan.module.css";

interface rank {
    name: string,
    level: number
}

interface user {
    id: number,
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
    const navigate = useNavigate();

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
                <div className="row my-3">
                    <div className="col-4">
                        <div className="card bg-dark box-shadow">
                            <div className={s.container_clan}>
                                <img className={s.banner} src={clan?.banner} alt="" />
                                <img className={s.emblem} src={clan?.emblem} alt="" />
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
                                    <div key={index} className="row">
                                        <div className="col-sm-9">
                                            <p className="left-click" onClick={() => {navigate('/profil/' + member.user.id)}}>{member.user.username} ({member.user.points}pts)</p>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="text-muted">{member.rank_clan.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1>Défis de clan</h1>
                    <p className="text-muted">Arrive bientôt...</p>
                </div>
            </div>
        </div>
    )
}

export default InfoClan;