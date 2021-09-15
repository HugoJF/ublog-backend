import {injectable} from "tsyringe";
import {ddb} from "../dynamodb";
import {Tag} from "../entities/tag";

@injectable()
export class TagService {
    async index() {
        const query = await ddb.query({
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
        await ddb.put({
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
}
