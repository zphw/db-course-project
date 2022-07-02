import connection from "../index";

export const flights = async (airline: string, start: string, end: string) => {
    const [rows] = await connection.promise().query(
        "SELECT * FROM flight WHERE dep_datetime >= ? AND dep_datetime <= ? AND airline = ?",
        [start, end, airline]);

    return JSON.parse(JSON.stringify(rows));
};

export const flightRatings = async (airline: string, flight_num: number) => {
    const [rows] = await connection.promise().query(
        "SELECT stars, comment FROM rate JOIN ticket ON ticket_id = id WHERE airline_name = ? AND flight_num = ?",
        [airline, flight_num]);

    const all_comments = JSON.parse(JSON.stringify(rows));

    const [rows2] = await connection.promise().query(
        "SELECT AVG(stars) as avg FROM rate JOIN ticket ON ticket_id = id WHERE airline_name = ? AND flight_num = ?",
        [airline, flight_num]);

    const result2 = JSON.parse(JSON.stringify(rows2));

    return {
        all_comments,
        avg_stars: result2[0].avg || 0,
    };
};

export const frequentCustomers = async (airline: string) => {
    const [rows] = await connection.promise().query(
        "SELECT email, name, COUNT(*) as count FROM ticket JOIN customer USING (email) WHERE airline_name = ? GROUP BY email",
        [airline]);

    return JSON.parse(JSON.stringify(rows));
};

export const customersOnlyTakeACertainAirline = async (airline: string) => {
    const [rows] = await connection.promise().query(
        "SELECT email, name FROM ticket JOIN customer USING (email) WHERE NOT EXISTS (SELECT * FROM ticket WHERE airline_name <> ?) GROUP BY email",
        [airline]);

    return JSON.parse(JSON.stringify(rows));
};

export const ticketsSoldInterval = async (start: string, end: string, airline: string) => {
    const [rows] = await connection.promise().query(
        "SELECT YEAR(dep_datetime) as year, MONTH(dep_datetime) as month, COUNT(*) as count FROM ticket WHERE purchase_datetime >= ? AND purchase_datetime <= ? AND airline_name = ? GROUP BY YEAR(dep_datetime), MONTH(dep_datetime)",
        [start, end, airline]);

    return JSON.parse(JSON.stringify(rows));
};

export const ticketsSoldTotal = async (start: string, end: string, airline: string) => {
    const [rows] = await connection.promise().query(
        "SELECT COUNT(*) as count FROM ticket WHERE purchase_datetime >= ? AND purchase_datetime <= ? AND airline_name = ?",
        [start, end, airline]);

    const result = JSON.parse(JSON.stringify(rows));
    return result[0].count || 0;
};

export const revenueTotal = async (start: string, end: string, airline: string) => {
    const [rows] = await connection.promise().query(
        "SELECT SUM(sold_price) as amount FROM ticket WHERE purchase_datetime >= ? AND purchase_datetime <= ? AND airline_name = ?",
        [start, end, airline]);

    const result = JSON.parse(JSON.stringify(rows));
    return result[0].amount || 0;
};

export const allAirports = async () => {
    const [rows] = await connection.promise().query(
        "SELECT * FROM airport");

    return JSON.parse(JSON.stringify(rows));
};


export const allAirplanes = async (airline: string) => {
    const [rows] = await connection.promise().query(
        "SELECT * FROM airplane WHERE owner = ?",
        [airline]);

    return JSON.parse(JSON.stringify(rows));
};

export const flightCustomers = async (airline: string, flight_num: number) => {
    const [rows] = await connection.promise().query(
        "SELECT email, name FROM ticket JOIN customer USING (email) WHERE airline_name = ? AND flight_num = ?",
        [airline, flight_num]);

    return JSON.parse(JSON.stringify(rows));
};
