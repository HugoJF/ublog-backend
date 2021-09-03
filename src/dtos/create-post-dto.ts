import * as Validators from 'class-validator';

export class CreatePostDto {
    @Validators.Length(0, 30)
    slug: string;

    title: string;

    body: string;
}
