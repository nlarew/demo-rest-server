const Realm = require("realm")
import { ReceiptSchema, OrderSchema } from './schemas'
// const ObjectId = require('bson').ObjectId;
import { ObjectId, ObjectID } from 'bson'

export class RealmService {

    private _realms: { [key: string]: any } = {};
    private _app: any;

    constructor() {
        this._app = this._getApp();
    }

    private _getApp() {
        const appId = 'promod-poc-mjqwd' // 'default-xmwxi';
        const appConfig = {
            id: appId,
            url: 'https://realm.mongodb.com', // 'http://localhost:8080',
            timeout: 1000,
            app: {
                name: "default",
                version: '0'
            },
        };
        return new Realm.App(appConfig)
    }

    public async getRealm(partition: string) {
        let realm = this._realms[partition];
        if (!realm) {
            realm = await this._getRealm(partition);
            this._realms[partition] = realm;
        }
        return realm;
    }

    private async _getRealm(partition: string) {
        const credentials = Realm.Credentials.anonymous();

        const user = await this._app.logIn(credentials);
        console.log(`User logged in: ${user.identity}`);


        const config = {
            schema: [ReceiptSchema, OrderSchema],
            sync: {
                user,
                partitionValue: partition
            }
        };
        console.log('Opening realm form: ' + partition);
        const realm = await Realm.open(config)

        console.log(`Opened Realm ${partition} for user ${user.identity}`);

        return realm
    }

    public addReceipt(body: any) {
        this.getRealm('store=' + body.store).then(realm => {
            console.log(body);
            realm.write(() => {
                const recipe = realm.create("Receipt", { ...body, "_id": new ObjectId() })
            });
            realm.syncSession.uploadAllLocalChanges();
        });
    }

    public addOrder(body: any) {
        this.getRealm('store=' + body.store).then(realm => {
            console.log(body);
            realm.write(() => {
                const order = realm.create("Order", { ...body, "_id": new ObjectId() })
            });
            realm.syncSession.uploadAllLocalChanges();
        });
    }

    public async getReceipts(store: string) {
        const realm = await this.getRealm('store=' + store);
        realm.syncSession.downloadAllServerChanges();
        const realmReceipts = realm.objects("Receipt").sorted('saleDate', true);
        const receipts = realmReceipts.map( realmReceipt => {
            return this.realmReceiptToJSON(realmReceipt);
        })
        return receipts;
    }

    public async getOrders(store: string) {
        const realm = await this.getRealm('store=' + store);
        realm.syncSession.downloadAllServerChanges();
        const realmOrders = realm.objects("Order").sorted('orderDate', true);
        const orders = realmOrders.map( realmReceipt => {
            return this.realmOrderToJSON(realmReceipt);
        })
        return orders;
    }

    public async getOrder(store: string, orderId: ObjectId) {
        const realm = await this.getRealm('store=' + store);
        realm.syncSession.downloadAllServerChanges();
        let realmOrder = realm.objects("Order").filtered("_id = $0", new ObjectId(orderId) );
        console.log('SIZE=' + realmOrder.length)
        if(realmOrder.length > 0){
            realmOrder = realmOrder[0];
            const order = this.realmOrderToJSON(realmOrder);
            return order;
        }
        return {};
    }

    public async deleteOrder(store: string, orderId: ObjectId) {
        const realm = await this.getRealm('store=' + store);
        realm.syncSession.downloadAllServerChanges();
        let realmOrder = realm.objects("Order").filtered("_id = $0", new ObjectId(orderId) );
        console.log('SIZE=' + realmOrder.length)
        if(realmOrder.length > 0){
            realmOrder = realmOrder[0];
            realm.delete(realmOrder);
            realm.syncSession.uploadAllLocalChanges();
        }
    }

    realmOrderToJSON(realmObj){
        const order = {
                _id: realmObj._id,
                orderDate: realmObj.orderDate,
                items: [] as any,
                store: realmObj.store,
                customer: {
                    firstname: '',
                    lastname: '',
                }
            };
            if(realmObj.customer){
                if(realmObj.customer.firstname){
                    order.customer.firstname = realmObj.customer.firstname;
                }
                if(realmObj.customer.lastname){
                    order.customer.lastname = realmObj.customer.lastname;
                }
            }
        realmObj.items.forEach(realmItem => {
            const item = {
                id: realmItem.id,
                quantity: realmItem.quantity,
                price: realmItem.price,
                name: realmItem.name,
                description: realmItem.description,
                color: realmItem.color
            };
            order.items.push(item);
        });

            return order;
    };

    realmReceiptToJSON(realmObj){
        const receipt = {
                _id: realmObj._id,
                cashRegister: realmObj.cashRegister,
                saleDate: realmObj.saleDate,
                items: [] as any,
                store: realmObj.store,
                customer: {
                    firstname: '',
                    lastname: '',
                }
            };
            if(realmObj.customer){
                if(realmObj.customer.firstname){
                    receipt.customer.firstname = realmObj.customer.firstname;
                }
                if(realmObj.customer.lastname){
                    receipt.customer.lastname = realmObj.customer.lastname;
                }
            }
        realmObj.items.forEach(realmItem => {
            const item = {
                id: realmItem.id,
                quantity: realmItem.quantity,
                price: realmItem.price,
                name: realmItem.name
            };
            receipt.items.push(item);
        });

            return receipt;
    };

}