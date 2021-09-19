export const TagSchema = {
    pk: {type: String, value: 'tag:${slug}'},
    sk: {type: String, value: 'tag'},
    gsi1pk: {type: String, value: 'tag'},
    gsi1sk: {type: String, value: 'tag:${slug}'},

    slug: {type: String, required: true},
    name: {type: String, required: true},
}
