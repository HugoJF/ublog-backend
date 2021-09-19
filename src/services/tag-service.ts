import {injectable} from "tsyringe";
import {Tag} from "../entities/tag";
import collect from 'collect.js';
import {client} from "../dynamodb/models";

@injectable()
export class TagService {
    async get(ids: string | string[]) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        // Build the WriteRequests
        const keys = ids.map(item => {
            return {
                PK: `TAG#${item}`,
                SK: 'TAG',
            }
        })

        if (keys.length === 0) {
            return [];
        }

        const tags = await client.batchGet({
            RequestItems: {
                ['ublog']: {
                    Keys: keys
                },
            }
        }).promise();

        return tags.Responses?.['ublog'];
    }

    async index() {
        const query = await client.query({
            TableName: 'ublog',
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :pk',
            ExpressionAttributeValues: {
                ':pk': 'TAG',
            }
        }).promise();

        return query.Items;
    }

    async put(tag: Tag) {
        // Create new version
        await client.put({
            TableName: 'ublog',
            Item: {
                PK: `TAG#${tag.slug}`,
                SK: 'TAG',
                GSI1PK: 'TAG',
                GSI1SK: `TAG#${tag.slug}`,
                ...tag,
            }
        }).promise()

        return tag;
    }

    async tagPost(postSlug: string, tagSlug: string) {
        await client.put({
            TableName: 'ublog',
            Item: {
                PK: `TAG#${postSlug}`,
                SK: `TAG`,
                GSI1PK: `TAG`,
                GSI1SK: `TAG#${postSlug}`,
            }
        }).promise()
    }

    async listTags(slug: string): Promise<string[]> {
        const raw = await client.query({
            TableName: 'ublog',
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': slug,
                ':sk': 'TAG#',
            }
        }).promise()

        const ids = collect(raw.Items)
            .map(item => item['SK'])
            .map((sk: string) => sk.substr(4));

        return ids.toArray()
    }
}
