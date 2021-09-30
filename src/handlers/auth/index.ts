import "reflect-metadata";
import 'source-map-support/register'
import {generateHandler} from "../../helpers/handler-helpers";
import {AuthHandler} from "./auth-handler";

module.exports.auth = generateHandler(AuthHandler)
