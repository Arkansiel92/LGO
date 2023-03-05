import { useParams } from 'react-router-dom';
import './Game.css';

type Params = {
    id: string
}

function Game() {

    const { id } = useParams<Params>();

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-md-2 d-none d-md-block bg-light sidebar">
                {id}
                </div>
                <div className="col">

                </div>
            </div>
        </div>
    )
}

export default Game;