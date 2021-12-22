import 'source-map-support/register'
import "reflect-metadata";
import {PostStoreHandler} from "./posts/post-store-handler";
import {PostGetHandler} from "./posts/post-get-handler";
import {PostIndexHandler} from "./posts/post-index-handler";
import {PostVersionsHandler} from "./posts/post-versions-handler";
import {PostDeleteHandler} from "./posts/post-delete-handler";
import {TagIndexHandler} from "./tags/tag-index-handler";
import {TagStoreHandler} from "./tags/tag-store-handler";
import {TagPostHandler} from "./tags/tag-post-handler";
import {UntagPostHandler} from "./tags/untag-post-handler";
import {ListTagsHandler} from "./tags/list-tags-handler";
import {generateHandler} from "../helpers/handler-helpers";

module.exports.postIndex = generateHandler(PostIndexHandler)
module.exports.postGet = generateHandler(PostGetHandler);
module.exports.postStore = generateHandler(PostStoreHandler);
module.exports.postVersions = generateHandler(PostVersionsHandler);
module.exports.postDelete = generateHandler(PostDeleteHandler);


module.exports.tagindex = generateHandler(TagIndexHandler)
module.exports.tagstore = generateHandler(TagStoreHandler)
module.exports.tagTag = generateHandler(TagPostHandler)
module.exports.tagUntag = generateHandler(UntagPostHandler)
module.exports.tagList = generateHandler(ListTagsHandler)
