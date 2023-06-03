import { useForm } from "react-hook-form";

interface newsForm {
    title: string,
    type: string,
    content: string,
    createdAt: Date
}

function News() {
    const { handleSubmit, register, formState: { errors } } = useForm<newsForm>();

    const onSubmit = (news: newsForm) => {
        if (news.title !== "" && news.content !== "" && news.type !== "") {
            fetch('https://localhost:8000/api/news', {
                method: "POST",
                headers: {
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

    return (
        <div>
            <h1>News</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input className="form-control my-3" type="text" placeholder="Titre" {...register('title')} />
                <div className="my-3">
                    <select defaultValue={"feature"} className="form-select" {...register('type')}>
                        <option value="">Type de news</option>
                        <option value="feature" >Nouvelle feature</option>
                        <option value="fix">Fix bugs</option>
                        <option value="various">Divers</option>
                    </select>
                </div>
                <textarea className="form-control" id="" cols={20} rows={5} placeholder="Contenu de la MAJ" {...register('content')}></textarea>
                <div className="text-end">
                    <input className="btn btn-warning my-3" type="submit" value="Envoyer" />
                </div>
            </form>
        </div>
    )
}

export default News;