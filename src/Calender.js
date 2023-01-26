import { useEffect, useRef, useState } from "react"
import { Alert, Form, Table, Card, Button } from "react-bootstrap"
import { AkceRow } from "./AkceRow";
import { db } from "./firebase-config";
import { uid } from "uid";
import { onValue, ref, remove, set } from "firebase/database";


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
    const requestData = () => {
        setError(false)
        setLoading(true)
        try {
            onValue(ref(db), snapshot => {
                const data = snapshot.val()
                if(data !== null){
                    setData(Object.values(data))
                }
            })
        } catch (error) {
            setError(true)
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        requestData()
    }, [])

    //adding data to json
    const writeToDatabase = (e) => {
        e.preventDefault();
        setSuccess(false)
        setErrMsg(false)
        const uuid = uid()

        var betterDate = dateRef.current.value.split("-").reverse().join(".");

        const formData = {
            id: uuid,
            name: nameRef.current.value,
            place: placeRef.current.value,
            date: betterDate,
            time: timeRef.current.value
        }
        console.log(formData)
        try {
            set(ref(db, `/${uuid}`), formData)
        } catch(err) {
            console.log(err)
            setErrMsg(true)
        }
        setSuccess(true)

        nameRef.current.value = ""
        placeRef.current.value = ""
        dateRef.current.value = ""
        timeRef.current.value = ""

    }

    //CIMBÁLKA JE NEJLEPŠÍ <333333

    //update json file with fetch.. meh :(
    const removeFromAkceByName = (id) => {
        setSendingData(true)
        setError(false)
        try {
            remove(ref(db, `/${id}`))
            setSendingData(false)
        } catch (error) {
            console.log(error)
            setError(true)
        }
        requestData()

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

            {loading ? 
                <p>Načítání dat</p>
            :
                <p className="text-muted "><small>Po kliknutí na odstranit, restartuj stránku pro zobrazení změn, z nějakého neznámeho důvodu to nědělá samo</small></p>}
            <br />
            <div className="d-flex mx-auto col-md-6 mb-4">
            <Card style={{width: "50rem"}}>
            {success &&
            <Alert variant="success">Povedlo se!</Alert>}

            {errMsg &&
            <Alert variant="danger">Akce se nepodařila přidat</Alert>}
            <Card.Body>
                <h2 className="text-center">Přidání akce:</h2>
                <Form onSubmit={writeToDatabase}>
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
