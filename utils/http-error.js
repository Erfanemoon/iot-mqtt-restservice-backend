class HttpError extends Error {
    constructor(message, error_code) {
        super(message);
        this.error_code = error_code;
    }
}

module.exports = HttpError;