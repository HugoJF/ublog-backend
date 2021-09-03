import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {IndexPostDto} from "../../dtos/index-post-dto";
import {PostService} from "../../services/post-service";

@injectable()
export class PostIndexHandler extends BaseHandler {
    constructor(
        private posts: PostService,
    ) {
        super();
    }

    async handle() {
        const body = await this.parseQueryString(IndexPostDto);

        return this.posts.index(body?.pagination);
    }
}
