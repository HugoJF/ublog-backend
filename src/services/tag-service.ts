import {injectable} from "tsyringe";
import {ddb, tableName} from "../dynamodb";
import {Tag} from "../entities/tag";
import collect from 'collect.js';

@injectable()
export class TagService {
    async index() {
        const query = await ddb.query({
            TableName: tableName,
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
        await ddb.put({
            TableName: tableName,
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
        await ddb.put({
            TableName: tableName,
            Item: {
                PK: postSlug,
                SK: `TAG#${tagSlug}`,
                GSI1PK: `TAG#${tagSlug}`,
                GSI1SK: postSlug,
            }
        }).promise()
    }

    async listTags(slug: string) {
        const raw = await ddb.query({
            TableName: tableName,
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
