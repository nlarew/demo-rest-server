import Realm from 'realm';

let app;

// Returns the shared instance of the Realm app.
export function getRealmApp() {
  if (app === undefined) {
    const appId = 'task-tracker01-sqivv'; // Set Realm app ID here.
    const appConfig = {
      id: appId,
//      url: 'https://realm.mongodb.com',
      timeout: 1000,
      app: {
        name: 'default',
        version: '0',
      },
    };
    app = new Realm.App(appConfig);
  }
  return app;
}