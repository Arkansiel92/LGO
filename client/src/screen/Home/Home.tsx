import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketContext, ExtendedSocket } from '../../context/socket';
import Navbar from "../../component/Navbar/Navbar";
import './Home.css';

function Home() {
    const socket = useContext<ExtendedSocket>(socketContext);
    const navigate = useNavigate();
    const [pseudo, setPseudo] = useState<string>('');
    const [room, setRoom] = useState<string>('');
    const [alert, setAlert] = useState<string>('');
    const [card, setCard] = useState<string>('create');

    socket.on('navigate', (id: string) => {
        navigate(id);
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
        <div className='gameScreen'>
            <Navbar />
            {
                alert && <div className='container text-center alert alert-danger'>{alert}</div>
            }
            <div className="home row">
                <div className="card-game m-auto text-center col">
                    <h1>Loup-Garou en ligne</h1>
                    <p className='lead'>La nouvelle version du jeu <i>Les Loups-garous de Thiercelieux</i> est arrivée !</p>
                </div>
                <div className="div-form rounded p-3 m-5 col-4">
                    <div className="my-5 d-flex justify-content-around">
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
                                    <input type="text" className='form-control' value={pseudo} placeholder="Entrez votre nom" onChange={(e) => { setPseudo(e.target.value) }} />
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
                                    <input type="text" className='form-control' value={pseudo} placeholder="Entrez votre nom" onChange={(e) => { setPseudo(e.target.value) }} />
                                </div>

                                <div className="form-group my-3">
                                    <input type="text" className='form-control' value={room} placeholder="ID du lobby" onChange={(e) => { setRoom(e.target.value) }} />
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
            </div>


        </div>
    )
}

export default Home;