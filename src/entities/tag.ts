import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';

export class Tag {
    @Validators.Length(0, 30)
    @Transformers.Expose()
    slug: string;

    @Transformers.Expose()
    name: string;
}
