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

app.get('/orders/:store', async (req: any, res: any) => {
  const orders = await realmService.getOrders(req.params.store);
  console.dir(orders);
  res.status(200);
  res.json(orders).
  res.send();
});

app.get('/order/:store/:orderId', async (req: any, res: any) => {
  const order = await realmService.getOrder(req.params.store, req.params.orderId);
  res.status(200);
  res.json(order).
  res.send();
});

app.get('/receipt/:store/:receiptId', async (req: any, res: any) => {
  const order = await realmService.getReceipt(req.params.store, req.params.receiptId);
  res.status(200);
  res.json(order).
  res.send();
});

app.get('/receipts/:store', async (req: any, res: any) => {
  const receipts = await realmService.getReceipts(req.params.store);
  console.dir(receipts);
  res.status(200);
  res.json(receipts).
  res.send();
});

app.delete('/order/:store/:orderId', async (req: any, res: any) => {
  await realmService.deleteOrder(req.params.store, req.params.orderId);
  res.status(200);
  res.send();
});

app.post('/order', (req: any, res: any) => {
  realmService.addOrder(req.body);
  res.status(200);
  res.send();
});


app.post('/receipt', (req: any, res: any) => {
  realmService.addReceipt(req.body);
  res.status(200);
  res.send();
});


// start the server
const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))