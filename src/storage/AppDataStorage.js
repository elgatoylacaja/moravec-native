export class AppDataStorage {
    constructor(backend) {
        this._backend = backend;
    }

    save(key, value) {
        return this._backend.setItem(`@moravec:${key}`, JSON.stringify(value));
    }

    fetch(key) {
        return new Promise((resolve) => {
            this._backend.getItem(`@moravec:${key}`).then((jsonData) => {
                if (jsonData !== null) {
                    return resolve(JSON.parse(jsonData));
                } else {
                    return resolve(null);
                }
            });
        });
    }

    exists(key) {
        return new Promise((resolve) => {
            this._backend.getItem(`@moravec:${key}`).then((value) => {
                return resolve(value !== null);
            })
        });
    }
}
