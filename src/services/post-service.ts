import {injectable} from "tsyringe";
import {Post as PostDto} from "../entities/post";
import {collect} from 'collect.js';
import {WriteRequest, WriteRequests} from "aws-sdk/clients/dynamodb";
import {client, Post, PostVersion} from "../dynamodb/models";


@injectable()
export class PostService {
    async index(pagination?: string) {
        const baseParams = {
            TableName: 'ublog',
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'POST',
            },
            Limit: 5,
        };
        const paginationParams = {
            ExclusiveStartKey: {
                slug: pagination,
            }
        }

        const response = await client.query({
            ...baseParams,
            ...(pagination && paginationParams),
        }).promise();

        return response.Items;
    }

    async versions(slug: string) {
        const response = await client.query({
            TableName: 'ublog',
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :v)',
            ProjectionExpression: 'SK',
            ExpressionAttributeValues: {
                ':pk': slug,
                ':v': 'v',
            },
        }).promise()

        const items = collect(response.Items)
            .pluck('SK')
            .except(['v0'])
            .map((i: string) => i.replace('v', ''));

        return {
            versions: items.all()
        };
    }

    async get(slug: string, version = 0) {
        return await PostVersion.get({
            slug: slug,
            version: version
        });
    }

    async delete(slug: string) {
        // Fetch all items in Partition Key
        const sks = await client.query({
            TableName: 'ublog',
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
            const req: WriteRequest = {
                DeleteRequest: {
                    Key: {
                        PK: item['PK'],
                        SK: item['SK']
                    },
                }
            }
            return req;
        })

        // Batch delete
        await client.batchWrite({
            RequestItems: {
                ['ublog']: requests
            }
        }).promise();

        return;
    }

    async rollBack(slug: string, version: number) {
        const post = await this.get(slug, version);

        // Update v0
        // await client.put({
        //     TableName: 'ublog',
        //     Item: {
        //         // ...post,
        //         PK: slug,
        //         SK: 'v0',
        //         version: version,
        //     }
        // }).promise()
    }

    async latestVersion(slug: string) {
        const meta = await client.get({
            TableName: 'ublog',
            Key: {
                pk: slug,
                sk: 'meta',
            }
        }).promise()

        if (!meta.Item) {
            return null;
        }

        return meta.Item['version'];
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
            abstract: 'asd',
            public: true,
        })

        // Create new version
        await PostVersion.create({
            ...versionedPost,
            abstract: 'asd',
            public: true,
        })

        // Store metadata
        if (current === null) {
            await client.put({
                TableName: 'ublog',
                Item: {
                    pk: slug,
                    sk: 'meta',
                    version: next,
                    created_at: (new Date).toISOString(),
                },
            }).promise()
        } else {
            await client.update({
                TableName: 'ublog',
                Key: {
                    pk: slug,
                    sk: 'meta',
                },
                UpdateExpression: 'ADD version :inc',
                ExpressionAttributeValues: {
                    ':inc': 1,
                }
            }).promise()
        }

        return versionedPost;
    }
}
