import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {Post} from "../../entities/post";
import {PostService} from "../../services/post-service";
import {CreateTagDto} from "../../dtos/create-tag-dto";
import {TagService} from "../../services/tag-service";
import {plainToClass} from "class-transformer";
import {Tag} from "../../entities/tag";

@injectable()
export class TagIndexHandler extends BaseHandler {
    constructor(
        private tags: TagService,
    ) {
        super();
    }

    async handle() {
        const raw = this.tags.index();

        if (!raw) {
            return [];
        }

        return plainToClass(Tag, raw, {excludeExtraneousValues: true});
    }
}
