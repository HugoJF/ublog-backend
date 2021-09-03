export class InvalidDataError extends Error {
    private data: any;

    constructor(data: any) {
        super();
        this.data = data;
    }
}
