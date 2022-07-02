import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    let navigate = useNavigate();
    return(
        <>
        <div className="content">
            <button onClick={() => navigate('/future-flights', {replace:true})}>
                Search for future flights
            </button>
            <button onClick={() => navigate('/flight-status', {replace:true})}>
                Check flight status
            </button>
            <button onClick={() => navigate('/sign-up', {replace:true})}>
                Sign up
            </button>
            <button onClick={() => navigate('/log-in', {replace:true})}>
                Log in
            </button>
        </div> 
        </>
    )
}