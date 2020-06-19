const Realm = require("realm")
import { RecipeSchema } from './schemas'
// const ObjectId = require('bson').ObjectId;
import { ObjectId } from 'bson'

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
        }
        return realm;
    }

    private async _getRealm(partition: string) {
        const credentials = Realm.Credentials.anonymous();

        const user = await this._app.logIn(credentials);
        console.log(`User logged in: ${user.identity}`);


        const config = {
            schema: [RecipeSchema],
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

    public addRecipe(body: any) {
        this.getRealm('store=' + body.store).then(realm => {
            console.log(body);
            realm.write(() => {
                const recipe = realm.create("Recipe", { ...body, "_id": new ObjectId() })
            });
            realm.syncSession.uploadAllLocalChanges();
        });
    }


}