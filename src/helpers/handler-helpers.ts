import {BaseHandler} from "../handlers/base-handler";
import {container, InjectionToken} from "tsyringe";
import {APIGatewayEvent} from "aws-lambda";

export function generateHandler<T extends BaseHandler>(token: InjectionToken<T>) {
    return async (event: APIGatewayEvent) => {
        const handler = container.resolve(token);

        handler.setEvent(event);

        const result = await handler.handle();

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    }
}
