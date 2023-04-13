import { NavLink } from 'react-router-dom';
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
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
                        <li className="nav-item">
                            <NavLink to ="/roles" aria-current="page" className="nav-link">
                                Liste des rôles
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;