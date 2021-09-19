import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {TagService} from "../../services/tag-service";
import {Tag} from "../../entities/tag";

@injectable()
export class TagStoreHandler extends BaseHandler {
    constructor(
        private tags: TagService,
    ) {
        super();
    }

    async handle() {
        const tag = await this.parseBody(Tag);

        return this.tags.put(tag);
    }
}
