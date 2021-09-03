import "reflect-metadata";
import {PostStoreHandler} from "./post-store-handler";
import {PostGetHandler} from "./post-get-handler";
import {PostIndexHandler} from "./post-index-handler";
import {generateHandler} from "../helpers/handler-helpers";

module.exports.index = generateHandler(PostIndexHandler)
module.exports.get = generateHandler(PostGetHandler);
module.exports.store = generateHandler(PostStoreHandler);
