import {PostProperties} from "./post";

export const PostVersionSchema = {
    pk: {type: String, value: 'post:${slug}'},
    sk: {type: String, value: 'v${version}'},
    ...PostProperties,
};
