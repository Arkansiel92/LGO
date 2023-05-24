import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketContext, ExtendedSocket } from '../../context/socket';
import Navbar from "../../component/Navbar/Navbar";
import './Home.css';
import Cloud from '../../component/Cloud/Cloud';
import Footer from '../../component/Footer/Footer';
import { AuthContext } from '../../context/auth';

function Home() {
    const socket = useContext<ExtendedSocket>(socketContext);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [pseudo, setPseudo] = useState<string>('');
    const [room, setRoom] = useState<string>('');
    const [sprite, setSprite] = useState<string>("1");
    const [alert, setAlert] = useState<string>('');
    const [card, setCard] = useState<string>('create');


    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const id = params['id']

    socket.on('navigate', (id: string) => {
        setLoading(true);
        setTimeout(() => {
            navigate(id);
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

        if (id) {
            setCard('join');
            setRoom(id);
        }
    }, [socket, id])

    return (
        <div>
            {
                loading && <div id="loader-home"></div>
            }
            <Navbar />
            {/* <header style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/maps/background-game.svg'})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center bottom',
                backgroundSize: 'cover',
                height: '100%',
                width: '100%',
                backgroundColor: "#87CEEB"
            }} className='py-5 container-fluid text-center'>
                <h1 className='fw-light'>Moonrise</h1>
                <div className="row">
                    <div className='col-lg-6 col-md-8 mx-auto'>
                        <p className='lead'>Nouveau jeu de loup-garou en ligne inspiré du célèbre jeu de société "Loup Garou de Thiercelieux". Ce jeu captivant est conçu pour les passionnés de jeux de rôles, de mystères et d'intrigues. La version en ligne du jeu offre une expérience unique, qui permet aux joueurs de se plonger dans un univers fascinant rempli de rebondissements. Que vous soyez un joueur expérimenté ou un novice, notre jeu de loup-garou est parfait pour vous.</p>
                    </div>
                </div>
                <div className="mt-5">
                    {
                        card === "create"
                        ? <button className="btn btn-lg btn-success mx-1">Créer une partie</button>
                        : <button className="btn btn-lg btn-primary mx-1" onClick={() => { setCard('create') }}>Créer une partie</button>
                    }
                    {
                        card === "join"
                        ? <button className="btn btn-lg btn-success mx-1">Rejoindre</button>
                        : <button className="btn btn-lg btn-primary mx-1" onClick={() => { setCard('join') }}>Rejoindre</button>
                    }
                </div>
            </header> */}
            <header className='m-5 text-center'>
                <h1 className='fw-light'>Moonrise</h1>
                <p className='lead'>Nouveau jeu de loup-garou en ligne inspiré du célèbre jeu de société "Loup Garou de Thiercelieux". Ce jeu captivant est conçu pour les passionnés de jeux de rôles, de mystères et d'intrigues. La version en ligne du jeu offre une expérience unique, qui permet aux joueurs de se plonger dans un univers fascinant rempli de rebondissements. Que vous soyez un joueur expérimenté ou un novice, notre jeu de loup-garou est parfait pour vous.</p>
                <div className="text-center">
                    <button onClick={handleSubmit} className="btn btn-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                        Créer une partie
                    </button>
                </div>
            </header>
            {
                alert && <div className='container text-center alert alert-danger'>{alert}</div>
            }
            {/* <div className='my-5'>
                <Cloud nb={1} animationDelay={15} left={10} top={10} />
                <Cloud nb={2} animationDelay={25} left={40} top={9} />
                <Cloud nb={3} animationDelay={20} left={100} top={8} />
                <img className='sun mx-2' src="/assets/img/sprites/sun.png" alt="moon" />
            </div> */}
            <div className='container-fluid p-5 rounded my-5'>
                <div>
                    {
                        card === "create"
                            ? <div>
                                <div className="form-group mt-3">
                                    <input type="text" className='form-control form-control-lg' value={pseudo} placeholder="Entrez votre nom" onChange={(e) => { setPseudo(e.target.value) }} />
                                </div>

                                <div className="form-group my-3">
                                    <label htmlFor="sprite">Apparence : </label>
                                    <select className='form-select form-select-lg' value={sprite} onChange={(e) => { setSprite(e.target.value) }} name="sprite" id="sprite">
                                        <option value="1">Joueur bleu</option>
                                        <option value="2">Joueur gris</option>
                                        <option value="3">Joueur rouge</option>
                                        <option value="4">Joueur vert</option>
                                    </select>
                                </div>

                                <div className='my-3 d-grid'>
                                    {
                                        pseudo === ''
                                            ? <button type="submit" disabled className='btn btn-lg btn-success'>Créer la partie</button>
                                            : <button type="submit" onClick={handleSubmit} className='btn btn-lg btn-success'>Créer la partie</button>
                                    }
                                </div>
                            </div>
                            : <div>
                                <div className="form-group mt-3">
                                    <input type="text" className='form-control form-control-lg' value={pseudo} placeholder="Entrez votre nom" onChange={(e) => { setPseudo(e.target.value) }} />
                                </div>

                                <div className="form-group my-3">
                                    <input type="text" className='form-control form-control-lg' value={room} placeholder="ID du lobby" onChange={(e) => { setRoom(e.target.value) }} />
                                </div>

                                <div className="form-group my-3">
                                    <label htmlFor="sprite">Apparence : </label>
                                    <select className='form-select form-select-lg' value={sprite} onChange={(e) => { setSprite(e.target.value) }} name="sprite" id="sprite">
                                        <option value="1">Joueur bleu</option>
                                        <option value="2">Joueur gris</option>
                                        <option value="3">Joueur rouge</option>
                                        <option value="4">Joueur vert</option>
                                    </select>
                                </div>

                                <div className='my-3 d-grid'>
                                    {
                                        pseudo === '' || room === ''
                                            ? <button type="submit" disabled className='btn btn-lg btn-success'>Rejoindre la partie</button>
                                            : <button type="submit" onClick={join} className='btn btn-lg btn-success'>Rejoindre la partie</button>
                                    }
                                </div>
                            </div>
                    }
                </div>
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
            <Footer />
        </div>
    )
}

export default Home;