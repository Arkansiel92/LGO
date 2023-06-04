import { useForm } from "react-hook-form";

interface challenge {
    title: number,
    description: string
}

function Challenges() {

    const { handleSubmit, register, formState: { errors } } = useForm<challenge>();

    const onSubmit = (data: challenge) => {
        
    }

    return (
        <div>
            <h1>Challenges</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                
            </form>
        </div>
    )
}

export default Challenges;