export const PostMetaSchema = {
    pk: {type: String, value: 'post:${slug}'},
    sk: {type: String, value: 'meta'},

    slug: {type: String, required: true},
    last_version: {type: Number, required: true},
};
