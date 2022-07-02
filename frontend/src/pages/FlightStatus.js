import React from 'react'
import { useState } from "react"
import axios from 'axios'

export default function FlightStatus() {
    const [refresh, setRefresh] = useState(0);
    const [airline, setAirline] = useState("");
    const [flight_num, setFlight_num] = useState(0);
    const [date, setDate] = useState("");
    const [flights, setFlights] = useState([])

    return(
        <>
        <div className="content">
        <form>
            <fieldset>
            <label>
                <p></p>
            </label>
            <input
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                required           
            />
            <label>
                <p>Flight number</p>
            </label>
            <input
                value={flight_num}
                onChange={(e) => setFlight_num(e.target.value)}
                required           
            />
            <label>
                <p>Departure/Arrival date</p>
            </label>
            <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required           
            />
            <button
                onClick={(e) => {
                    e.preventDefault();
                    axios
                    .post(
                    'https://localhost:3000/flight',
                    {
                        airline: airline,
                        flight_num: flight_num,
                        date: date,
                    }
                    )
                    .then((res) => {
                    console.log(res.data);
                    setFlights(Object.values(res.data));
                    setRefresh(refresh + 1);
                    })
                    .catch((error) => {
                    console.log('https://localhost:3000/search');
                    console.log(error);
                    });
                }}
                type="submit"
            >
                Submit
            </button>
            </fieldset>
        </form>
        <div>
            {flights}
        </div>
        </div> 
        </>
    )
}