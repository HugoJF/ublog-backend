import * as Validators from 'class-validator';
import * as Transformers from 'class-transformer';

export class Post {
    @Validators.Length(1, 30)
    @Transformers.Expose()
    slug: string;

    @Transformers.Expose()
    @Validators.IsDefined()
    title: string;

    @Transformers.Expose()
    @Validators.IsDefined()
    body: string;

    @Transformers.Expose()
    @Validators.IsDefined()
    abstract: string;

    @Transformers.Expose()
    @Validators.IsDefined()
    public: boolean;

    @Transformers.Expose()
    @Validators.IsOptional()
    version?: number;
}
