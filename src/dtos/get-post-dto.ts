import * as Validators from 'class-validator';

export class GetPostDto {
    @Validators.IsDefined()
    slug: string;
}
