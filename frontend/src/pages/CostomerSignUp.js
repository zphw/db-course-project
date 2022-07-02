import React, { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [refresh, setRefresh] = useState(0);
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [address_2, setAddress_2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [passport_num, setPassport_num] = useState("");
  const [passport_exp, setPassport_exp] = useState("");
  const [passport_country, setPassport_country] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleCreateUser = () => {
    axios
      .post('http://localhost:3000/auth/customer/register',
      {
        email,
        name,
        password,
        address,
        address_2,
        city,
        state,
        passport_num,
        passport_exp,
        passport_country,
        birthday
      })
      .then(() => {
        setRefresh(refresh + 1);
        setIsUserCreated(true);
      })
      .catch((error) => {
        console.log('http://localhost:3000/auth/customer/register');
        console.log(error);
      });
  };

  return (
    <>
      <div>
        {isUserCreated && <p>The user was created</p>}
        <br></br>
        <br></br>
        <br></br>
      </div>
      <form>
            <fieldset>
            <label>
                <p>Name</p>
            </label>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required           
            />
            <label>
                <p>Email</p>
            </label>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required           
            />
            <label>
                <p>Password</p>
            </label>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required           
            />
            <label>
                <p>Address</p>
            </label>
            <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required           
            />
            <label>
                <p>Address_2</p>
            </label>
            <input
                value={address_2}
                onChange={(e) => setAddress_2(e.target.value)}
                required           
            />
            <label>
                <p>City</p>
            </label>
            <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required           
            />
            <label>
                <p>State</p>
            </label>
            <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                required           
            />
            <label>
                <p>Passport Number</p>
            </label>
            <input
                value={passport_num}
                onChange={(e) => setPassport_num(e.target.value)}
                required           
            />
            <label>
                <p>Passport Expiration Date</p>
            </label>
            <input
                value={passport_exp}
                onChange={(e) => setPassport_exp(e.target.value)}
                required           
            />
            <label>
                <p>Passport country</p>
            </label>
            <input
                value={passport_country}
                onChange={(e) => setPassport_country(e.target.value)}
                required           
            />
            <label>
                <p>Birthday</p>
            </label>
            <input
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required           
            />
            <button
                onClick={(e) => {
                    e.preventDefault();
                    handleCreateUser();
                }}
                type="submit"
            >
                Submit
            </button>
            </fieldset>
        </form>

    </>
  );
}