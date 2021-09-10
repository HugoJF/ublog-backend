import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {GetPostDto} from "../../dtos/get-post-dto";
import {PostService} from "../../services/post-service";

@injectable()
export class PostGetHandler extends BaseHandler {
    constructor(
        private posts: PostService,
    ) {
        super();
    }

    async handle() {
        const pathParameters = await this.parsePathParameters(GetPostDto);

        if (!pathParameters) {
            throw new Error();
        }

        return this.posts.get(pathParameters.slug, pathParameters.version);
    }
}
