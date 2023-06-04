import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Alert, { alert } from "../../Alert/Alert";

interface role {
    name: string,
    nameFunction: string,
    description: string,
    side: string | null,
    step: string | null,
    descriptionInGame: string | null,
    max: number | string,
    needVictim: boolean
    img: string
}

function Roles() {

    const { handleSubmit, register, formState: { errors } } = useForm<role>();
    const [alert, setAlert] = useState<alert>();
    const [roles, setRoles] = useState<role[] | null>(null);

    const onSubmit = (role: role) => {
        if (role.descriptionInGame === "") role.descriptionInGame = null;
        if (role.step === "") role.step = null;
        if (role.side === "") role.side = null;

        if (typeof(role.max) === "string") role.max = parseInt(role.max);

        fetch('https://localhost:8000/api/roles', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(role)
        })
        .then(res => {
            if (res.ok) return setAlert({type: "success", msg: "Le rôle '" + role.name + "' a été ajouté avec succès."});
            else return setAlert({type: "danger", msg: "Une erreur est survenue, merci de réessayer ultérieurement."});
        })
    }

    useEffect(() => {
        if (alert) {
            fetch('https://localhost:8000/api/roles', {
                method: "GET",
                headers: {
                    'accept':'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setRoles(data)
            });
        }
    }, [alert])

    return (
        <div>
            <h1>Roles</h1>
            {alert && <Alert type={alert.type} msg={alert.msg} />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col">
                        <label htmlFor="name" className="form-label">Nom</label>
                        <input type="text" className="form-control" placeholder="Nom du rôle" {...register('name')} />
                    </div>
                    <div className="col">
                        <label htmlFor="name_function" className="form-label">Nom fonction</label>
                        <input type="text" className="form-control" placeholder="fonction qui sera utilisé dans le serveur Node" {...register('nameFunction')} />
                    </div>
                </div>
                <div className="">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea cols={30} rows={5} className="form-control" placeholder="Description du rôle" {...register('description')}></textarea>
                </div>
                <div className="row">
                    <div className="col ">
                        <label htmlFor="side" className="form-label">Camp du rôle</label>
                        <select className="form-select" {...register('side')}>
                            <option value={""}>Choisir un camp</option>
                            <option value="village">rôle village</option>
                            <option value="werewolf">rôle loup-garou</option>
                            <option value="seul">rôle seul</option>
                        </select>
                    </div>
                    <div className="col ">
                        <label htmlFor="step" className="form-label">Etape de jeu</label>
                        <select className="form-select" {...register('step')}>
                            <option value="">Choisir une étape</option>
                            <option value="start">Au début</option>
                            <option value="werewolf">Loup-garou</option>
                            <option value="middle">Après loup-garou</option>
                            <option value="end">A la fin</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col ">
                        <label htmlFor="description_in_game" className="form-label">Description en jeu</label>
                        <input type="text" className="form-control" placeholder="description en jeu" {...register('descriptionInGame')} />
                    </div>
                    <div className="col ">
                        <label htmlFor="max" className="form-label">Nombre de rôle dans une partie</label>
                        <select className="form-select" {...register('max')}>
                            <option value="">Choisir un nombre</option>
                            <option value={1}>1 par partie</option>
                            <option value={100}>Infini</option>
                        </select>
                    </div>
                </div>
                <div className="">
                    <label htmlFor="img" className="form-label">Image du rôle</label>
                    <input type="text" className="form-control" placeholder="exemple.svg" {...register('img')} />
                </div>
                <div className="form-check my-2">
                    <input className="form-check-input" type="checkbox" {...register('needVictim')} />
                        <label className="form-check-label" htmlFor="flexCheckChecked">
                            Besoin d'une victime ?
                        </label>
                </div>
                <div className="text-end">
                    <input type="submit" className="btn btn-warning" value="Créer le rôle" />
                </div>
            </form>

            <ul className="list-group list-group-flush">
                {roles?.map((role: role, index: number) => (
                    <li key={index} className="list-group-item">
                        <div className="d-flex">
                            <div>{role.name}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Roles;