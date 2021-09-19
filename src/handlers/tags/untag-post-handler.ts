import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {TagService} from "../../services/tag-service";
import {TagPostRequest} from "../../requests/tag-post-request";

@injectable()
export class UntagPostHandler extends BaseHandler {
    constructor(
        private tags: TagService,
    ) {
        super();
    }

    async handle() {
        const parameters = await this.parsePathParameters(TagPostRequest);

        return this.tags.untagPost(parameters.post_slug, parameters.tag_slug);
    }
}
