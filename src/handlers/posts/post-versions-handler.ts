import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {PostService} from "../../services/post-service";
import {GetPostRequest} from "../../requests/get-post-request";

@injectable()
export class PostVersionsHandler extends BaseHandler {
    constructor(
        private posts: PostService,
    ) {
        super();
    }

    async handle() {
        // TODO: update dto
        const post = await this.parsePathParameters(GetPostRequest);

        return this.posts.versions(post.slug);
    }
}
