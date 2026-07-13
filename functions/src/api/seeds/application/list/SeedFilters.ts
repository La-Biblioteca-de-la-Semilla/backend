import {SeedStatus} from "../../domain/Seed";

export interface SeedFilters {
    status?: SeedStatus;
    search?: string;
    tags?: string[];
    sentOn?: string;
    family?: string;
    userHaveIds?: string[];
    userWantIds?: string[];
    sowing?: number[];
    ownerIds?: string[];
}
