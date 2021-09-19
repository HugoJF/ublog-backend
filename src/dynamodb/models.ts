import {Entity, OneSchema, Table} from 'dynamodb-onetable'
import {DynamoDB} from "aws-sdk";
import env from '../environments/environment';
import {TagProperties, TagSchema} from "./tag";
import {PostVersionSchema} from "./post-version";
import {PostTagProperties, PostTagSchema} from "./post-tag";
import {PostProperties, PostSchema} from "./post";
import {ImageProperties, ImageSchema} from "./image";

export const client = new DynamoDB.DocumentClient({
    region: env.region,
    endpoint: env.endpoint,
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
})

export const MySchema: OneSchema = {
    indexes: {
        primary: {hash: 'pk', sort: 'sk'},
        gsi1: {hash: 'gsi1pk', sort: 'gsi1sk', follow: true},
    },
    models: {
        Post: PostSchema,
        PostVersion: PostVersionSchema,
        PostTag: PostTagSchema,
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

export type TagType = Entity<typeof TagProperties>;
export const Tag = ddb.getModel<TagType>('Tag');

export type ImageType = Entity<typeof ImageProperties>
export const Image = ddb.getModel<ImageType>('Image');

export type ModelType = Entity<typeof PostProperties>;
export const Post = ddb.getModel<ModelType>('Post');

export type PostTagType = Entity<typeof PostTagProperties>;
export const PostTag = ddb.getModel<PostTagType>('PostTag');

export type PostVersionType = Entity<typeof PostProperties>;
export const PostVersion = ddb.getModel<PostVersionType>('PostVersion');
