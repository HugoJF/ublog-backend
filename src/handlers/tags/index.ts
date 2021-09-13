import "reflect-metadata";
import 'source-map-support/register'
import {generateHandler} from "../../helpers/handler-helpers";
import {TagStoreHandle} from "./tag-store-handle";
import {TagIndexHandle} from "./tag-index-handle";

module.exports.index = generateHandler(TagIndexHandle)
module.exports.store = generateHandler(TagStoreHandle)
