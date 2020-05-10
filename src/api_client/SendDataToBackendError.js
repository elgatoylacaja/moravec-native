// A SendDataToBackendError is any kind of error occurring while sending data to Moravec's backend server.
export class SendDataToBackendError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}