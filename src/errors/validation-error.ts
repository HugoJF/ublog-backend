import {ValidationError} from "class-validator";

export class EntityValidationError extends Error {
    private errors: ValidationError[];

    constructor(errors: ValidationError[]) {
        super();
        this.errors = errors;
    }
}
