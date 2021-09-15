import {DynamoDB} from "aws-sdk";
import env from './environments/environment';

export const tableName = 'ublog';

export const ddb = new DynamoDB.DocumentClient({
    region: env.region,
    endpoint: env.endpoint,
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
})
