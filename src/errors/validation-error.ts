import {ValidationError} from "class-validator";
import {HttpError} from "./http-error";

export class EntityValidationError extends Error implements HttpError {
    errors: ValidationError[];

    httpCode = 400;

    constructor(errors: ValidationError[]) {
        super('Entity validation error');
        this.errors = errors;
    }

    toJson(): object {
        const entries = this.errors.map(validatorError => [
            validatorError.property,
            validatorError.constraints
        ])

        return Object.fromEntries(entries);
    }
}
