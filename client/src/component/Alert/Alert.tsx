
interface alert {
    type: string,
    msg: string
}


function Alert({type, msg}: alert) {
    return (
        <div className={`alert alert-${type} text-center`} role="alert">
            {msg}
        </div>
    )
}

export default Alert;