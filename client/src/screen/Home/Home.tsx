import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketContext, ExtendedSocket } from '../../context/socket';
import Navbar from "../../component/Navbar";

function Home() {
    const socket = useContext<ExtendedSocket>(socketContext);
    const navigate = useNavigate();
    const [pseudo, setPseudo] = useState<string>('');
    const [players, setPlayers] = useState<number>(2);
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
        socket.emit('setRoom', { id: id, players: players, pseudo: pseudo })
    }

    const join = () => {
        socket.emit('join', { id: room, pseudo: pseudo });
    }

    useEffect(() => {
        socket.emit('clear');
    }, [socket])

    return (
        <div>
            <Navbar />
            {
                alert !== '' ? <div className='container text-center alert alert-danger'>{alert}</div> : <div></div>
            }
            <div className="card w-25 m-auto my-5">
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            {
                                card === "create"
                                    ? <button className="nav-link active">Partie privée</button>
                                    : <button className="nav-link" onClick={() => { setCard('create') }}>Partie privée</button>
                            }
                        </li>
                        <li className="nav-item">
                            {
                                card === "join"
                                    ? <button className="nav-link active">Rejoindre</button>
                                    : <button className="nav-link" onClick={() => { setCard('join') }}>Rejoindre</button>
                            }
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    {
                        card === "create"
                            ? <div>
                                <div className="form-group mt-3">
                                    <label className='form-label'>Nom du joueur</label>
                                    <input type="text" className='form-control' value={pseudo} placeholder="Entrez votre nom" onChange={(e) => { setPseudo(e.target.value) }} />
                                </div>
                                <div className="form-group my-3">
                                    <select className='my-3 form-select' value={players} name="players" onChange={(e) => { setPlayers(Number(e.target.value)) }}>
                                        <option value="2">2 joueurs</option>
                                        <option value="3">3 joueurs</option>
                                        <option value="4">4 joueurs</option>
                                        <option value="5">5 joueurs</option>
                                        <option value="6">6 joueurs</option>
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
                                    <label className='form-label'>Nom du joueur</label>
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