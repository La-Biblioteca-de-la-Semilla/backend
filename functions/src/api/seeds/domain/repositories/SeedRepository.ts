import {Seed, SeedStatus} from "../Seed";

export interface SeedRepository {
    findAll(): Promise<Seed[]>;

    findAllByStatus(status: SeedStatus): Promise<Seed[]>;

    findById(id: string): Promise<Seed | null>;

    save(user: Seed): Promise<Seed>;

    delete(id: string): Promise<void>;

}