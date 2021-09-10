import {injectable} from "tsyringe";
import {Post} from "../entities/post";
import {ddb} from "../dynamodb";
import {collect} from 'collect.js';
import {WriteRequests} from "aws-sdk/clients/dynamodb";

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

    async get(slug: string, version = 0) {
        const response = await ddb.get({
            TableName: 'posts',
            Key: {
                PK: slug,
                SK: `v${version}`,
            }
        }).promise();

        return response.Item;
    }

    async delete(slug: string) {
        // Fetch all items in Partition Key
        const sks = await ddb.query({
            TableName: 'posts',
            KeyConditionExpression: 'PK = :pk',
            ProjectionExpression: 'PK, SK',
            ExpressionAttributeValues: {
                ':pk': slug,
            },
        }).promise();

        // If nothing found, bail
        if (!sks.Items || sks.Items.length === 0) {
            return;
        }

        // Build the WriteRequests
        const requests: WriteRequests = sks.Items.map(item => {
            return {
                DeleteRequest: {
                    Key: {
                        PK: item['PK'],
                        SK: item['SK']
                    },
                }
            }
        })

        // Batch delete
        await ddb.batchWrite({
            RequestItems: {
                posts: requests
            }
        }).promise();

        return;
    }

    async rollBack(slug: string, version: number) {
        const post = await this.get(slug, version);

        // Update v0
        await ddb.put({
            TableName: 'posts',
            Item: {
                ...post,
                PK: slug,
                SK: 'v0',
                version: version,
            }
        }).promise()
    }

    async latestVersion(slug: string) {
        const meta = await ddb.get({
            TableName: 'posts',
            Key: {
                PK: slug,
                SK: 'meta',
            }
        }).promise()

        if (!meta.Item) {
            return null;
        }

        return meta.Item['version'];
    }

    async put(post: Post) {
        const {slug} = post;

        // Check latest version
        const current = await this.latestVersion(slug);

        // If post does not exist, default to version 0 (next = 1)
        const next = (current ?? 0) + 1;

        // Put v0
        await ddb.put({
            TableName: 'posts',
            Item: {
                PK: post.slug,
                SK: 'v0',
                version: next,
                ...post,
            }
        }).promise()

        // Create new version
        await ddb.put({
            TableName: 'posts',
            Item: {
                PK: post.slug,
                SK: `v${next}`,
                ...post,
            }
        }).promise()

        // Store metadata
        if (current === null) {
            await ddb.put({
                TableName: 'posts',
                Item: {
                    PK: slug,
                    SK: 'meta',
                    version: next,
                    created_at: (new Date).toISOString(),
                },
            }).promise()
        } else {
            await ddb.update({
                TableName: 'posts',
                Key: {
                    PK: slug,
                    SK: 'meta',
                },
                UpdateExpression: 'ADD version :inc',
                ExpressionAttributeValues: {
                    ':inc': 1,
                }
            }).promise()
        }

        return post;
    }
}
