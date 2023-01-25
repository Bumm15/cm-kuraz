import { Button } from "react-bootstrap"

export function AkceRow({id, name, date, place, time, callback}) {
    return(
        <tr>
            <td>{name}</td>
            <td>{place}</td>
            <td>{date}</td>
            <td>{time}</td>
            <td>
                <div className="d-flex justify-content-center">
                    <Button onClick={() => callback(id)} size="sm" variant="danger">X</Button>
                </div>
                </td>
        </tr>
    )
}