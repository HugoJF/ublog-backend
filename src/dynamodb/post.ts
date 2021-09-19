import {OneModelSchema} from "dynamodb-onetable";

export const PostProperties = {
    version: {type: Number, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    slug: {type: String, required: true},
    public: {type: Boolean, required: true},
    abstract: {type: String, required: true},
}

export const PostSchema = {
    pk: {type: String, value: 'post:${slug}'},
    sk: {type: String, value: 'v0'},
    gsi1pk: {type: String, value: 'post'},
    // FIXME
    // gsi1sk: {type: String, value: '${created_at}'},
    gsi1sk: {type: String, value: '123'},
    ...PostProperties,
}

