export default class CustomError extends Error {
    constructor(type, message = '') {
        super(message);
        this.type = type;
    }
}