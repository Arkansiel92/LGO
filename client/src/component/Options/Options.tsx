import "./Options.css";

interface props {
    roles: string[] | undefined
}

function Options({ roles }: props) {

    return (
        <div className="card bg-dark">
            <h1>Composition</h1>
            <div>
                {
                    roles?.length === 0
                        ? <p>Aucun rôle</p>
                        : <div>
                            {roles?.map((role) => (
                                <p>- {role}</p>
                            ))}
                        </div>
                }
            </div>
        </div>
    )
}

export default Options;