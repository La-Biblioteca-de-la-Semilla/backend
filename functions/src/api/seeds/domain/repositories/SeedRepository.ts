import {Seed} from "../Seed";

export interface SeedRepository {
    findAll(): Promise<Seed[]>;

    findById(id: string): Promise<Seed | null>;

    save(user: Seed): Promise<Seed>;

    delete(id: string): Promise<void>;

}