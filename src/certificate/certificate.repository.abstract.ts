
export abstract class CertificateRepository {
    abstract uploadCertificate(userId: string, file: any): Promise<Record<string, string>>;
}