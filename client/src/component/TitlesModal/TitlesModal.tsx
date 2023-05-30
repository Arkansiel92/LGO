import { useForm } from "react-hook-form";
import "./TitlesModal.css";
import { useEffect, useState } from "react";

interface title {
    id: number,
    title: string
}

interface credentials {
    title: string
}

function TitlesModal() {

    const [titles, setTitles] = useState<title[] | null>(null);

    const { handleSubmit, register, formState: { errors } } = useForm<credentials>();

    const onSubmit = (credentials: credentials) => {
        console.log(credentials);
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
            console.log(data);
            setTitles(data)
        })
    }, [])

    return (
        <div className="modal fade" id="title" tabIndex={-1} aria-labelledby="title" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content bg-dark">
                    <div className="modal-header">
                        <h3>Titres</h3>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <select className="form-select" {...register('title')}>
                                {titles?.map((title: title, index: number) => (
                                    <option value={title.id}>{title.title}</option>
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