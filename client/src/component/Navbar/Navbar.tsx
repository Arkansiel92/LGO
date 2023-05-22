import { NavLink, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import Login from '../Login/Login';
import Register from '../Register/Register';
import { accountServices } from '../../services/Auth';
import { useContext, useEffect } from 'react';
import authContext from '../../context/auth';

function Navbar() {

    const navigate = useNavigate();
    const {authenticated, setAuthenticated} = useContext(authContext);

    function logout() {
        accountServices.logout();

        setAuthenticated(false);

        return navigate('/');
    }

    useEffect(() => {
        console.log(authenticated)
    }, [authenticated])

    return (
        <nav id='navbar' className="navbar navbar-dark navbar-expand-lg bg-dark">
            <div className="container-fluid">
                <NavLink to="/" className={'navbar-brand'}>
                    <img src="wolf-howl.svg" width={25} alt="" />
                    Moonrise
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {/* <li className="nav-item">
                            <NavLink to ="/roles" aria-current="page" className="nav-link">
                                Liste des rôles (bientôt débug)
                            </NavLink>
                        </li> */}
                        <li className="nav-item">
                            <NavLink to="/news" aria-current="page" className="nav-link">
                                Nouveautés
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to={"/leaderboard"} aria-current="page" className="nav-link">
                                Classement
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="d-flex">
                    {
                        !authenticated
                        ? <div>
                            <button className='btn btn-primary mx-1' data-bs-toggle="modal" data-bs-target="#login">Se connecter</button>
                            <button className='btn btn-secondary' data-bs-toggle="modal" data-bs-target="#register">S'inscrire</button>
                        </div>
                        : <div>
                            <button onClick={logout} className="btn btn-danger">Se déconnecter</button>
                        </div>
                    }
                </div>
            </div>

            <Login />
            <Register />
        </nav>
    )
}

export default Navbar;