import { useEffect, useState } from "react";
import Navbar from "../../component/Navbar/Navbar";
import "./Profil.css";
import { useNavigate } from "react-router-dom";

interface profil {
    username: string
    first_name: string,
    last_name: string,
    gender: string,
    roles: string[],
    title: string
}

function Profil() {

    const [profil, setProfil] = useState<profil | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) return navigate('/');

        if (!profil) {
            fetch('https://localhost:8000/api/users/1', {
                method: "GET",
                headers: {
                    'accept':'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProfil(data);
            });
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Mon profil</h1>
                {
                    profil?.roles.includes('ROLE_BETA') &&
                    <div className="text-end">
                        <button className="btn btn-warning my-2">Avoir tous les titres</button>
                    </div>
                }
                <div className="row">
                    <div className="col-4">
                        <div className="card bg-dark box-shadow">
                            <div className="card-body text-center">
                                <img src="assets/img/role/card-werewolf.svg" alt="avatar" className="rounded-circle img-fluid" width={250} />
                                <h5 className="mb-1">{profil?.username}</h5>
                                {
                                    profil?.title
                                    ? <p className="text-muted mb-4">{profil?.title}</p>
                                    : <p className="text-muted fst-italic mb-4">Aucun titre</p>
                                }
                                <div className="d-flex justify-content-center mb-2">
                                    <button type="button" disabled className="btn btn-warning">Modifier profil</button>
                                    <button type="button" className="btn btn-outline-warning ms-1">Changer de titre</button>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-dark box-shadow my-3">
                            <div className="card-body text-center">
                                <h5 className="text-muted mb-1">Taux de victoire</h5>
                                <h1>36%</h1>
                            </div>
                        </div>

                        <div className="card bg-dark box-shadow my-3">
                            <div className="card-header">
                                <h3>Mes défis</h3>
                            </div>
                            <div className="card-body">
                                <div className="my-3">
                                    <span className="">Gagner 5 parties </span>
                                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                                        <div className="progress-bar" style={{width: "60%"}}></div>
                                    </div>
                                </div>

                                <div className="my-3">
                                    <span>Charmer 10 personnes</span>
                                    <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                                        <div className="progress-bar" style={{width: "10%"}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                        <p className="mb-0">0</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-dark box-shadow my-3">
                            <div className="card-header">
                                <h3>Mes parties</h3>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p>Loup-garou</p>
                                    <p className="text-success">Gagné</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <p>Cupidon</p>
                                    <p className="text-danger">Perdue</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profil;