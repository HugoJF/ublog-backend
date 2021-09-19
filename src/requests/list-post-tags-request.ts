import * as Validators from 'class-validator';

export class ListPostTagsRequest {
    @Validators.IsDefined()
    slug: string;
}
