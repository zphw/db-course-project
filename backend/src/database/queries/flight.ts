import connection from '../';

const findAirportCode = async (airport: string) => {
    const [rows] = await connection.promise().query(
        'SELECT code FROM airport WHERE UPPER(city) = UPPER(?) OR UPPER(code) = UPPER(?)',
        [airport, airport]);

    const result = JSON.parse(JSON.stringify(rows));
    if (result.length > 0) {
        return result[0].code;
    } else {
        return null;
    }
};

export const searchFlight = async (dep: string, arr: string, date: string) => {
    const dep_airport = await findAirportCode(dep);
    const arr_airport = await findAirportCode(arr);

    if (dep_airport && arr_airport) {
        const [rows] = await connection.promise().query(
            "SELECT * FROM flight WHERE DATE(`dep_datetime`) = ? AND dep_airport = ? AND arr_airport = ?",
            [date, dep_airport, arr_airport]);

        return JSON.parse(JSON.stringify(rows));
    } else {
        return [];
    }
};

export const findFlight = async (airline: string, flightNum: number, date: string) => {
    const [rows] = await connection.promise().query(
        "SELECT * FROM flight WHERE airline = ? AND flight_num = ? AND (DATE(`dep_datetime`) = ? OR DATE(`arr_datetime`) = ?)",
        [airline, flightNum, date, date]);

    return JSON.parse(JSON.stringify(rows));
};
