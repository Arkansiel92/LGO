import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface newsForm {
    title: string,
    type: string,
    content: string,
    createdAt: Date
}

function News() {
    const [news, setNews] = useState(null);
    const { handleSubmit, register, formState: { errors } } = useForm<newsForm>();

    const onSubmit = (news: newsForm) => {
        if (news.title !== "" && news.content !== "" && news.type !== "") {
            fetch('https://localhost:8000/api/news', {
                method: "POST",
                headers: {
                    // "Authorization": "Bearer " + localStorage.getItem("token"),
                    "accept": "application/json",
                    "Content-type": "application/json"
                },
                body: JSON.stringify(news)
            })
                .then(res => {
                    if (!res.ok) {

                    } else {

                    }
                })
                .catch(error => console.log(error));
        }
    }

    useEffect(() => {

    }, [])

    return (
        <div>
            <h1>News</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input className="form-control my-3" type="text" placeholder="Titre" {...register('title')} />
                <div className="form-group my-3">
                    <label htmlFor="type">Type</label>
                    <select defaultValue={"feature"} className="form-select" {...register('type')}>
                        <option value="feature" >Nouvelle feature</option>
                        <option value="fix">Fix bugs</option>
                        <option value="various">Divers</option>
                    </select>
                </div>
                <textarea className="form-control" id="" cols={20} rows={5} placeholder="Contenu de la MAJ" {...register('content')}></textarea>
                <input className="btn btn-primary my-3" type="submit" value="Envoyer" />
            </form>
        </div>
    )
}

export default News;