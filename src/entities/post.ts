import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';

export class Post {
    @Validators.Length(0, 30)
    @Transformers.Expose()
    slug: string;

    @Transformers.Expose()
    title: string;

    @Transformers.Expose()
    body: string;

    @Transformers.Expose()
    @Validators.IsOptional()
    version?: number;
}
