import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketContext, ExtendedSocket } from '../../context/socket';
import Navbar from "../../component/Navbar/Navbar";
import './Home.css';
import Cloud from '../../component/Cloud/Cloud';
import Footer from '../../component/Footer/Footer';

function Home() {
    const socket = useContext<ExtendedSocket>(socketContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [pseudo, setPseudo] = useState<string>('');
    const [room, setRoom] = useState<string>('');
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
        socket.emit('setRoom', pseudo)
    }

    const join = () => {
        socket.emit('join', { id: room, pseudo: pseudo });
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
            {
                alert && <div className='container text-center alert alert-danger'>{alert}</div>
            }
            <div className='my-5'>
                <Cloud nb={1} animationDelay={15} left={10} top={10} />
                <Cloud nb={2} animationDelay={25} left={40} top={9} />
                <Cloud nb={3} animationDelay={20} left={100} top={8} />
                <img className='sun mx-2' src="/assets/img/sprites/sun.png" alt="moon" />
            </div>
            <div>
                <div className="m-auto w-50">
                    <div className="mt-5">
                        {
                            card === "create"
                                ? <button className="btn btn-lg btn-primary rounded-pill m-1">Créer une partie</button>
                                : <button className="btn btn-lg btn-primary rounded-pill m-1" onClick={() => { setCard('create') }}>Créer une partie</button>
                        }
                        {
                            card === "join"
                                ? <button className="btn btn-lg btn-primary rounded-pill m-1">Rejoindre</button>
                                : <button className="btn btn-lg btn-primary rounded-pill m-1" onClick={() => { setCard('join') }}>Rejoindre</button>
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
                <Footer />
            </div>
        </div>
    )
}

export default Home;