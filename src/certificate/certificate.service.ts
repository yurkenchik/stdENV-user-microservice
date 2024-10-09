import {HttpException, HttpStatus, Injectable, InternalServerErrorException} from "@nestjs/common";
import {CertificateRepository} from "./certificate.repository.abstract";
import * as admin from "firebase-admin";
import {UserService} from "../user/user.service";
import {FirebaseService} from "../firebase/firebase.service";

@Injectable()
export class CertificateService extends CertificateRepository {

    public firebaseStorage: admin.storage.Storage;

    constructor(
        private readonly userService: UserService,
        private readonly firebaseService: FirebaseService,
    ) {
        super();
    }

    async uploadCertificate(userId: string, file: any): Promise<Record<string, string>> {
        try {
            const user = await this.userService.getUserById(userId);
            const fileName = `certificates/${user.id}/${Date.now()}_${file.originalname}`;
            const bucket = this.firebaseService.firebaseStorage.bucket();

            const blobStream = bucket.file(fileName).createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: admin.firestore().collection('tokens').doc().id
                    }
                },
            });

            const fileUrl = await new Promise<string>((resolve, reject) => {
                blobStream.on('error', (error) => reject(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)));
                blobStream.on('finish', async () => {
                    resolve(`https://firebasestorage.googleapis.com/v0/b/studenviroment.appspot.com/o/avatars%${user.id}%${Date.now()}_${file.originalname}?alt=media&token=`);
                });
                blobStream.end(file.buffer);
            })
            await this.userService.updateUser(userId, { certificateLink: fileUrl });
            return { message: "File successfully uploaded", fileName: file.originalname };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}