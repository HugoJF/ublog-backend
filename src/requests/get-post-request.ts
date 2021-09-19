import * as Validators from 'class-validator';

export class GetPostRequest {
    @Validators.IsDefined()
    slug: string;

    @Validators.IsOptional()
    version?: number;
}
