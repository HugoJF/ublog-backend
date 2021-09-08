import "reflect-metadata"
import {container} from "tsyringe";
import {PostService} from "../src/services/post-service";

beforeEach(async () => {
    const service = container.resolve(PostService);

    // service.delete('my-slug');
})

test('creating a post generates version 0 and 1', async () => {
    const service = container.resolve(PostService);

    const v1 = {slug: 'my-slug', body: '# my title', title: 'first post'}
    const v2 = {slug: 'my-slug', body: '# my **title**', title: 'still my first post'}

    // Create post
    await service.put(v1);

    // Fetch data
    const versions1 = await service.versions('my-slug');
    const post1 = await service.get('my-slug');

    // Assert
    expect(versions1).toStrictEqual({versions: ['v1']});
    expect(post1).toEqual(expect.objectContaining(v1));
    expect(post1?.['version']).toEqual(1);

    // Update to version 2
    await service.put(v2);

    // Fetch data
    const versions2 = await service.versions('my-slug');
    const post2 = await service.get('my-slug');

    // Assert
    expect(versions2).toStrictEqual({versions: ['v1', 'v2']});
    expect(post2).toEqual(expect.objectContaining(v2));
    expect(post2?.['version']).toEqual(2);
});
