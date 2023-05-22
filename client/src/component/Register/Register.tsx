import { useForm } from 'react-hook-form';

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

    const { handleSubmit, register, formState: { errors } } = useForm<credentials>();

    function onSubmit(data: credentials) {
        if (data.plainPassword === '') return;

        if (data.confirm_password === data.plainPassword) {
            fetch('https://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded"
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (res.status === 500) return; // adresse mail existe déjà

                if (!res.ok) return;
                else {
                    res.json().then(data => {
                        if (data) return;
                    });
                }
            })
            .catch(error => {console.log("ERREUR : ", error)})  
        } else {
            console.log("Les deux mot de passe sont différents.");
        }
    }

    return (
        <div className="modal fade" id="register" tabIndex={-1} aria-labelledby="register" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content bg-dark">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Inscription Moonrise</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div>
                                <section className="container">
                                    <h3>Informations personnelles</h3>
                                    <div className="form-group">
                                        <label htmlFor="" className="form-label">Adresse e-mail</label>
                                        <input type="email" className="form-control" placeholder="exemple@exemple.com" {...register('email')} />
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="" className="form-label">Prénom</label>
                                                <input type="text" className="form-control" placeholder="John" {...register('firstName')} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="" className="form-label">Nom</label>
                                                <input type="text" className="form-control" placeholder="Doe" {...register('lastName')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-check-inline">
                                        <input type="radio" className="form-check-input" value={"male"} {...register('gender')} />
                                        <label htmlFor="" className="form-check-label">Homme</label>
                                    </div>
                                    <div className="form-check-inline">
                                        <input type="radio" className="form-check-input" value={"female"} {...register('gender')} />
                                        <label htmlFor="" className="form-check-label">Femme</label>
                                    </div>

                                    <h3 className="mt-3">Informations en jeu</h3>
                                    <div className="form-group">
                                        <label htmlFor="" className="form-label">Pseudo</label>
                                        <input type="text" className="form-control" placeholder="pseudo" {...register("username")} />
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="" className="form-label">Mot de passe</label>
                                                <input type="password" className="form-control" placeholder="mot de passe" {...register("plainPassword")} />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="" className="form-label">Confirmer mot de passe</label>
                                                <input type="password" className="form-control" placeholder="mot de passe" {...register("confirm_password")} />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <input type="submit" className="btn btn-primary" value="S'inscrire" />
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default Register;