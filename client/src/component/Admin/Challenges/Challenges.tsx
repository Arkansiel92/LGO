import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Alert, { alert } from "../../Alert/Alert";

interface challenge {
    title: number,
    role: string[],
    description: string,
}

interface title {
    id: number,
    title: string,
}

interface role {
    id: number,
    name: string
    side: string,
}

function Challenges() {

    const { handleSubmit, register, formState: { errors } } = useForm<challenge>();

    const [titles, setTitles] = useState<title[] | null>(null);
    const [roles, setRoles] = useState<role[] | null>(null);
    const [alert, setAlert] = useState<alert>();

    const onSubmit = (data: challenge) => {
        console.log(data);

        fetch('https://localhost:8000/api/challenges', {
            method:'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (res.ok) return setAlert({type: 'success', msg: 'Le challenge ' + data.description + ' a été ajouté avec succès.'});
            else return setAlert({type:'danger', msg:'Une erreur est survenue, merci de réessayer.'});
        })
    }

    useEffect(() => {
        if (!titles) {
            fetch('https://localhost:8000/api/titles', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => setTitles(data))
        }

        if (!roles) {
            fetch('https://localhost:8000/api/roles', {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => setRoles(data))
        }
    }, [titles, roles])

    return (
        <div>
            <h1>Challenges</h1>
            {
                alert && <Alert type={alert.type} msg={alert.msg} />
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="description" className="form-label">Description du challenge</label>
                <input type="text" className="form-control" placeholder="description" {...register('description')} />
                <label htmlFor="title" className="form-label">Titre récompense</label>
                <select className="form-select" {...register('title')}>
                    {titles?.map((title: title, index: number) => (
                        <option key={index} value={"api/titles/" + title.id}>{title.title}</option>
                    ))}
                </select>
                <div className="row">
                    {roles?.map((role, index) => (
                        <div key={index} className={`form-check col-sm-2 m-3 p-1 ${role.side}`}>
                            <input className="form-check-input" type="checkbox" value={"api/roles/" + role.id} {...register('role')} />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    {role.name}
                                </label>
                        </div>
                    ))}
                </div>
                <div className="text-end">
                    <input type="submit" value="Créer le challenge" className="btn btn-warning my-3" />
                </div>
            </form>
        </div>
    )
}

export default Challenges;