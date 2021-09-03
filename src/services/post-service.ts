import {injectable} from "tsyringe";
import {Post} from "../entities/post";
import {ddb} from "../dynamodb";

@injectable()
export class PostService {
    async index(pagination?: string) {
        const baseParams = {
            TableName: 'posts',
            Limit: 5,
        };
        const paginationParams = {
            ExclusiveStartKey: {
                slug: pagination,
            }
        }

        const response = await ddb.scan({
            ...baseParams,
            ...(pagination ? paginationParams : {})
        }).promise();

        return response.Items;
    }

    async get(slug: string) {
        return await ddb.get({
            TableName: 'posts',
            Key: {slug}
        }).promise()
    }

    async put(post: Post) {
        await ddb.put({
            TableName: 'posts',
            Item: post,
        }).promise()

        return post;
    }
}
