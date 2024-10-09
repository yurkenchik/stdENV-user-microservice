import {Module} from "@nestjs/common";
import {CertificateService} from "./certificate.service";
import {CertificateController} from "./certificate.controller";
import {UserModule} from "../user/user.module";
import {FirebaseModule} from "../firebase/firebase.module";

@Module({
    providers: [CertificateService],
    controllers: [CertificateController],
    imports: [
        UserModule,
        FirebaseModule,
    ],
    exports: [CertificateService]
})
export class CertificateModule {}