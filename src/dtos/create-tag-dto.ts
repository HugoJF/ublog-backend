import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';

export class CreateTagDto {
    @Transformers.Expose()
    @Validators.Length(1, 30)
    slug: string;

    @Transformers.Expose()
    @Validators.Length(1, 50)
    name: string;
}
