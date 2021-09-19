import * as Validators from 'class-validator';

export class IndexPostRequest {
    @Validators.IsOptional()
    pagination?: string;
}
