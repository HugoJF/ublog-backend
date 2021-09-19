import {injectable} from "tsyringe";
import {Post as PostDto} from "../entities/post";
import {collect} from 'collect.js';
import {ddb, Post, PostMeta, PostVersion} from "../dynamodb/models";

@injectable()
export class PostService {
    async index(pagination?: string) {
        return await Post.find({
            gsi1pk: 'post',
        }, {
            index: 'gsi1'
        });
    }

    async versions(slug: string) {
        const response = await PostVersion.find({
            slug: slug,
        })

        return {
            versions: collect(response).pluck('version').all()
        };
    }

    async get(slug: string, version = 0) {
        return await PostVersion.get({
            slug: slug,
            version: version
        });
    }

    async delete(slug: string) {
        const batch = {};

        const items = await ddb.queryItems({
            pk: `post:${slug}`,
        })

        collect(items).each(item => {
            ddb.deleteItem({
                pk: item['pk'],
                sk: item['sk'],
            }, {batch})
        }).toArray()


        await ddb.batchWrite(batch);

        return;
    }

    async rollBack(slug: string, version: number) {
        const post = await this.get(slug, version);

        return await Post.update(post);
    }

    async latestVersion(slug: string) {
        const meta = await PostMeta.get({
            slug: slug,
        })

        return meta?.last_version;
    }

    async put(post: PostDto) {
        const {slug} = post;

        // Check latest version
        const current = await this.latestVersion(slug);

        // If post does not exist, default to version 0 (next = 1)
        const next = (current ?? 0) + 1;

        const versionedPost: PostDto = {
            ...post,
            version: next,
        }

        // Put v0
        await Post.create({
            ...versionedPost,
        }, {
            exists: null,
        })

        // Create new version
        await PostVersion.create({
            ...versionedPost,
        }, {
            exists: null,
        })

        // Store metadata
        if (!current) {
            await PostMeta.create({
                slug: slug,
                last_version: next,
            }, {
                exists: null,
            })
        } else {
            await PostMeta.update({
                slug: slug,
            }, {
                add: {last_version: 1}
            })
        }

        return versionedPost;
    }
}
