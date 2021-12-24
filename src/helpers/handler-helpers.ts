import {BaseHandler} from "../handlers/base-handler";
import {container, InjectionToken} from "tsyringe";
import {APIGatewayEvent} from "aws-lambda";
import {EntityValidationError} from "../errors/validation-error";
import {PostGetHandler} from "../handlers/posts/post-get-handler";
import {PostVersionsHandler} from "../handlers/posts/post-versions-handler";
import {PostDeleteHandler} from "../handlers/posts/post-delete-handler";
import {TagStoreHandler} from "../handlers/tags/tag-store-handler";
import {PostStoreHandler} from "../handlers/posts/post-store-handler";
import {UntagPostHandler} from "../handlers/tags/untag-post-handler";
import {ListTagsHandler} from "../handlers/tags/list-tags-handler";
import {PostIndexHandler} from "../handlers/posts/post-index-handler";
import {TagIndexHandler} from "../handlers/tags/tag-index-handler";
import {TagPostHandler} from "../handlers/tags/tag-post-handler";

export const tokenMapping: Record<string, InjectionToken> = {
    postGet: PostGetHandler,
    postIndex: PostIndexHandler,
    postStore: PostStoreHandler,
    postVersions: PostVersionsHandler,
    postDelete: PostDeleteHandler,
    tagIndex: TagIndexHandler,
    tagStore: TagStoreHandler,
    tagTag: TagPostHandler,
    tagUntag: UntagPostHandler,
    tagList: ListTagsHandler,
}

function handleError(e) {
    if ('httpCode' in e && 'toJson' in e) {
        const response = e.toJson();

        return {
            statusCode: e.httpCode,
            body: JSON.stringify(response),
        }
    }

    return {
        statusCode: 500,
        body: e.message,
    }
}

export async function handleResolver<T extends BaseHandler>(id: string, event: APIGatewayEvent) {
    const token = tokenMapping[id];
    const handler = container.resolve(token);

    handler.setEvent(event);

    try {
        const result = await handler.handle();

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    } catch (e) {
        console.log('erroreeeee')
        console.log(e instanceof EntityValidationError)
        console.error(e);

        return handleError(e);
    }
}
