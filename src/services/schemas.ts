export const RecipeSchema = {
    name: 'Recipe',
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