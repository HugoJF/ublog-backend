import {Entity, OneSchema, Table} from 'dynamodb-onetable'
import {DynamoDB} from "aws-sdk";
import env from '../environments/environment';
import {TagSchema} from "./tag";
import {PostVersionSchema} from "./post-version";
import {PostTagSchema} from "./post-tag";
import {PostSchema} from "./post";
import {ImageSchema} from "./image";
import {PostMetaSchema} from "./post-meta";

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
    name: 'ublog',
    schema: MySchema,
    timestamps: true,
    createdField: 'created_at',
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
