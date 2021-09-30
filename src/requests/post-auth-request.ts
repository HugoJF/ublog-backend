import * as Validators from 'class-validator';

export class PostAuthRequest {
    @Validators.IsDefined()
    username: string;

    @Validators.IsDefined()
    password: string;
}
