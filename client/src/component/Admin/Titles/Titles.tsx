import Alert, { alert } from "../../Alert/Alert";
import { useState } from "react";
import "./Titles.css";
import { useForm } from "react-hook-form";

interface title {
    title: string,
    color: string
}

function Titles() {

    const { handleSubmit, register, formState: { errors } } = useForm<title>();
    const [alert, setAlert] = useState<alert>();

    const onSubmit = (data: title) => {
        fetch('https://localhost:8000/api/titles', {
            method:'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (res.ok) {
                setAlert({type:'success', msg: 'Le titre ' + data.title + ' a été ajouté avec succès.'});
            } else {
                setAlert({type: 'danger', msg: 'Une erreur est survenue, merci de réessayer.'});
            }
        })
    }

    return (
        <div>
            <h1>Titres</h1>
            {alert && <Alert type={alert.type} msg={alert.msg} />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="title" className="form-label">Titre</label>
                <input type="text" className="form-control" placeholder="ex: Le fumeur fou" {...register('title')} />

                <label htmlFor="color" className="form-label">Couleur du Titre (héxadécimal)</label>
                <input type="color" className="form-control form-control-color" {...register('color')} />

                <div className="text-end">
                    <input type="submit" value="Créer le titre" className="btn btn-warning" />
                </div>
            </form>
        </div>
    )
}

export default Titles;