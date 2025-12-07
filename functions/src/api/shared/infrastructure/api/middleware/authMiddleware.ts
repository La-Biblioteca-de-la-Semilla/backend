import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email: string;
        roles: string[];
    };
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const token = authHeader.split("Bearer ")[1];
        admin.auth().verifyIdToken(token)
            .then(decodedToken => {
                // Obtener el usuario de Firestore para verificar sus roles
                admin.firestore().collection("users").doc(decodedToken.uid).get()
                    .then(userDoc => {
                        if (!userDoc.exists) {
                            res.status(404).json({ error: "User not found" });
                            return;
                        }

                        const userData = userDoc.data();

                        if (!userData) {
                            res.status(500).json({ error: "User data not found" });
                            return;
                        }

                        // Añadir el usuario al objeto request
                        (req as AuthenticatedRequest).user = {
                            uid: decodedToken.uid,
                            email: decodedToken.email || "",
                            roles: userData.roles || ["USER"]
                        };

                        next();
                    })
                    .catch(error => {
                        console.error("Firestore error:", error);
                        res.status(500).json({ error: "Database error" });
                    });
            })
            .catch(error => {
                console.error("Authentication error:", error);
                res.status(401).json({ error: "Invalid token" });
            });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Middleware para verificar roles
export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Verificar que el usuario está autenticado
        if (!(req as AuthenticatedRequest).user) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        const user = (req as AuthenticatedRequest).user;

        // Verificar que el usuario tiene los roles necesarios
        const hasRole = user?.roles.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            res.status(403).json({ 
                error: "Access denied. You don't have the required permissions." 
            });
            return;
        }

        next();
    };
};
