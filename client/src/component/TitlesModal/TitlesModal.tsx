import { useForm } from "react-hook-form";
import "./TitlesModal.css";
import { useEffect, useState } from "react";
import Alert, { alert } from "../Alert/Alert";



interface title {
    id: number,
    title: string
}

interface credentials {
    title: string
}

function TitlesModal() {

    const [titles, setTitles] = useState<title[] | null>(null);
    const [alert, setAlert] = useState<alert | null>(null);

    const { handleSubmit, register, formState: { errors } } = useForm<credentials>();

    const onSubmit = (credentials: credentials) => {
        if (credentials.title !== '') {
            fetch('https://localhost:8000/api/users/1', {
                method:'PATCH',
                headers: {
                    'Content-Type': 'application/merge-patch+json'
                },
                body: JSON.stringify(credentials)
            })
            .then(res => {
                if(res.status === 200) {
                    setAlert({type: "success", msg: "Ton titre a été changé avec succès !"})
                }
            })
        }
    }

    useEffect(() => {
        fetch('https://localhost:8000/api/titles', {
            method: 'GET',
            headers: {
                'accept':'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            setTitles(data)
        })
    }, [])

    return (
        <div className="modal fade" id="title" tabIndex={-1} aria-labelledby="title" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content bg-dark">
                    <div className="modal-header">
                        <h3 className="modal-title">Titres</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {alert && <Alert type={alert.type} msg={alert.msg} />}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <select className="form-select" {...register('title')}>
                                <option value="">Choisir un titre</option>
                                {titles?.map((title: title, index: number) => (
                                    <option key={index} value={"api/titles/" + title.id}>{title.title}</option>
                                ))}
                            </select>
                            <div className="text-end">
                                <button className="btn btn-warning my-3" type="submit">Sélectionner le titre</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TitlesModal;