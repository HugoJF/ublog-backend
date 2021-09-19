import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {IndexPostRequest} from "../../requests/index-post-request";
import {PostService} from "../../services/post-service";
import {plainToClass} from "class-transformer";
import {Post} from "../../entities/post";

@injectable()
export class PostIndexHandler extends BaseHandler {
    constructor(
        private posts: PostService,
    ) {
        super();
    }

    async handle() {
        const body = await this.parseQueryString(IndexPostRequest).catch(e => null);

        const raw = await this.posts.index(body?.pagination);

        if (!raw) {
            return [];
        }

        return plainToClass(Post, raw, {excludeExtraneousValues: true});
    }
}
