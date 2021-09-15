import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {TagService} from "../../services/tag-service";
import {TagPostDto} from "../../dtos/tag-post-dto";
import {ListPostTagsDto} from "../../dtos/list-post-tags-dto";

@injectable()
export class ListTagsHandler extends BaseHandler {
    constructor(
        private tags: TagService,
    ) {
        super();
    }

    async handle() {
        const parameters = await this.parsePathParameters(ListPostTagsDto);

        return this.tags.listTags(parameters.slug);
    }
}
