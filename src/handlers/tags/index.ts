import "reflect-metadata";
import 'source-map-support/register'
import {generateHandler} from "../../helpers/handler-helpers";
import {TagStoreHandle} from "./tag-store-handle";
import {TagIndexHandle} from "./tag-index-handle";
import {TagPostHandler} from "./tag-post-handler";
import {ListTagsHandler} from "./list-tags-handler";

module.exports.index = generateHandler(TagIndexHandle)
module.exports.store = generateHandler(TagStoreHandle)
module.exports.tag = generateHandler(TagPostHandler)
module.exports.list = generateHandler(ListTagsHandler)
