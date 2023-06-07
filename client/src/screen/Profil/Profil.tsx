import { useContext, useEffect, useState } from "react";
import Navbar from "../../component/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import TitlesModal from "../../component/TitlesModal/TitlesModal";
import { AuthContext } from "../../context/auth";
import HistoricGame from "../../component/HistoricGame/HistoricGame";
import logo from "../../assets/img/role/card-werewolf.svg";
import Challenges from "../../component/Challenges/Challenges";

interface title {
    id: number,
    title: string,
    color: string,
}

export interface game {
    role: string,
    isWon: boolean,
    createdAt: Date
}

interface role {
    name: string
}

export interface challenge {
    description: string,
    goal: number,
    role: role[]
    title: title
}

export interface challengeUsers {
    challenge: challenge,
    step: number,
    isFinished: boolean
}

interface profil {
    username: string
    first_name: string,
    last_name: string,
    gender: string,
    roles: string[],
    historicGames: game[]
    challengesUsers: challengeUsers[]
    points: number,
    win: number,
    loose: number,
    title: title
}

function Profil() {

    const [profil, setProfil] = useState<profil | null>(null);
    const auth = useContext(AuthContext);

    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        if (!localStorage.getItem('token')) return navigate('/');

        if (!profil) {
            fetch('https://localhost:8000/api/users/' + id, {
                method: "GET",
                headers: {
                    'accept':'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                setProfil(data);
            });
        }
    }, [navigate, profil, auth, id]);

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Mon profil</h1>
                <div className="row">
                    <div className="col-4">
                        <div className="card bg-dark box-shadow">
                            <div className="card-body text-center">
                                <img src={logo} alt="avatar" className="rounded-circle img-fluid" width={250} />
                                <h5 className="mb-1">{profil?.username}</h5>
                                {
                                    profil?.title
                                    ? <p className="mb-4"style={{color: profil?.title.color}}>{profil?.title.title}</p>
                                    : <p className="text-muted fst-italic mb-4">Aucun titre</p>
                                }
                                {
                                    auth.authState.user?.username === profil?.username &&
                                    <div className="d-flex justify-content-center mb-2">
                                        <button type="button" disabled className="btn btn-warning">Modifier profil</button>
                                        <button type="button" className="btn btn-outline-warning ms-1" data-bs-toggle="modal" data-bs-target="#title">Changer de titre</button>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="card bg-dark box-shadow my-3">
                            <div className="card-body text-center">
                                <h5 className="text-muted mb-1">Taux de victoire (W: {profil?.win} / L: {profil?.loose})</h5>
                                {
                                    profil && (profil?.win > 0 || profil?.loose > 0)
                                    ? <h1>{Math.floor((profil.win / (profil.win + profil.loose)) * 100)}%</h1>
                                    : <h1>0%</h1>
                                }
                            </div>
                        </div>

                        {
                            auth.authState.user?.username === profil?.username &&
                            <div className="card bg-dark box-shadow my-3">
                                <div className="card-header">
                                    <h3>Mes défis</h3>
                                </div>
                                <div className="card-body">
                                    {profil?.challengesUsers.map((challenge: challengeUsers, index) => (
                                        <Challenges key={index} challenge={challenge.challenge} step={challenge.step} isFinished={challenge.isFinished} />
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                    <div className="col">
                        <div className="card bg-dark box-shadow">
                            <div className="card-header">
                                <h3>Mes informations</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Prénom nom</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{profil?.first_name} {profil?.last_name}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Pseudo</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{profil?.username}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Genre</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{profil?.gender === "male" ? "M" : "F"}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Premium</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">Non</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row text-danger">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Points</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="mb-0">{profil?.points}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-dark box-shadow my-3">
                            <div className="card-header">
                                <h3>Historique</h3>
                            </div>
                            <div className="card-body">
                                {
                                    profil?.historicGames.length === 0 && 
                                    <p className="fst-italic text-muted">Les parties jouées s'afficheront ici !</p>
                                }
                                {profil?.historicGames.map((game: game, index: number) => (
                                    <HistoricGame key={index} role={game.role} isWon={game.isWon} createdAt={game.createdAt} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <TitlesModal />
        </div>
    )
}

export default Profil;