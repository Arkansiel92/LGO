import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Alert, { alert } from '../Alert/Alert';
import { AuthContext } from '../../context/auth';

interface credentials {
    email: string,
    plainPassword: string,
    confirm_password: string,
    username: string,
    firstName: string,
    lastName: string
    gender: string,
}

function Register() {

    const [alert, setAlert] = useState<alert | null>(null);
    const auth = useContext(AuthContext);
    const { handleSubmit, register, formState: { errors } } = useForm<credentials>();

    function onSubmit(data: credentials) {
        if (data.plainPassword === '') return;

        if (data.confirm_password === data.plainPassword) {
            fetch('https://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (res.status === 500) return setAlert({type:'danger', msg:'Adresse mail déjà existante.'}); // adresse mail existe déjà

                    if (res.ok) {
                        setAlert({type: 'success', msg:"Inscription réussi, vous pouvez vous connecter !"});
                    } else {
                        setAlert({type: 'danger', msg:"Erreur, merci de réessayer."});
                    }
                })
                .catch(error => { console.log("ERREUR : ", error) })
        } else {
            setAlert({type: 'danger', msg:"Les deux mot de passe sont différents."});
        }
    }

    return (
        <div className="modal fade" id="register" tabIndex={-1} aria-labelledby="register" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content bg-dark">
                    <div className="modal-body">
                        {alert && <Alert type={alert.type} msg={alert.msg} />}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <section className="container">
                                    <h3>Informations personnelles</h3>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Adresse e-mail</label>
                                        <input type="email" className="form-control" placeholder="exemple@exemple.com" {...register('email')} />
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="firstName" className="form-label">Prénom</label>
                                                <input type="text" className="form-control" placeholder="John" {...register('firstName')} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="lastName" className="form-label">Nom</label>
                                                <input type="text" className="form-control" placeholder="Doe" {...register('lastName')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-check-inline">
                                        <input type="radio" className="form-check-input" value={"male"} {...register('gender')} checked />
                                        <label htmlFor="gender" className="form-check-label">Homme</label>
                                    </div>
                                    <div className="form-check-inline">
                                        <input type="radio" className="form-check-input" value={"female"} {...register('gender')} />
                                        <label htmlFor="gender" className="form-check-label">Femme</label>
                                    </div>

                                    <h3 className="mt-3">Informations en jeu</h3>
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">Pseudo</label>
                                        <input type="text" className="form-control" placeholder="pseudo" {...register("username")} />
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="plainPassword" className="form-label">Mot de passe</label>
                                                <input type="password" className="form-control" placeholder="mot de passe" {...register("plainPassword")} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="password" className="form-label">Confirmer mot de passe</label>
                                                <input type="password" className="form-control" placeholder="mot de passe" {...register("confirm_password")} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="text-center">
                                <input type="submit" className="btn btn-lg btn-primary my-3" value="Inscription" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register;