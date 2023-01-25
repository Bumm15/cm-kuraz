import { BrowserRouter, Routes, Route } from "react-router-dom";

//bootstrap
import { Container } from "react-bootstrap";

//pages
import { Calender } from './Calender';

function App() {
  return (
    <Container className="mb-4">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Calender />}/>
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
