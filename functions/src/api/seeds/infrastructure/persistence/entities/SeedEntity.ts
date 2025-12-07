export class SeedEntity {
    constructor(
        public id: string,
        public name: string,
        public species: string,
        public image: string,
        public owner: string,
        public description: string | null = null,
        public sentOn: string | null = null,
        public tags: string[] | null = null,
        public sow: number[] | null = null,
        public family: string | null = null,
        public sfgOriginal: number | null = null,
        public sfgMultisow: number | null = null,
        public sfgClump: number | null = null,
        public germinationMin: number | null = null,
        public germinationMax: number | null = null
    ) {
    }

    static fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot): SeedEntity {
        const data = snapshot.data() as any;

        return new SeedEntity(
            snapshot.id || "",
            data.name,
            data.species,
            data.image,
            data.owner,
            data.description ?? null,
            data.sentOn ?? null,
            data.tags ?? null,
            data.sow ?? null,
            data.family ?? null,
            data.sfgOriginal ?? null,
            data.sfgMultisow ?? null,
            data.sfgClump ?? null,
            data.germinationMin ?? null,
            data.germinationMax ?? null
        );
    }

    toFirestore(): Record<string, any> {
        return {
            name: this.name,
            species: this.species,
            image: this.image,
            owner: this.owner,
            description: this.description ?? null,
            sentOn: this.sentOn ?? null,
            tags: this.tags ?? null,
            sow: this.sow ?? null,
            family: this.family ?? null,
            sfgOriginal: this.sfgOriginal ?? null,
            sfgMultisow: this.sfgMultisow ?? null,
            sfgClump: this.sfgClump ?? null,
            germinationMin: this.germinationMin ?? null,
            germinationMax: this.germinationMax ?? null,
        };
    }
}
