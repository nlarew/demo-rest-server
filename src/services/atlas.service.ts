// const MongoClient = require('mongodb').MongoClient;
import { MongoClient, Db } from 'mongodb';

const URL = 'mongodb+srv://mongodb-tests:bC1tkLGjfwMtesk4@promod.9li7r.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE = 'fastdata'
const PRODUCT_COLLECTION = 'product'

export class AtlasService {

    private _client: MongoClient;
    // TODO not allows to assing null or undefinded, weird...
    private _db: Db | undefined = undefined;

    constructor(){
        this._client =  new MongoClient(URL);

    }

    public async connect() {
        await this._client.connect();
        this._db = this._client.db(DATABASE);
        console.log(`_db: ${this._db}`);
    }

    public async close() {
        await this._client.close();
    }

    public getProducts(nbProducts: number): Promise<any[]> {
        if( this._db){
            const collection = this._db.collection(PRODUCT_COLLECTION);
            return collection.countDocuments().then( docsCount => {
                // console.log(`docsCount: ${docsCount}`);
                const r = Math.floor(Math.random() * docsCount);
                const documents = collection.find({}).limit(nbProducts).skip(r)
                return documents.toArray();
            });
        }
        return Promise.resolve([]);
    }


    /*
     const db = client.db(dbName);

  client.close();
  */
}