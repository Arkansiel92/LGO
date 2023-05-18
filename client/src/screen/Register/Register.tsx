import Navbar from "../../component/Navbar/Navbar";
import { useForm } from 'react-hook-form';

function Register() {

    const { handleSubmit, register, formState: { errors } } = useForm();

    function onSubmit(data: any) {
        // if (data.confirm_password === data.plainPassword) {
        //     fetch('http://localhost:8000/api/users', {
        //         method: 'POST',
        //         headers: {
        //             // "Content-Type": "application/x-www-form-urlencoded"
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(data)
        //     })
        //     .then(res => console.log(res))
        //     .catch(error => {console.log("ERREUR : ", error)})  
        // }

        fetch('https://localhost:8000/auth', {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": "admin@moonrise.fr",
                "password": "joeil92250"
            })
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }

    return (
        <div>
            <Navbar />
            <div className="row mx-5">
                <div className="col">
                    <section className="my-5 container">
                        <h1 className="text-center">Inscription</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h3>Informations personnelles</h3>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">Addresse e-mail</label>
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
                            <p className="lead mt-3">Optionnel : en tant que Bêta-testeur, vous avez la possibilité de créer un nouveau titre.</p>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">Nouveau titre</label>
                                <input type="text" className="form-control" placeholder="ex : Dieu des dieux" max={10} {...register("title")} />
                            </div>
                            <input type="submit" className="btn btn-primary my-3" value="S'inscrire" />
                        </form>
                    </section>
                </div>
                <div className="col">
                    <img src="assets/img/triple-scratches.svg" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Register;