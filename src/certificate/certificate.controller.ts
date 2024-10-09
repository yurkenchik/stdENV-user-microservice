import {Controller} from "@nestjs/common";
import {CertificateService} from "./certificate.service";
import {MessagePattern, Payload} from "@nestjs/microservices";

@Controller()
export class CertificateController {

    constructor(private readonly certificateService: CertificateService) {}

    @MessagePattern({ cmd: "uploadCertificate" })
    async uploadCertificate(
        @Payload() payload: { userId: string, file: any }
    ): Promise<Record<string, string>> {
        const { userId, file } = payload;
        return this.certificateService.uploadCertificate(userId, file);
    }
}