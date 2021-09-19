import {injectable} from "tsyringe";
import collect from 'collect.js';
import {Tag as TagEntity} from "../entities/tag";
import {ddb, PostTag, Tag} from "../dynamodb/models";

@injectable()
export class TagService {
    async get(ids: string | string[]) {
        const batch = {};

        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        // Build the WriteRequests
        ids.forEach(id => {
            Tag.get({
                slug: id,
            }, {batch})
        })

        const response = await ddb.batchGet(batch);

        return response['Responses'].ublog;
    }

    async index() {
        return Tag.find({
            gsi1pk: 'tag',
        }, {
            index: 'gsi1',
        })
    }

    async put(tag: TagEntity) {
        return await Tag.create(tag, {exists: null});
    }

    async tagPost(postSlug: string, tagSlug: string) {
        return await PostTag.create({
            post_slug: postSlug,
            tag_slug: tagSlug,
        })
    }

    async listTags(slug: string): Promise<string[]> {
        const raw = await PostTag.find({
            post_slug: slug,
        })

        const ids = collect(raw)
            .map(item => item['tag_slug']);

        return ids.toArray()
    }
}
