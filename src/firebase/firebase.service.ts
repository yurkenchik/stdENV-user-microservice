import * as admin from 'firebase-admin';
// @ts-ignore
import * as firebaseServiceAccount from '../../firebase-service-account';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
    public firebaseStorage: admin.storage.Storage;

    constructor() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(firebaseServiceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            });
        }
        this.firebaseStorage = admin.storage();
    }
}