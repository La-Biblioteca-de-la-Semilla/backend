import {ExchangeUser} from "./ExchangeUser";

export interface MatchCriteria {
    wantSeeds?: string[];
    haveSeeds?: string[];
    seedFilter?: string;
}

export interface ExchangeUserProvider {
    getCurrentUser(userId: string): Promise<ExchangeUser | null>;
    findMatchingUsers(criteria: MatchCriteria, excludeUserId: string, limit?: number): Promise<ExchangeUser[]>;
}