import { useContext, useEffect, useState } from "react";
import Navbar from "../../../component/Navbar/Navbar";
import { useParams } from "react-router-dom";
import s from "./InfoClan.module.css";
import { AuthContext } from "../../../context/auth";
import RankClan from "../../../component/RankClan/RankClan";
import Loader from "../../../component/Loader/Loader";

export interface rank {
    name: string,
    level: number
}

export interface user {
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
    const auth = useContext(AuthContext);

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
    }, [clan, id, auth])

    return (
        <div>
            <Navbar />
            {
                clan
                    ? <div className="container">
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
                                            <RankClan key={index} user={member.user} rank={member.rank_clan} />
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
                    : <Loader />
            }
        </div>
    )
}

export default InfoClan;