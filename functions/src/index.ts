import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Initialize Firebase Admin with emulator connection if in development environment
admin.initializeApp();

// Connect to Firestore emulator if running locally
if (process.env.FUNCTIONS_EMULATOR === "true") {
    logger.info("Using Firestore emulator");
    admin.firestore().settings({
        host: "localhost:8080",
        ssl: false,
    });
}

import * as functions from "firebase-functions/v1";
import {app} from "./api/app"

const LOCATION = "europe-west1";
const firestore = admin.firestore();


export const api = functions.region(LOCATION).https.onRequest(app);

// AUTH
export const authOnCreate = functions.region(LOCATION)
    .auth.user().onCreate(async (user) => {
        console.log(`Creating document for user ${user.uid}`);
        const userRef = firestore.collection("users").doc(user.uid);

        await userRef.set({
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            roles: ["USER"],
            createdAt: new Date(),
            have: [],
            want: [],
        });
    });

export const authOnDelete = functions.region(LOCATION)
    .auth.user().onDelete(async (user) => {
        console.log(`Deleting document for user ${user.uid}`);

        const userRef = firestore.collection("users").doc(user.uid);

        // Borrar la subcolección 'private'
        const privateRef = userRef.collection("private");
        const snapshot = await privateRef.get();

        // Eliminar todos los documentos dentro de la subcolección 'private'
        const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);

        // Borrar el documento principal del usuario
        await userRef.delete();

        console.log(`User ${user.uid} and 'private' subcollection deleted`);
    });

// MESSAGES
export const onCreateMessage = functions.region(LOCATION)
    .firestore.document("chats/{chatId}/messages/{messageId}")
    .onCreate(async (snap, context) => {
        const chatId = context.params.chatId;
        const chat = await firestore.collection("chats").doc(chatId).get();
        if (!chat.exists) {
            logger.warn("El chat " + chatId + " no existe");
            return;
        }

        const messageData = snap.data()
        const chatData = chat.data()

        if (!chatData) {
            logger.warn("El chat " + chatId + " no tiene datos");
            return;
        }

        await chat.ref.update({
            lastMessage: snap.data(),
            totalMessages: chatData.totalMessages ? chatData.totalMessages + 1 : 1,
            unreadBy: chatData.participants.filter((p: string) => p !== messageData.from)
        })
    })
