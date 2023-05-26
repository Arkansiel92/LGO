import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketContext, ExtendedSocket } from '../../context/socket';
import Navbar from "../../component/Navbar/Navbar";
import './Home.css';
import Footer from '../../component/Footer/Footer';
import { AuthContext } from '../../context/auth';
import News from '../../component/News/News';
import Spinner from '../../component/Spinner/Spinner';

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

function Home() {
    
    const socket = useContext<ExtendedSocket>(socketContext);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [news, setNews] = useState<news[] | null>(null);
    const [bestPlayer, setBestPlayer] = useState<bestPlayer | null>(null);
    const [accounts, setAccounts] = useState<number | null>(null);
    const [room, setRoom] = useState<string>('');
    const [sprite, setSprite] = useState<string>("1");
    const [alert, setAlert] = useState<string>('');

    socket.on('navigate', (path: string) => {
        setLoading(true);
        setTimeout(() => {
            navigate(path);
        }, 1500)
    })

    socket.on('alert', (msg: string) => {
        setAlert(msg);
    })

    const handleSubmit = () => {
        socket.emit('setRoom', { pseudo: auth.authState.user?.username, sprite: sprite })
    }

    const join = () => {
        let data = {
            id: room,
            pseudo: auth.authState.user?.username,
            sprite: sprite
        }

        socket.emit('join', data);
    }

    useEffect(() => {
        socket.emit('clear');

        if (!news) {
            fetch('https://localhost:8000/api/news', {
                method: "GET"
            })
                .then(res => res.json())
                .then(data => {
                    setNews(data['hydra:member'])
                })
        }

        if (!bestPlayer) {
            fetch('https://localhost:8000/api/users', {
                method: "GET"
            }) 
            .then (res => res.json())
            .then(data => {
                setBestPlayer({
                    username: data['hydra:member'][0].username,
                    points: data['hydra:member'][0].points
                })
            })
        }

        if (!accounts) {
            fetch('https://localhost:8000/api/users', {
                method: "GET"
            })
            .then(res => res.json())
            .then(data => setAccounts(data['hydra:totalItems']))
        }
        
    }, [socket, accounts, bestPlayer, news])

    return (
        <div>
            {
                loading && <div id="loader-home"></div>
            }
            <Navbar />
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
                            <div className="text-center mt-4">
                                <button onClick={handleSubmit} className="btn btn-warning mx-2">
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z" />
                                    <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .433-.335.504.504 0 0 1-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 0 0-.748 2.295 12.351 12.351 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.354 12.354 0 0 0-.339-2.406 13.753 13.753 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z" />
                                </svg>
                                <div>
                                    <h4>Parties jouées</h4>
                                    <p className="lead"><span className="text-danger">0</span> parties jouées</p>
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
                                    <p className='lead text-danger'>Arkansiel (1256 pts)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="news my-5">
                    <h2>LES NEWS</h2>
                    <ul className="list-group">
                        {!news && <Spinner />}
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
                <div className='rounded'>
                    <div className="row container-fluid text-center my-5">
                        <div className="col rounded p-2 mx-3">
                            <img src="assets/img/role/card-cupidon.svg" alt="" width={60} />
                            <h2><strong>Jouer à plusieurs</strong></h2>
                            <p className='lead'>Jouer jusqu'à 20 joueurs rapidement en rejoignant la partie avec un simple code. Un jeu qui rapproche les uns des autres et aide à développer l'esprit d'équipe !</p>
                        </div>
                        <div className="col rounded p-2 mx-3">
                            <img src="assets/img/role/card-actor.svg" alt="" width={60} />
                            <h2><strong>30 rôles disponible</strong></h2>
                            <p className='lead'>Incarne l'un des 30 rôles disponible. De nombreux rôles dans cette version avec des nouveaux systèmes. Il est important de bien cerner les particularités techniques de chacun des rôles afin de réussir à gagner.</p>
                        </div>
                        <div className="col rounded p-2 mx-3">
                            <img src="assets/img/role/card-hair.svg" alt="" width={60} />
                            <h2><strong>Simple et rapide</strong></h2>
                            <p className='lead'>Avec un pseudo et un code, vous pouvez rejoindre n'importe quelle partie et jouer directement sans attente ou création de compte.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home;