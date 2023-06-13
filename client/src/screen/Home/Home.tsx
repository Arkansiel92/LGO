import s from './Home.module.css';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketContext, } from '../../context/socket';
import Navbar from "../../component/Navbar/Navbar";
import Footer from '../../component/Footer/Footer';
import { AuthContext } from '../../context/auth';
import News from '../../component/News/News';
import Loader from '../../component/Loader/Loader';

export interface news {
    id: number,
    title: string,
    type: string,
    content: string,
    createdAt: string
}

interface bestPlayer {
    username: string,
    points: number
}

interface bestClan {
    name: string,
    points: number,
    banner: string,
    emblem: string
}

interface role {
    id: number,
    name: string,
    description: string,
    side: string,
    img: string
}

function Home() {

    const socket = useContext(socketContext);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [news, setNews] = useState<news[] | null>(null);
    const [bestPlayer, setBestPlayer] = useState<bestPlayer | null>(null);
    const [bestClan, setBestClan] = useState<bestClan | null>(null);
    const [accounts, setAccounts] = useState<number | null>(null);
    const [roles, setRoles] = useState<role[] | null>(null);
    const [roleIndex, setRoleIndex] = useState<number>(0);
    const [alert, setAlert] = useState<string>('');

    socket.on('join-room', (path: string) => {
        setLoading(true);
        // setTimeout(() => {
        // }, 1500)
        navigate(path);
    })

    socket.on('alert', (msg: string) => {
        setAlert(msg);
    })

    const handleSubmit = () => {
        // socket.emit('setRoom', { pseudo: auth.authState.user?.username, sprite: "1" })

        socket.emit('create-room', {
            id: auth.authState.user?.id,
            username: auth.authState.user?.username,
            clan: auth.authState.user?.clan,
            title: auth.authState.user?.title
        });
    }

    useEffect(() => {
        // socket.emit('clear');

        if (!news) {
            fetch('https://localhost:8000/api/news?itemsPerPage=5', {
                method: "GET",
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setNews(data)
                })
        }

        if (!bestPlayer) {
            fetch('https://localhost:8000/api/users?itemsPerPage=1', {
                method: "GET",
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setBestPlayer({
                        username: data[0].username,
                        points: data[0].points
                    })
                })
        }

        if (!bestClan) {
            fetch('https://localhost:8000/api/clans?itemsPerPage=1', {
                method: "GET",
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setBestClan({
                        name: data[0].name,
                        points: data[0].points,
                        banner: data[0].banner,
                        emblem: data[0].emblem
                    })
                })
        }

        if (!accounts) {
            fetch('https://localhost:8000/api/users', {
                method: "GET",
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => setAccounts(data.length));
        }

        if (!roles) {
            fetch('https://localhost:8000/api/roles', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setRoles(data)
                });
        }

    }, [socket, accounts, bestPlayer, bestClan, news, roles])

    return (
        <div>
            <Navbar />
            {
                accounts && bestPlayer && bestClan && news && roles
                    ? <div>
                        {
                            loading && <div id="loader-home"></div>
                        }
                        <div className="container">
                            {
                                alert && <div className='container text-center alert alert-danger'>{alert}</div>
                            }
                            <header className='my-5 text-center card bg-dark box-shadow p-5'>
                                <h1 className='fw-light mb-4'>Moonrise</h1>
                                <p className='lead'>Nouveau jeu de loup-garou en ligne inspiré du célèbre jeu de société <span className='fw-bold'>"Loup Garou de Thiercelieux"</span>. Ce jeu captivant est conçu pour les passionnés de jeux de rôles, de mystères et d'intrigues. La version en ligne du jeu offre une expérience unique, qui permet aux joueurs de se plonger dans un univers fascinant rempli de rebondissements. Que vous soyez un joueur expérimenté ou un novice, notre jeu de loup-garou est parfait pour vous.</p>
                                {
                                    auth.authState.isAuthenticated
                                        ?
                                        <div className="d-grid gap-2 col-4 mx-auto my-3">
                                            <button onClick={handleSubmit} className="btn btn-lg btn-warning rounded-pill mx-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                </svg>
                                                Créer une partie
                                            </button>
                                        </div>
                                        : <p className='lead mt-4'>Déjà un compte ? <span className='text-warning left-click' data-bs-toggle="modal" data-bs-target="#login">Connectez-vous</span></p>
                                }
                            </header>
                            <div className="row">
                                <div className="col">
                                    <div className="card bg-dark box-shadow">
                                        <div className="d-flex justify-content-around align-items-center p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                            </svg>
                                            <div>
                                                <h4>Nombre de joueurs</h4>
                                                <p className='lead'><span className='text-danger'>{accounts}</span> comptes crées</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card bg-dark box-shadow">
                                        <div className='d-flex justify-content-around align-items-center p-2'>
                                            <div className="position-relative">
                                                <img className={s.banner} src={bestClan?.banner} alt="" width={30} />
                                                <img className={s.emblem} src={bestClan?.emblem} alt="" width={15} />
                                            </div>
                                            <div>
                                                <h4>Clan numéro #1</h4>
                                                <p className="lead"><span className="text-danger">{bestClan?.name}</span> ({bestClan?.points}pts)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card bg-dark box-shadow">
                                        <div className='d-flex justify-content-around align-items-center p-2'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
                                            </svg>
                                            <div>
                                                <h4>Joueur numéro #1</h4>
                                                <p className='lead'><span className="text-danger">{bestPlayer?.username}</span> ({bestPlayer?.points}pts)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="my-5">
                                <h2>LES NEWS</h2>
                                <ul className="list-group">
                                    {news?.map((n: news, index: number) => (
                                        <News
                                            key={index}
                                            id={n.id}
                                            title={n.title}
                                            type={n.type}
                                            content={n.content}
                                            createdAt={n.createdAt}
                                        />
                                    ))}
                                </ul>
                            </div>
                            <h2>Les rôles</h2>
                            {
                                roles &&
                                <div className="card bg-dark box-shadow">
                                    <div className={`card-body ${roles[roleIndex].side}`}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h4>{roles[roleIndex].name}</h4>
                                            <img src={"assets/img/role/" + roles[roleIndex].img} alt="" width={30} />
                                        </div>
                                        {roles[roleIndex].description}
                                    </div>
                                </div>
                            }
                            <div className="row">
                                {roles?.map((r: role, index: number) => (
                                    <div onClick={() => { setRoleIndex(index) }} className={`col-sm-2 box-shadow rounded m-3 d-flex ${r.side} left-click`} key={index}>
                                        <img src={"assets/img/role/" + r.img} alt={r.name} width={20} />
                                        <span>{r.name}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                        <Footer />
                    </div>
                    : <Loader />
            }

        </div>
    )
}

export default Home;