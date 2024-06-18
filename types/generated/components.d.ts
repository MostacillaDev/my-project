import type { Schema, Attribute } from '@strapi/strapi';

export interface OrderedItemsOrderedItems extends Schema.Component {
  collectionName: 'components_ordered_items_ordered_items';
  info: {
    displayName: 'Ordered-Items';
    icon: 'shoppingCart';
  };
  attributes: {
    quantity: Attribute.Integer;
    price: Attribute.Decimal;
    product: Attribute.Relation<
      'ordered-items.ordered-items',
      'oneToOne',
      'api::producto.producto'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'ordered-items.ordered-items': OrderedItemsOrderedItems;
    }
  }
}
