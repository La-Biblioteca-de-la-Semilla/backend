import {CacheService} from "../../../shared/application/CacheService";
import { QueryHandler } from "../../../shared/application/QueryHandler";
import { GetExchangeUsersQuery } from "./GetExchangeUsersQuery";
import {GetExchangeUsersQueryResult} from "./GetExchangeUsersQueryResult";
import { ExchangeUserProvider, MatchCriteria } from "../../domain/ExchangeUserProvider";
import { BASE_EXCHANGES_CACHE_KEY } from "../../config/CacheKeys";

export class GetExchangeUsersQueryHandler implements QueryHandler<GetExchangeUsersQuery, GetExchangeUsersQueryResult[]> {
    constructor(
        private readonly exchangeUserProvider: ExchangeUserProvider,
        private readonly cacheService: CacheService
    ) {}

    async handle(query: GetExchangeUsersQuery): Promise<GetExchangeUsersQueryResult[]> {

        const cacheKey = `${BASE_EXCHANGES_CACHE_KEY}_${query.userId}_${query.seedFilter || "all"}`
        const cachedResult = this.cacheService.get(cacheKey)
        if(cachedResult) {
            return cachedResult as GetExchangeUsersQueryResult[];
        }


        const currentUser = await this.exchangeUserProvider.getCurrentUser(query.userId);
        if (!currentUser) {
            throw new Error("Usuario no encontrado");
        }
        const matchCriteria: MatchCriteria = {
            wantSeeds: currentUser.want || [],
            haveSeeds: currentUser.have || [],
            seedFilter: query.seedFilter
        };
        
        const potentialUsers = await this.exchangeUserProvider.findMatchingUsers(
            matchCriteria,
            currentUser.id,
            20
        );

        const matchingUsers = potentialUsers.map(otherUser => {
            const wantHaveMatches = (currentUser.want || []).filter(item => (otherUser.have || []).includes(item)).length;
            const haveWantMatches = (currentUser.have || []).filter(item => (otherUser.want || []).includes(item)).length;
            const totalMatches = wantHaveMatches + haveWantMatches;

            return {
                id: otherUser.id,
                name: otherUser.name,
                image: otherUser.image,
                wantHaveMatches,
                haveWantMatches,
                totalMatches
            };
        })
            .filter(user => user.totalMatches > 0)
            .sort((a, b) => b.totalMatches - a.totalMatches)
            .slice(0, 9);  // Limitamos a 9 resultados

        this.cacheService.set(cacheKey, matchingUsers);

        return matchingUsers;
    }
}