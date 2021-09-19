import {APIGatewayEvent} from "aws-lambda";
import {validate} from "class-validator";
import {EntityValidationError} from "../errors/validation-error";
import {plainToClass} from "class-transformer";
import {ClassConstructor} from "class-transformer/types/interfaces";
import {InvalidDataError} from "../errors/invalid-data-error";

export abstract class BaseHandler {
    protected event: APIGatewayEvent;

    abstract handle();

    setEvent(event: APIGatewayEvent) {
        this.event = event;
    }

    body(): any {
        if (!this.event.body) {
            return {};
        }

        return JSON.parse(this.event.body);
    }

    async parseQueryString<T>(dto: ClassConstructor<T extends Object ? T : never>) {
        return this.parse(this.event.queryStringParameters, dto);
    }

    async parsePathParameters<T>(dto: ClassConstructor<T extends Object ? T : never>) {
        return this.parse(this.event.pathParameters, dto);
    }

    async parseBody<T>(dto: ClassConstructor<T extends Object ? T : never>) {
        return this.parse(this.body(), dto);
    }

    private async parse<D, T>(data: D, validatorClass: ClassConstructor<T extends Object ? T : never>) {
        if (!data) {
            throw new InvalidDataError(data);
        }

        const entity = plainToClass(validatorClass, data);

        const errors = await validate(entity);
        if (errors.length > 0) {
            throw new EntityValidationError(errors);
        }

        return entity;
    }
}
