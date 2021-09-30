import {BaseHandler} from "../base-handler";
import {injectable} from "tsyringe";
import {PostAuthRequest} from "../../requests/post-auth-request";
import {AuthService} from "../../services/auth-service";

@injectable()
export class AuthHandler extends BaseHandler {
    constructor(
        private auth: AuthService,
    ) {
        super();
    }

    async handle() {
        const body = await this.parseBody(PostAuthRequest);

        return await this.auth.auth({
            Username: body.username,
            Password: body.password,
        });
    }
}
