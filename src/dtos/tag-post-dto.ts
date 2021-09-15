import * as Validators from 'class-validator';

export class TagPostDto {
    @Validators.IsDefined()
    post_slug: string;

    @Validators.IsDefined()
    tag_slug: string;
}
