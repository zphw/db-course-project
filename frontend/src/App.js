import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import FutureFlights from "./pages/FutureFlights"
import FlightStatus from "./pages/FlightStatus"

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route exact path='/future-flights' element={<FutureFlights/>} />
        <Route exact path='/flight-status' element={<FlightStatus/>} />
      </Routes>
    </Router>
  )
}

export default App;