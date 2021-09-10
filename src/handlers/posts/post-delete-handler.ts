import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {GetPostDto} from "../../dtos/get-post-dto";
import {PostService} from "../../services/post-service";

@injectable()
export class PostDeleteHandler extends BaseHandler {
    constructor(
        private posts: PostService,
    ) {
        super();
    }

    async handle() {
        const parameters = await this.parsePathParameters(GetPostDto);

        if (!parameters) {
            throw new Error();
        }

        return this.posts.delete(parameters.slug);
    }
}
