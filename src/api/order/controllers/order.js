'use strict';
// @ts-ignore
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


//module.exports = createCoreController('api::order.order');
module.exports = createCoreController('api::order.order', ({strapi}) => ({
  async create(ctx){
    //@ts-ignore

    const { email, address, phone, name,lastName, city, state, total, userId, zip, specialOrderItemList } = ctx.request.body;
    if (!email || !address || !phone || !name || !lastName || !city || !state || !total || !userId || !zip || !specialOrderItemList) {
      ctx.response.status = 400;
      return {error: 'Faltan datos'};
    }
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: specialOrderItemList.map(item => ({
          price_data: {
            currency: 'mxn',
            product_data: {
              name: item.nameProduct,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/confirmation`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });   
      // Guardar la orden en Strapi
      await strapi.service("api::order.order").create({
        data:{
          email,
        address,
        phone,
        name: name + '' + lastName,
        city,
        state,
        total,
        userId,
        orderItemList: specialOrderItemList.map(item => ({
          quantity: item.quantity,
          price: item.price,
          product: item.product, 
        })),
        zip,
        stripeSessionId: session.id,
        }
      });
      return {sessionId: session.id}
    } catch (error) {
      console.log(error);
      ctx.response.status = 500;
      return{error}
    }
  }
}));
