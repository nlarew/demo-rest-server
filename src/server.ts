import express = require('express');
import cors = require('cors');
import { AtlasService } from './services/atlas.service'
import { RealmService } from './services/realm.service';
import { removeListener } from 'process';
const ObjectId = require('bson').ObjectId;
// import express from "express";
const app: express.Application = express();

// const app = express()
const port = 3000

// initialize MongoDB Atlas connection
const atlasService = new AtlasService();
(async () => {
  await atlasService.connect();
})()

// initilaize Realm
const realmService = new RealmService();

// allows cross-origin requests
app.use(cors());
app.use(express.json())

app.get('/', (req: any, res: any) => res.send('Hello World!'))

app.get('/products/:count', (req: any, res: any) => {
  atlasService.getProducts(parseInt(req.params.count)).then( products => res.send(products));
  // res.send('Hello World!' + req.params.count)
});

app.get('/receipts/:store', async (req: any, res: any) => {
  const receipts = await realmService.getReceipts(req.params.store);
  console.dir(receipts);
  res.status(200);
  res.json(receipts).
  res.send();
});

app.post('/receipt', (req: any, res: any) => {
  realmService.addReceipt(req.body);
  res.status(200);
  res.send();
  /*
    realmService.getRealm('TEST01').then( realm => {
    realm.write(() => {
      const recipe = realm.create("Recipe", {...req.body, "_id": new ObjectId() })
    });
   realm.syncSession.uploadAllLocalChanges();
   // realm.close();
    res.send('Added recipe ok');
  });
  */
  /*
  res.json(null)
  res.json({ user: 'tobi' })
  res.status(500).json({ error: 'message' })
*/
});


// start the server
const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

// server.close()

/*
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
      console.log('Http server closed.');
    });
  });
  */