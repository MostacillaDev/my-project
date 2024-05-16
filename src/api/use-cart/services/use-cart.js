'use strict';

/**
 * use-cart service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::use-cart.use-cart');
