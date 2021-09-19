import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {TagService} from "../../services/tag-service";
import {TagPostDto} from "../../dtos/tag-post-dto";
import {ListPostTagsDto} from "../../dtos/list-post-tags-dto";
import {plainToClass} from "class-transformer";
import {Post} from "../../entities/post";
import {Tag} from "../../entities/tag";

@injectable()
export class ListTagsHandler extends BaseHandler {
    constructor(
        private tags: TagService,
    ) {
        super();
    }

    async handle() {
        const parameters = await this.parsePathParameters(ListPostTagsDto);

        const ids = await this.tags.listTags(parameters.slug);
        console.log({ids})
        const tags = await this.tags.get(ids);
        console.log({tags})
        return plainToClass(Tag, tags, {excludeExtraneousValues: true});
    }
}
