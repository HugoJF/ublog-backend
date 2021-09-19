import "reflect-metadata"
import {container} from "tsyringe";
import {TagService} from "../src/services/tag-service";
import {Tag} from "../src/entities/tag";

const service = container.resolve(TagService);

const angular: Tag = {slug: 'angular', name: 'Angular'}
const react: Tag = {slug: 'react', name: 'React'};

describe('tag creation', () => {
    test('tags can be created and listed', async () => {
        // Create tag
        await service.put(angular);
        await service.put(react);

        const tags = await service.index();

        // Assert
        expect(tags).toEqual(expect.arrayContaining([
            expect.objectContaining(angular),
            expect.objectContaining(react),
        ]));
    })
})
