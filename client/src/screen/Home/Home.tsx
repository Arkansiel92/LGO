import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socketContext, ExtendedSocket } from '../../context/socket';
import Navbar from "../../component/Navbar";
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
                alert !== '' ? <div className='container text-center alert alert-danger'>{alert}</div> : <div></div>
            }
            <div className="row h-100 container-fluid">
                <div className="card-game col">

                </div>
                <div className="form-game m-auto col-4">
                    <div className="card m-5">
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
            </div>

        </div>
    )
}

export default Home;