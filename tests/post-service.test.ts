import "reflect-metadata"
import {container} from "tsyringe";
import {PostService} from "../src/services/post-service";

const slug = 'my-slug';
const v1 = {slug: slug, body: '# my title', title: 'first post'};
const v2 = {slug: slug, body: '# my **title**', title: 'still my first post'};

const service = container.resolve(PostService);

beforeAll(async () => {
    await service.delete(slug);
})

afterEach(async () => {
    await service.delete(slug);
})

describe('versioning of posts', () => {
    beforeEach(async () => {
        // Create post
        await service.put(v1);
    })

    test('assert v1 was created', async () => {
        // Fetch data
        const versions = await service.versions(slug);
        const post = await service.get(slug);

        // Assert
        expect(versions).toStrictEqual({versions: ['v1']});
        expect(post).toEqual(expect.objectContaining(v1));
        expect(post?.['version']).toEqual(1);
    })

    describe('a post with 2 versions', () => {
        beforeEach(async () => {
            // Update to version 2
            await service.put(v2);
        })

        test('assert v2 was created', async () => {
            // Fetch data
            const versions = await service.versions(slug);
            const post = await service.get(slug);

            // Assert
            expect(versions).toStrictEqual({versions: ['v1', 'v2']});
            expect(post).toEqual(expect.objectContaining(v2));
            expect(post?.['version']).toEqual(2);
        });

        test('assert v1 can be rolled back', async () => {
            await service.rollBack(slug, 1);

            const versions = await service.versions(slug);
            const post = await service.get(slug);

            // Assert
            expect(versions).toStrictEqual({versions: ['v1', 'v2']});
            expect(post).toEqual(expect.objectContaining(v1));
            expect(post?.['version']).toEqual(1);
        })

        test('assert v1 is untouched', async () => {
            const post = await service.get(slug, 1);

            expect(post).toEqual(expect.objectContaining(v1));
        })

        test('assert v2 is untouched', async () => {
            const post = await service.get(slug, 2);

            expect(post).toEqual(expect.objectContaining(v2));
        })

        test('assert v3 is created', async () => {
            await service.put(v1);

            const versions = await service.versions(slug);

            // Assert
            expect(versions).toStrictEqual({versions: ['v1', 'v2', 'v3']});
        })
    })
})

