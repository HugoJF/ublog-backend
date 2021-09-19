import * as Validators from 'class-validator';

export class TagPostRequest {
    @Validators.IsDefined()
    post_slug: string;

    @Validators.IsDefined()
    tag_slug: string;
}
