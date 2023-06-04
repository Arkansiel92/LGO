import { useContext } from "react";
import { AuthContext } from "../../context/auth";

interface props {
    index: number,
    col1?: string | number,
    col2?: string | number,
    col3?: string | number
    col4?: string | number
}

function Rank({ index, col1, col2, col3, col4 }: props) {
    return (
        <tr>
            <th scope="row">{index}</th>
            {
                typeof col1 !== "undefined" &&
                <td>{col1}</td>
            }
            {
                typeof col2 !== "undefined" &&
                <td>{col2}</td>
            }
            {
                typeof col3 !== "undefined" &&
                <td>{col3}</td>
            }
            {
                typeof col4 !== "undefined" &&
                <td>{col4}</td>
            }
        </tr>
    )
}

export default Rank;