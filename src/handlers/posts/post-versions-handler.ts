import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {PostService} from "../../services/post-service";
import {GetPostDto} from "../../dtos/get-post-dto";

@injectable()
export class PostVersionsHandler extends BaseHandler {
    constructor(
        private posts: PostService,
    ) {
        super();
    }

    async handle() {
        // TODO: update dto
        const post = await this.parsePathParameters(GetPostDto);

        return this.posts.versions(post.slug);
    }
}
