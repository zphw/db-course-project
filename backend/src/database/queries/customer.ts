import connection from '../';

export const customerFlights = async (email: string) => {
    const [rows] = await connection.promise().query(
        "SELECT * FROM customer_ticket INNER JOIN ticket ON (customer_ticket.ticket_id = ticket.id AND customer_ticket.email = ticket.email) WHERE customer_ticket.email = ?",
        [email]);

    return JSON.parse(JSON.stringify(rows));
};
