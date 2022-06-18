import connection from '../';

export const customerFlights = async (email: string) => {
    const [rows] = await connection.promise().query(
        "SELECT * FROM customer_ticket INNER JOIN ticket ON (customer_ticket.ticket_id = ticket.id AND customer_ticket.email = ticket.email) WHERE customer_ticket.email = ?",
        [email]);

    return JSON.parse(JSON.stringify(rows));
};

export const spendingTotal = async (user: string, start: string, end: string) => {
    const [rows] = await connection.promise().query(
        "SELECT SUM(sold_price) as amount FROM ticket WHERE dep_datetime >= ? AND dep_datetime <= ? AND email = ?",
        [start, end, user]);

    const result = JSON.parse(JSON.stringify(rows));

    return result[0].amount || 0;
};

export const spendingInterval = async (user: string, start: string, end: string) => {
    const [rows] = await connection.promise().query(
        "SELECT YEAR(dep_datetime) as year, MONTH(dep_datetime) as month, SUM(sold_price) as amount FROM ticket WHERE dep_datetime >= ? AND dep_datetime <= ? AND email = ? GROUP BY YEAR(dep_datetime), MONTH(dep_datetime)",
        [start, end, user]);

    return JSON.parse(JSON.stringify(rows));
};
