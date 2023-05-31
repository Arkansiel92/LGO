import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';

interface login {
    email: "string",
    password: "string"
}

function Login() {

    const { handleSubmit, register, formState: { errors } } = useForm<login>();
    const auth = useContext(AuthContext);
    const [alert, setAlert] = useState({ result: '', msg: '' });
    const [sendForm, setSendForm] = useState(false);

    function onSubmit(credentials: login) {
        setSendForm(true);
        fetch('https://localhost:8000/auth', {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
            .then(res => {
                if (res.status === 401) {
                    setSendForm(false);
                    return setAlert({result: 'danger', msg: 'Adresse mail ou mot de passe incorrect.'});
                } else if (res.status === 500) {
                    setSendForm(false);
                    return setAlert({result: 'danger', msg: 'Le serveur est off. Merci de patentier.'});
                } else {
                    return res.json().then(data => {
                        auth.login(data.token);

                        setAlert({result: 'success', msg: 'Connexion réussi, vous allez être rédirigé.'})

                        return window.location.reload();
                    });
                }
            })
            .catch(() => {
                setSendForm(false);
                return setAlert(
                    {
                        result: 'danger',
                        msg: 'Le serveur est off. Merci de patentier.'
                    });
            })
    }

    return (
        <div className="modal fade" id="login" tabIndex={-1} aria-labelledby="login" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content bg-dark">
                    <div className="modal-body">
                        <h4 className='text-center mb-3'>Se connecter à Moonrise</h4>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {
                                alert.msg &&
                                <div className={`alert alert-${alert.result} text-center`} role="alert">
                                    <strong>{alert.result === "danger" ? "Erreur :" : "Succès :"} </strong>{alert.msg}
                                </div>
                            }
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                                    </svg>
                                </span>
                                <input className='form-control' placeholder='e-mail' type="text" {...register('email')} />
                            </div>
                            <div className="input-group my-3">
                                <span className="input-group-text" id="basic-addon1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                                    </svg>
                                </span>
                                <input className='form-control' placeholder='mot de passe' type="password" {...register('password')} />
                            </div>
                            <div className="text-center">
                                {
                                    !sendForm
                                        ? <input type="submit" className="btn btn-lg btn-primary" value="Connexion" />
                                        : <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                }

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;