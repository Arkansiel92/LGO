import { useParams } from 'react-router-dom';

type Params = {
    id: string
}

function Game() {

    const { id } = useParams<Params>();

    return (
        <div>{id}</div>
    )
}

export default Game;