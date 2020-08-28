export const ReceiptSchema = {
    name: 'Receipt',
    properties: {
        _id: 'objectId',
        cashRegister: 'string',
        saleDate: 'date',
        store: 'string',
        items: {
            name: 'Item',
            type: 'list',
            objectType: 'object',
            properties: {
                id: 'string?',
                quantity: 'int?',
                price: 'double?',
                name: 'string?',
            }
        },
        customer: {
            name: 'Customer',
            properties: {
                firstname: 'string?',
                lastname: 'string?'
            }
        },
    },
    primaryKey: '_id'
};

export const OrderSchema = {
    name: 'Order',
    properties: {
        _id: 'objectId',
        orderDate: 'date',
        store: 'string',
        items: {
            name: 'Item',
            type: 'list',
            objectType: 'object',
            properties: {
                id: 'string?',
                name: 'string?',
                description2: 'string?',
                quantity: 'int?',
                price: 'double?',
                color: 'string?'
            }
        },
        customer: {
            name: 'Customer',
            properties: {
                firstname: 'string?',
                lastname: 'string?'
            }
        },
    },
    primaryKey: '_id'
};