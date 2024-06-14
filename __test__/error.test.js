import { errorHandler } from '../Middlewares/error.js'

describe('errorHandler', () => {
    it('should create an error with the correct statusCode and message', () => {
        const statusCode = 404;
        const message = 'Not Found';
        const error = errorHandler(statusCode, message);

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(statusCode);
        expect(error.message).toBe(message);
    });

    it('should create an error with a different statusCode and message', () => {
        const statusCode = 500;
        const message = 'Internal Server Error';
        const error = errorHandler(statusCode, message);

        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(statusCode);
        expect(error.message).toBe(message);
    });
});
