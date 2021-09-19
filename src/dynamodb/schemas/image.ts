export const ImageSchema = {
    pk: {type: String, value: 'image:${slug}'},
    sk: {type: String, value: 'image'},
    gsi1pk: {type: String, value: 'image'},
    gsi1sk: {type: String, value: 'image:${slug}'},

    slug: {type: String, required: true},
}
