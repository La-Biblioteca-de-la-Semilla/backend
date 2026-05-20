export type SeedStatus = "draft" | "published";

export class Seed {
    constructor(
        public readonly id: string,
        public name: string,
        public species: string,
        public image: string,
        public readonly owner: string,
        public description: string | null = null,
        public sentOn: string | null = null,
        public tags: string[] | null = null,
        public sow: number[] | null = null,
        public family: string | null = null,
        public sfgOriginal: number | null = null,
        public sfgMultisow: number | null = null,
        public sfgClump: number | null = null,
        public germinationMin: number | null = null,
        public germinationMax: number | null = null,
        public status: SeedStatus = "draft"
    ) {
    }
    public publish(): void {
        this.status = "published";
    }
    public update(data: Partial<Omit<Seed, "id" | "status">>) {
        this.name = data.name ?? this.name;
        this.species = data.species ?? this.species;
        this.image = data.image ?? this.image;
        this.description = data.description ?? this.description;
        this.sentOn = data.sentOn ?? this.sentOn;
        this.tags = data.tags ?? this.tags;
        this.sow = data.sow ?? this.sow;
        this.family = data.family ?? this.family;
        this.sfgOriginal = data.sfgOriginal ?? this.sfgOriginal;
        this.sfgMultisow = data.sfgMultisow ?? this.sfgMultisow;
        this.sfgClump = data.sfgClump ?? this.sfgClump;
        this.germinationMin = data.germinationMin ?? this.germinationMin;
        this.germinationMax = data.germinationMax ?? this.germinationMax;
    }
}
