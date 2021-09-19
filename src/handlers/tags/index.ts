import "reflect-metadata";
import 'source-map-support/register'
import {generateHandler} from "../../helpers/handler-helpers";
import {TagStoreHandler} from "./tag-store-handler";
import {TagIndexHandler} from "./tag-index-handler";
import {TagPostHandler} from "./tag-post-handler";
import {ListTagsHandler} from "./list-tags-handler";
import {UntagPostHandler} from "./untag-post-handler";

module.exports.index = generateHandler(TagIndexHandler)
module.exports.store = generateHandler(TagStoreHandler)
module.exports.tag = generateHandler(TagPostHandler)
module.exports.untag = generateHandler(UntagPostHandler)
module.exports.list = generateHandler(ListTagsHandler)
