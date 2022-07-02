import React from 'react'
import { useState, useEffect } from "react"
import axios from 'axios'

export default function FutureFlights() {
    const [refresh, setRefresh] = useState(0);
    const [dep, setDep] = useState("");
    const [arr, setArr] = useState("");
    const [date, setDate] = useState("");
    const [flights, setFlights] = useState([])

    return(
        <>
        <div className="content">
        <form>
            <fieldset>
            <label>
                <p>Departure airport</p>
            </label>
            <input
                value={dep}
                onChange={(e) => setDep(e.target.value)}
                required           
            />
            <label>
                <p>Arrival airport</p>
            </label>
            <input
                value={arr}
                onChange={(e) => setArr(e.target.value)}
                required           
            />
            <label>
                <p>Departure date</p>
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
                    'http://localhost:3000/search',
                    {
                        dep: dep,
                        arr: arr,
                        date: date,
                    }, {headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }}
                    )
                    .then((res) => {
                    console.log(res.data);
                    setFlights(Object.values(res.data));
                    setRefresh(refresh + 1);
                    })
                    .catch((error) => {
                    console.log('http://localhost:3000/search');
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