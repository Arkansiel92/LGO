import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface login {
    email: "string",
    password: "string"
}

function Login() {

    const { handleSubmit, register, formState: { errors } } = useForm<login>();

    const [alert, setAlert] = useState({result: '', msg: ''});

    function onSubmit(data: login) {
        fetch('https://localhost:8000/auth', {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (!res.ok) {
                    return setAlert(
                        {result: 'danger', 
                        msg: 'Adresse mail ou mot de passe incorrect.'
                    });
                }
                
                return res.json();
            })
            .then(data => {
                console.log(data);
                localStorage.setItem('token', data);

                return setAlert({
                    result: 'success',
                    msg: 'Connexion réussi, vous allez être rédirigé.'
                })
            })
    }

    return (
        <div className="modal fade" id="login" tabIndex={-1} aria-labelledby="login" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content bg-dark">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Se connecter</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {
                                alert.msg &&
                                <div className={`alert alert-${alert.result} text-center`} role="alert">
                                    <strong>{alert.result === "danger" ? "Erreur :" : "Succès :"} </strong>{alert.msg}
                                </div>
                            }
                            <div className="form-group">
                                <label htmlFor="email">Adresse e-mail</label>
                                <input className='form-control' placeholder='email' type="text" {...register('email')} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Mot de passe</label>
                                <input className='form-control' placeholder='mot de passe' type="password" {...register('password')} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <input type="submit" className="btn btn-primary" value="Se connecter" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;