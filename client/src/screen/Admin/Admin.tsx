import { useEffect, useContext, useState } from "react";
import Navbar from "../../component/Navbar/Navbar";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/auth";

interface newsForm {
    title: string,
    type: string,
    content: string,
    createdAt: Date
}

function Admin() {

    const [news, setNews] = useState(null);
    const auth = useContext(AuthContext);
    const { handleSubmit, register, formState: { errors } } = useForm<newsForm>();

    const onSubmit = (news: newsForm) => {
        if (news.title !== "" && news.content !== "" && news.type !== "") {
            // news.createdAt = new Date();

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
                        return res.json().then(data => {
                            if (data) setNews(null);
                        })
                    }
                })
                .catch(error => console.log(error));
        }
    }

    useEffect(() => {

    })

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="card box-shadow p-5 bg-dark">
                    <h2>Ajouter une news</h2>
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
                        <textarea className="form-control" id="" cols={30} rows={10} placeholder="Contenu de la MAJ" {...register('content')}></textarea>
                        <input className="btn btn-primary my-3" type="submit" value="Envoyer" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Admin;