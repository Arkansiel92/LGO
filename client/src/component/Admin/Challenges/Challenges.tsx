import { useForm } from "react-hook-form";


function Challenges() {

    const { handleSubmit, register, formState: { errors } } = useForm();

    return (
        <div>
            <h1>Challenges</h1>
        </div>
    )
}

export default Challenges;