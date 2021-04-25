import { config } from './config';
import firebase from 'firebase';

firebase.initializeApp(config);

export const auth = firebase.auth();

const settings = {timestampsInSnapshots: true};
firebase.firestore().settings(settings);
export const firestore = firebase.firestore();
export const firestorage = firebase.storage();
export const firebasestore = firebase.firestore;