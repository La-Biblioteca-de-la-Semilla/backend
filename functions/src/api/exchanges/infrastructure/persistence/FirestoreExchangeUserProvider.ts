import * as admin from "firebase-admin";
import { ExchangeUserProvider, MatchCriteria } from "../../domain/ExchangeUserProvider";
import {ExchangeUser} from "../../domain/ExchangeUser";

export class FirestoreExchangeUserProvider implements ExchangeUserProvider {
    private db = admin.firestore().collection("users");

    async getCurrentUser(userId: string): Promise<ExchangeUser | null> {
        const snapshot = await this.db.doc(userId).get();
        if (!snapshot.exists) return null;
        
        const userData = snapshot.data();
        if (!userData) return null;

        return {
            id: snapshot.id,
            name: userData.displayName || userData.name || "",
            image: userData.image || "",
            want: userData.want || [],
            have: userData.have || []
        };
    }

    async findMatchingUsers(criteria: MatchCriteria, excludeUserId: string, limit = 9): Promise<ExchangeUser[]> {
        const batchSize = 10;
        const matchingUsers: ExchangeUser[] = [];

        if (criteria.seedFilter) {
            const usersWithSeed = await this.db
                .where("have", "array-contains", criteria.seedFilter)
                .limit(limit * 3) // Aumentamos el límite porque vamos a filtrar después
                .get();
                
            // Filtrar manualmente el ID de usuario excluido
            const filteredDocs = usersWithSeed.docs.filter(doc => doc.id !== excludeUserId);
            
            for (const doc of filteredDocs) {
                const data = doc.data();
                matchingUsers.push({
                    id: doc.id,
                    name: data.displayName || data.name || "",
                    image: data.image || "",
                    want: data.want || [],
                    have: data.have || []
                });
            }

            if (matchingUsers.length >= limit) {
                return matchingUsers.slice(0, limit);
            }
        }

        if (criteria.wantSeeds && criteria.wantSeeds.length > 0) {
            for (let i = 0; i < criteria.wantSeeds.length; i += batchSize) {
                const batch = criteria.wantSeeds.slice(i, i + batchSize);

                for (const seed of batch) {
                    const usersWithSeed = await this.db
                        .where("have", "array-contains", seed)
                        .limit(limit * 2)
                        .get();
                    
                    // Filtrar manualmente el ID de usuario excluido
                    const filteredDocs = usersWithSeed.docs.filter(doc => doc.id !== excludeUserId);
                    
                    for (const doc of filteredDocs) {
                        if (!matchingUsers.some(u => u.id === doc.id)) {
                            const data = doc.data();
                            matchingUsers.push({
                                id: doc.id,
                                name: data.displayName || data.name || "",
                                image: data.image || "",
                                want: data.want || [],
                                have: data.have || []
                            });
                        }
                        if (matchingUsers.length >= limit * 2) {
                            break;
                        }
                    }
                    
                    if (matchingUsers.length >= limit * 2) {
                        break;
                    }
                }
                
                if (matchingUsers.length >= limit * 2) {
                    break;
                }
            }
        }
        
        if (matchingUsers.length < limit * 2 && criteria.haveSeeds && criteria.haveSeeds.length > 0) {
            for (let i = 0; i < criteria.haveSeeds.length; i += batchSize) {
                const batch = criteria.haveSeeds.slice(i, i + batchSize);
                
                for (const seed of batch) {
                    const usersWantingSeed = await this.db
                        .where("want", "array-contains", seed)
                        .limit(limit * 2)
                        .get();
                    
                    // Filtrar manualmente el ID de usuario excluido
                    const filteredDocs = usersWantingSeed.docs.filter(doc => doc.id !== excludeUserId);
                    
                    for (const doc of filteredDocs) {
                        if (!matchingUsers.some(u => u.id === doc.id)) {
                            const data = doc.data();
                            matchingUsers.push({
                                id: doc.id,
                                name: data.displayName || data.name || "",
                                image: data.image || "",
                                want: data.want || [],
                                have: data.have || []
                            });
                        }
                        if (matchingUsers.length >= limit * 2) {
                            break;
                        }
                    }
                    if (matchingUsers.length >= limit * 2) {
                        break;
                    }
                }
                if (matchingUsers.length >= limit * 2) {
                    break;
                }
            }
        }
        return matchingUsers;
    }
}