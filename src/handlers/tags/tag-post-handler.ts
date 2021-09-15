import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {TagService} from "../../services/tag-service";
import {TagPostDto} from "../../dtos/tag-post-dto";

@injectable()
export class TagPostHandler extends BaseHandler {
    constructor(
        private tags: TagService,
    ) {
        super();
    }

    async handle() {
        const parameters = await this.parsePathParameters(TagPostDto);

        return this.tags.tagPost(parameters.post_slug, parameters.tag_slug);
    }
}
