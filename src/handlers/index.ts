require('source-map-support/register');
require('reflect-metadata');

const {tokenMapping} = require('./../helpers/handler-helpers');

function adapter(id) {
    return async (event) => {
        const resolve = await import('../helpers/handler-helpers').then(m => m.handleResolver);

        return await resolve(id, event);
    }
}

module.exports = Object.fromEntries(Object.keys(tokenMapping).map(key => [key, adapter(key)]));
