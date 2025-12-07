import * as logger from "firebase-functions/logger";
import { ImageService } from "../../application/ImageService";

export class ImgBBService implements ImageService {
    constructor(private readonly apiKey: string) {}

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

            // Si la imagen no es una URL, subirla a imgbb
            // Verificar si el string es una imagen base64 válida
            const base64Pattern = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
            if (!base64Pattern.test(imageData)) {
                throw new Error("El string proporcionado no es una imagen válida en formato base64.");
            }

            const imageParts = imageData.split(",");
            if (imageParts.length < 2) {
                throw new Error("Formato de imagen no válido.");
            }

            const image = imageParts[1];
            const body = new FormData();
            body.set("name", imageName);
            body.set("image", image);

            // Subir la imagen a imgbb
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, {
                method: "POST",
                body: body,
            });

            if (!response.ok) {
                throw new Error(`Error en la carga de imagen: ${response.statusText}`);
            }

            const jsonResponse = await response.json();
            return jsonResponse.data.url;
        } catch (error) {
            logger.error("Error al procesar la imagen:", error);
            throw error;
        }
    }
}