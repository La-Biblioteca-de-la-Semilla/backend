import {Seed, SeedStatus} from "../Seed";

export interface PaginatedSeeds {
    seeds: Seed[];
    total: number;
}

export interface SeedRepository {
    findAll(): Promise<Seed[]>;

    findAllByStatus(status: SeedStatus): Promise<Seed[]>;

    findByStatusPaginated(status: SeedStatus, page: number, limit: number, ownerIds?: string[]): Promise<PaginatedSeeds>;

    findById(id: string): Promise<Seed | null>;

    save(user: Seed): Promise<Seed>;

    delete(id: string): Promise<void>;

}