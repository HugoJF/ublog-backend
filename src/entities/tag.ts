import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';

export class Tag {
    @Validators.Length(1, 30)
    @Transformers.Expose()
    slug: string;

    @Validators.Length(1, 50)
    @Transformers.Expose()
    name: string;
}
