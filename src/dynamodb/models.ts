import {Entity, OneSchema, Table} from 'dynamodb-onetable'
import {DynamoDB} from "aws-sdk";
import env from '../environments/environment';
import {TagSchema} from "./schemas/tag";
import {PostVersionSchema} from "./schemas/post-version";
import {PostTagSchema} from "./schemas/post-tag";
import {PostSchema} from "./schemas/post";
import {ImageSchema} from "./schemas/image";
import {PostMetaSchema} from "./schemas/post-meta";

export const client = new DynamoDB.DocumentClient({
    region: env.region,
    endpoint: env.endpoint,
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
})

export const MySchema: OneSchema = {
    indexes: {
        primary: {hash: 'pk', sort: 'sk'},
        gsi1: {hash: 'gsi1pk', sort: 'gsi1sk'},
    },
    models: {
        Post: PostSchema,
        PostVersion: PostVersionSchema,
        PostTag: PostTagSchema,
        PostMeta: PostMetaSchema,
        Tag: TagSchema,
        Image: ImageSchema,
    }
}

export const ddb = new Table({
    client: client,
    name: process.env.DDB_NAME,
    schema: MySchema,
    timestamps: true,
    createdField: 'created_at',
    isoDates: true,
    logger: (level, message, context) => {
        console.log(`${new Date().toLocaleString()}: ${level}: ${message}`)
        console.log(JSON.stringify(context, null, 4) + '\n')
    }
})

export type TagType = Entity<typeof TagSchema>;
export const Tag = ddb.getModel<TagType>('Tag');

export type ImageType = Entity<typeof ImageSchema>
export const Image = ddb.getModel<ImageType>('Image');

export type ModelType = Entity<typeof PostSchema>;
export const Post = ddb.getModel<ModelType>('Post');

export type PostTagType = Entity<typeof PostTagSchema>;
export const PostTag = ddb.getModel<PostTagType>('PostTag');

export type PostVersionType = Entity<typeof PostVersionSchema>;
export const PostVersion = ddb.getModel<PostVersionType>('PostVersion');

export type PostMetaType = Entity<typeof PostMetaSchema>;
export const PostMeta = ddb.getModel<PostMetaType>('PostMeta');
