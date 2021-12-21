import "reflect-metadata";
import 'source-map-support/register'
import {PostStoreHandler} from "./post-store-handler";
import {PostGetHandler} from "./post-get-handler";
import {PostIndexHandler} from "./post-index-handler";
import {PostVersionsHandler} from "./post-versions-handler";
import {PostDeleteHandler} from "./post-delete-handler";
import {PostRollbackHandler} from "./post-rollback-handler";
import {generateHandler} from "../../helpers/handler-helpers";

module.exports.index = generateHandler(PostIndexHandler)
module.exports.get = generateHandler(PostGetHandler);
module.exports.store = generateHandler(PostStoreHandler);
module.exports.versions = generateHandler(PostVersionsHandler);
module.exports.delete = generateHandler(PostDeleteHandler);
