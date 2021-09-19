import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {GetPostRequest} from "../../requests/get-post-request";
import {PostService} from "../../services/post-service";
import {plainToClass} from "class-transformer";
import {Post} from "../../entities/post";

@injectable()
export class PostGetHandler extends BaseHandler {
    constructor(
        private posts: PostService,
    ) {
        super();
    }

    async handle() {
        const pathParameters = await this.parsePathParameters(GetPostRequest);

        if (!pathParameters) {
            throw new Error();
        }

        const raw = await this.posts.get(pathParameters.slug, pathParameters.version);

        return plainToClass(Post, raw, {excludeExtraneousValues: true});
    }
}
