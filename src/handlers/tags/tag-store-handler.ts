import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {Post} from "../../entities/post";
import {PostService} from "../../services/post-service";
import {CreateTagDto} from "../../dtos/create-tag-dto";
import {TagService} from "../../services/tag-service";
import {plainToClass} from "class-transformer";

@injectable()
export class TagStoreHandler extends BaseHandler {
    constructor(
        private tags: TagService,
    ) {
        super();
    }

    async handle() {
        const tag = await this.parseBody(CreateTagDto);

        return this.tags.put(tag);
    }
}
