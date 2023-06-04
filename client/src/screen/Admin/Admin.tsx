import { useEffect, useContext, useState } from "react";
import Navbar from "../../component/Navbar/Navbar";
import { AuthContext } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import Roles from "../../component/Admin/Roles/Roles";
import News from "../../component/Admin/News/News";
import Challenges from "../../component/Admin/Challenges/Challenges";
import Titles from "../../component/Admin/Titles/Titles";


function Admin() {


    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [admin, setAdmin] = useState('');

    useEffect(() => {
        if (!auth.authState.user?.roles.includes('ROLE_ADMIN')) return navigate('/');
    })

    return (
        <div>
            <Navbar />
            <div className="row container-fluid">
                <div className="col-2">
                    <h4>Dashboard</h4>
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li onClick={() => { setAdmin('roles') }} className={`nav-item d-flex align-items-center my-2 left-click ${admin === 'roles' && "text-warning"} `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>
                            <span className="mx-1">Roles</span>
                        </li>
                        <li onClick={() => { setAdmin('news') }} className={`nav-item d-flex align-items-center my-2 left-click ${admin === 'news' && "text-warning"} `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm.646 2.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L4.293 8 2.646 6.354a.5.5 0 0 1 0-.708zM7 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                            </svg>
                            <span className="mx-1">News</span>
                        </li>
                        <li onClick={() => { setAdmin('challenges') }} className={`nav-item d-flex align-items-center my-2 left-click ${admin === 'challenges' && "text-warning"} `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                            </svg>
                            <span className="mx-1">Challenges</span>
                        </li>
                        <li onClick={() => { setAdmin('titles') }} className={`nav-item d-flex align-items-center my-2 left-click ${admin === 'titles' && "text-warning"} `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                            </svg>
                            <span className="mx-1">Titres</span>
                        </li>
                    </ul>
                </div>
                <div className="col">
                    {
                        admin === "roles" && <Roles />
                    }
                    {
                        admin === "news" && <News />
                    }
                    {
                        admin === "challenges" && <Challenges />
                    }
                    {
                        admin === "titles" && <Titles />
                    }
                </div>
            </div>
        </div>
    )
}

export default Admin;