import {Seed} from "../Seed";
import {SeedFilters} from "../../application/list/SeedFilters";

export interface PaginatedSeeds {
    seeds: Seed[];
    total: number;
}

export interface SeedRepository {
    findAll(): Promise<Seed[]>;

    findByFilters(filters: SeedFilters, page?: number, limit?: number): Promise<PaginatedSeeds>;

    findById(id: string): Promise<Seed | null>;

    save(user: Seed): Promise<Seed>;

    delete(id: string): Promise<void>;

}