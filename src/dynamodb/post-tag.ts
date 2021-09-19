export const PostTagSchema = {
    pk: {type: String, value: 'post:${post_slug}'},
    sk: {type: String, value: 'tag:${tag_slug}'},
    gsi1pk: {type: String, value: 'tag:${tag_slug}'},
    gsi1sk: {type: String, value: 'post:${post_slug}'},

    post_slug: {type: String, required: true},
    tag_slug: {type: String, required: true},
};
