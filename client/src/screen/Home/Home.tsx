import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketContext, ExtendedSocket } from '../../context/socket';
import Navbar from "../../component/Navbar/Navbar";
import './Home.css';

function Home() {
    const socket = useContext<ExtendedSocket>(socketContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [pseudo, setPseudo] = useState<string>('');
    const [room, setRoom] = useState<string>('');
    const [alert, setAlert] = useState<string>('');
    const [card, setCard] = useState<string>('create');

    socket.on('navigate', (id: string) => {
        setLoading(true);
        setTimeout(() => {
            navigate(id);
        }, 2000)
    })

    socket.on('alert', (msg: string) => {
        setAlert(msg);
    })

    const handleSubmit = () => {
        let id: string = Date.now().toString();
        socket.emit('setRoom', { id: id, pseudo: pseudo })
    }

    const join = () => {
        socket.emit('join', { id: room, pseudo: pseudo });
    }

    useEffect(() => {
        socket.emit('clear');
    }, [socket])

    return (
        <div>
            {
                loading && <div id="loader-home"></div>
            }
            <div className=''>
                <Navbar />
                {
                    alert && <div className='container text-center alert alert-danger'>{alert}</div>
                }
                <img className='img-bg m-5' src="/assets/img/moon.png" alt="" width={150} />
                <div className="home d-flex flex-column">
                    <div className="m-auto w-50">
                        <div className="mt-5 d-flex justify-content-around">
                            {
                                card === "create"
                                    ? <button className="btn-home">Créer une partie</button>
                                    : <button className="btn-home" onClick={() => { setCard('create') }}>Créer une partie</button>
                            }
                            {
                                card === "join"
                                    ? <button className="btn-home">Rejoindre</button>
                                    : <button className="btn-home" onClick={() => { setCard('join') }}>Rejoindre</button>
                            }
                        </div>
                        {
                            card === "create"
                                ? <div>
                                    <div className="form-group mt-3">
                                        <input type="text" className='form-control form-control-lg' value={pseudo} placeholder="Entrez votre nom" onChange={(e) => { setPseudo(e.target.value) }} />
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
                    <div className="row px-5 container-fluid text-center">
                        <div className="col-lg-4">
                            <img className='card-circle' src="assets/img/role/card-cupidon.svg" alt="" width={60} />
                            <h2><strong>Jouer à plusieurs</strong></h2>
                            <p className='lead'>Jouer jusqu'à 20 joueurs rapidement en rejoignant la partie avec un simple code. Un jeu qui rapproche les uns des autres et aide à développer l'esprit d'équipe !</p>
                        </div>
                        <div className="col-lg-4">
                            <img className='card-circle' src="assets/img/role/card-actor.svg" alt="" width={60} />
                            <h2><strong>Plus de 30 rôles disponible</strong></h2>
                            <p className='lead'>Incarne l'un des 32 rôles disponible. De nombreux rôles dans cette version avec des nouveaux systèmes. Il est important de bien cerner les particularités techniques de chacun des rôles afin de réussir à gagner.</p>
                        </div>
                        <div className="col-lg-4">
                            <img className='card-circle' src="assets/img/role/card-hair.svg" alt="" width={60} />
                            <h2><strong>Simple et rapide</strong></h2>
                            <p className='lead'>Avec un pseudo et un code, vous pouvez rejoindre n'importe quelle partie et jouer directement sans attente ou création de compte.</p>
                        </div>
                    </div>
                    <footer className="bg-dark mt-auto p-2 text-center">
                        <span>
                            Arkansiel © - 2023. <a target={'_blank'} rel="noreferrer" href="https://discord.gg/J6wefxT4">Discord MyouTwitch</a>
                        </span>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default Home;