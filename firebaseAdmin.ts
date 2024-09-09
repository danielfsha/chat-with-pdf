import {initializeApp, getApps, App,cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

var serviceAccount = require("./service-account.json");

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

const adminDB = getFirestore(app);

export {
    app as adminApp, 
    adminDB
};