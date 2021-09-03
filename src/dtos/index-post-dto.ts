import * as Validators from 'class-validator';

export class IndexPostDto {
    @Validators.IsOptional()
    pagination?: string;
}
