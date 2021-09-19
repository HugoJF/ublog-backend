import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {TagService} from "../../services/tag-service";
import {ListPostTagsRequest} from "../../requests/list-post-tags-request";
import {plainToClass} from "class-transformer";
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
        console.log({ids})
        const tags = await this.tags.get(ids);
        console.log({tags})
        return plainToClass(Tag, tags, {excludeExtraneousValues: true});
    }
}
