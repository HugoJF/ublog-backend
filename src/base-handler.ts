import {APIGatewayEvent} from "aws-lambda";
import {validate} from "class-validator";
import {EntityValidationError} from "./errors/validation-error";
import {plainToClass} from "class-transformer";
import {ClassConstructor} from "class-transformer/types/interfaces";

export abstract class BaseHandler {
    protected event: APIGatewayEvent;

    abstract handle();

    setEvent(event: APIGatewayEvent) {
        this.event = event;
    }

    body(): { [id: string]: unknown } {
        if (!this.event.body) {
            return {};
        }

        return JSON.parse(this.event.body);
    }


    async validateQueryString<T>(validatorClass: ClassConstructor<T extends Object ? T : never>) {
        if (!this.event.queryStringParameters) {
            return null;
        }

        const entity = plainToClass(validatorClass, this.event.queryStringParameters);

        const errors = await validate(entity);
        if (errors.length > 0) {
            throw new EntityValidationError(errors);
        }

        return entity;
    }


    async validatePathParameters<T>(validatorClass: ClassConstructor<T extends Object ? T : never>) {
        if (!this.event.pathParameters) {
            return null;
        }

        const entity = plainToClass(validatorClass, this.event.pathParameters);

        const errors = await validate(entity);
        if (errors.length > 0) {
            throw new EntityValidationError(errors);
        }

        return entity;
    }

    async validateBody<T>(validatorClass: ClassConstructor<T extends Object ? T : never>) {
        const entity = plainToClass(validatorClass, this.body());

        const errors = await validate(entity);
        if (errors.length > 0) {
            throw new EntityValidationError(errors);
        }

        return entity;
    }

    async entityFromBody<T>(dto: ClassConstructor<T extends Object ? T : never>) {
        const entity = plainToClass(dto, this.body());

        const errors = await validate(entity);
        if (errors.length > 0) {
            throw new EntityValidationError(errors);
        }

        return entity;
    }
}
