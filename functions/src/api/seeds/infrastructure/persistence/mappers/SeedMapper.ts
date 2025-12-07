import {Seed} from "../../../domain/Seed";
import {SeedEntity} from "../entities/SeedEntity";

export class SeedMapper {

    static toEntity(seed: Seed): SeedEntity {
        return new SeedEntity(
            seed.id,
            seed.name,
            seed.species,
            seed.image,
            seed.owner,
            seed.description,
            seed.sentOn,
            seed.tags,
            seed.sow,
            seed.family,
            seed.sfgOriginal,
            seed.sfgMultisow,
            seed.sfgClump,
            seed.germinationMin,
            seed.germinationMax
        );
    }

    static toDomain(seedEntity: SeedEntity): Seed {
        return new Seed(
            seedEntity.id,
            seedEntity.name,
            seedEntity.species,
            seedEntity.image,
            seedEntity.owner,
            seedEntity.description,
            seedEntity.sentOn,
            seedEntity.tags,
            seedEntity.sow,
            seedEntity.family,
            seedEntity.sfgOriginal,
            seedEntity.sfgMultisow,
            seedEntity.sfgClump,
            seedEntity.germinationMin,
            seedEntity.germinationMax
        );
    }
}