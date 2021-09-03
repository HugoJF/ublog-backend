import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {Post} from "../../entities/post";
import {PostService} from "../../services/post-service";

@injectable()
export class PostStoreHandler extends BaseHandler {
    constructor(
        private posts: PostService,
    ) {
        super();
    }

    async handle() {
        const post = await this.parseBody(Post);

        return this.posts.put(post);
    }
}
