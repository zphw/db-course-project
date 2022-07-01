export {};

declare global {
    namespace Express {
        interface Request {
            user?: string;
            airline?: string;
        }
    }
}
