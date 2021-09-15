import * as Validators from 'class-validator';

export class ListPostTagsDto {
    @Validators.IsDefined()
    slug: string;
}
