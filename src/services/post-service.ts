import {injectable} from "tsyringe";
import {Post} from "../entities/post";
import {ddb} from "../dynamodb";
import {collect} from 'collect.js';

@injectable()
export class PostService {
    async index(pagination?: string) {
        const baseParams = {
            TableName: 'posts',
            FilterExpression: 'SK = :v',
            ExpressionAttributeValues: {
                ':v': 'v0',
            },
            Limit: 5,
        };
        const paginationParams = {
            ExclusiveStartKey: {
                slug: pagination,
            }
        }

        const response = await ddb.scan({
            ...baseParams,
            ...(pagination && paginationParams)
        }).promise();

        return response.Items;
    }

    async versions(slug: string) {
        const response = await ddb.query({
            TableName: 'posts',
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :v)',
            ProjectionExpression: 'SK',
            ExpressionAttributeValues: {
                ':pk': slug,
                ':v': 'v',
            },
        }).promise()

        const items = collect(response.Items).pluck('SK').except(['v0']);

        return {
            versions: items.all()
        };
    }

    async get(slug: string) {
        const response = await ddb.get({
            TableName: 'posts',
            Key: {
                PK: slug,
                SK: 'v0',
            }
        }).promise();

        return response.Item;
    }

    async put(post: Post) {
        const {slug} = post;

        // check latest version
        const v0 = await ddb.get({
            TableName: 'posts', Key: {
                PK: slug,
                SK: 'v0',
            }
        }).promise()

        // if v0 does not exist, default to version 0 (next = 1)
        const current = v0.Item?.version ?? 0;
        const next = current + 1;

        // put v0
        await ddb.put({
            TableName: 'posts',
            Item: {
                PK: post.slug,
                SK: 'v0',
                version: next,
                ...post,
            }
        }).promise()

        // store vx
        await ddb.put({
            TableName: 'posts',
            Item: {
                PK: post.slug,
                SK: `v${next}`,
                ...post,
            }
        }).promise()

        // store metadataserv
        if (current === 0) {
            await ddb.put({
                TableName: 'posts',
                Item: {
                    PK: post.slug,
                    SK: 'meta',
                    created_at: (new Date).toISOString(),
                },
            }).promise()
        }

        return post;
    }
}
