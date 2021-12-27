import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {TagService} from "../../services/tag-service";
import {ListPostTagsRequest} from "../../requests/list-post-tags-request";
import {plainToInstance} from "class-transformer";
import {Tag} from "../../entities/tag";

@injectable()
export class ListTagsHandler extends BaseHandler {
    constructor(
        private tags: TagService,
    ) {
        super();
    }

    async handle() {
        const parameters = await this.parsePathParameters(ListPostTagsRequest);

        const ids = await this.tags.listTags(parameters.slug);
        const tags = await this.tags.get(ids);

        return plainToInstance(Tag, tags, {excludeExtraneousValues: true});
    }
}
