import { useEffect, useRef, useState } from "react"
import { Alert, Form, Table, Card, Button } from "react-bootstrap"
import { AkceRow } from "./AkceRow";


export function Calender() {

    //get json data
    const [data, setData] = useState([]); 
    const [error, setError] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sendingData, setSendingData] = useState(false);
    const [success, setSuccess] = useState(false);

    //form refs
    const nameRef = useRef();
    const placeRef = useRef();
    const dateRef = useRef();
    const timeRef = useRef();

    //request data
    function requestData() {
        setError(false)
        setLoading(true)

        fetch("https://api.jsonbin.io/v3/b/63d12c11ace6f33a22c7b8de?meta=false", {
            headers: {
                "X-Master-Key": "$2b$10$VmBbxTWqGDqdozGe6KXpfOyD9IWAA77BaVXjHIIrDBQ9jbBl.6x5G"
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data["akce"])
            setData(data["akce"].sort((a, b) => new Date(b.date) - new Date(a.date)))
            setLoading(false)
        })
        .catch(error => {
            setError(true)
            console.log(error)
            setLoading(false)
        })
    }

    useEffect(() => {
        requestData()
    }, [])

    //adding data to json
    function addData(e) {
        e.preventDefault();
        setErrMsg(false);
        setSuccess(false)
        //preventing multiple requests by disabling button
        setSendingData(true);

        var betterDate = dateRef.current.value.split("-").reverse().join(".");

        const formData = {
            name: nameRef.current.value,
            place: placeRef.current.value,
            date: betterDate,
            time: timeRef.current.value
        }

        console.log(JSON.stringify(formData))

        //post data
        fetch("https://api.jsonbin.io/v3/b/63d12c11ace6f33a22c7b8de?meta=false", {
            method: "POST",
            headers: {'Content-Type': 'application/json',
            "X-Master-Key": "$2b$10$VmBbxTWqGDqdozGe6KXpfOyD9IWAA77BaVXjHIIrDBQ9jbBl.6x5G"},
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            setSendingData(false)
            setSuccess(true)
            requestData()
        })
        .catch(error =>
            {
                console.log(error)
                setError(true)
            })

    }

    //update json file with fetch.. meh :(
    const removeFromAkceByName = (id) => {
        setError(false)

        // set data to the new json
        setData(data.filter(item => item.id !== id))
        console.log(data)
        
        fetch("https://my-json-server.typicode.com/Bumm15/cm-kuraz/akce/"+id, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(res => console.log(res))
    }
    
    return(
        <>
            <br></br>
            <h1 className="d-flex justify-content-center">Kalendář Akcí:</h1>
            {error &&
            <Alert variant="danger">
            <Alert.Heading>Chybička se vloudila...</Alert.Heading>
            <p>Zkus restartovat stránku a zkus to znovu </p>
            <p>pokud se bude problém vyskytovat i nadále, kontaktuj mě</p>
          </Alert>}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Název</th>
                        <th>Místo</th>
                        <th>Datum</th>
                        <th>Čas</th>
                        <th width="2rem">Odstranit</th>
                    </tr>
                </thead>
                <tbody>
                
                {data.map((akce, index) => (<AkceRow key={index} {...akce} callback={removeFromAkceByName}/>))}
                </tbody>
            </Table>
            {loading &&
                <p>Načítání dat</p>}
            <br />
            <div className="d-flex mx-auto col-md-6 mb-4">
            <Card style={{width: "50rem"}}>
            {success &&
            <Alert variant="success">Povedlo se!</Alert>}

            {errMsg &&
            <Alert variant="danger">Akce se nepodařila přidat</Alert>}
            <Card.Body>
                <h2 className="text-center">Přidání akce:</h2>
                <Form onSubmit={addData}>
                    <Form.Group id="name">
                        <Form.Label>Název</Form.Label>
                        <Form.Control type="text" ref={nameRef}  placeholder="Zadej název.." required />
                    </Form.Group>
                    <Form.Group id="place">
                        <Form.Label>Místo</Form.Label>
                        <Form.Control type="text" ref={placeRef} placeholder="Zadej místo.." required />
                    </Form.Group>
                    <Form.Group id="date">
                        <Form.Label>Datum</Form.Label>
                        <Form.Control type="date" ref={dateRef} placeholder="Zadej datum.." required />
                    </Form.Group>
                    <Form.Group id="time">
                        <Form.Label>Čas</Form.Label>
                        <Form.Control type="time" ref={timeRef} placeholder="Zadej čas.." required />
                    </Form.Group>
                    <Button disabled={sendingData} className="w-100 mt-4" type="submit">Přidat akci</Button>
                </Form>
            </Card.Body>
         </Card>
         
            </div>
        </>
    )
}