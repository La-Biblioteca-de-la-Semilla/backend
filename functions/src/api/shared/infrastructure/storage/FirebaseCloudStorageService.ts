import {ImageService} from "../../application/ImageService";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { Bucket } from "@google-cloud/storage";

export class FirebaseCloudStorageService implements ImageService {
    private readonly bucket: Bucket;
    private readonly publicURL: string;

    constructor(publicURL: string) {
        this.bucket = admin.storage().bucket();
        this.publicURL = publicURL;
    }

    async process(imageData: string, imageName: string): Promise<string> {
        try {
            // Verificar si la imagen ya es una URL válida
            const urlPattern = new RegExp("^(https?:\\/\\/)?" +
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
                "((\\d{1,3}\\.){3}\\d{1,3}))" +
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
                "(\\?[;&a-z\\d%_.~+=-]*)?" +
                "(\\#[-a-z\\d_]*)?$", "i");

            if (urlPattern.test(imageData)) {
                logger.info("La imagen ya es una URL válida. No se realiza ninguna acción.");
                return imageData;
            }

            // Si la imagen no es una URL, subirla a Firebase Storage
            // Verificar si el string es una imagen base64 válida
            const base64Pattern = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
            if (!base64Pattern.test(imageData)) {
                throw new Error("El string proporcionado no es una imagen válida en formato base64.");
            }

            // Extraer el tipo de imagen y los datos base64
            const matches = imageData.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
            if (!matches || matches.length !== 2) {
                throw new Error("Formato de imagen no válido.");
            }

            const imageType = matches[1];
            const base64Data = imageData.split(",")[1];

            // Convertir base64 a buffer
            const buffer = Buffer.from(base64Data, "base64");

            // Crear un nombre de archivo único con la extensión correcta
            const fileName = `${imageName}-${Date.now()}.${imageType}`;
            const filePath = `images/${fileName}`;

            // Crear un archivo en el bucket
            const file = this.bucket.file(filePath);

            // Subir el buffer al archivo
            await file.save(buffer, {
                metadata: {
                    contentType: `image/${imageType}`
                }
            });

            // Hacer que el archivo sea públicamente accesible
            await file.makePublic();

            // Obtener la URL pública del archivo
            let publicUrl: string;
            const encodedFilePath = encodeURIComponent(filePath);
            if (this.publicURL.includes("127.0.0.1") || this.publicURL.includes("localhost")) {
                publicUrl = `${this.publicURL}/${this.bucket.name}/${encodedFilePath}`;
            } else {
                publicUrl = `${this.publicURL}${this.bucket.name}/o/${encodedFilePath}?alt=media`;
            }

            logger.info(`Imagen subida a Firebase Storage: ${publicUrl}`);
            return publicUrl;
        } catch (error) {
            logger.error("Error al procesar la imagen:", error);
            throw error;
        }
    }
}
