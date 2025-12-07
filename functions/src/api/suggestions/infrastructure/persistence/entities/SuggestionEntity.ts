export class SuggestionEntity {
    constructor(
        public id: string,
        public seedId: string,
        public organizationId: string,
        public createdAt: Date,
        public createdBy: string,
        public status: string,
        public name: string | null = null,
        public species: string | null = null,
        public image: string | null = null,
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
    ) {}

    static fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot): SuggestionEntity {
        const data = snapshot.data();
        if (!data) {
            throw new Error("Document data is undefined");
        }

        return new SuggestionEntity(
            snapshot.id,
            data.seedId,
            data.organizationId || null,
            data.createdAt.toDate(),
            data.createdBy,
            data.status,
            data.name || null,
            data.species || null,
            data.image || null,
            data.description || null,
            data.sentOn || null,
            data.tags || null,
            data.sow || null,
            data.family || null,
            data.sfgOriginal || null,
            data.sfgMultisow || null,
            data.sfgClump || null,
            data.germinationMin || null,
            data.germinationMax || null
        );
    }

    toFirestore(): Record<string, unknown> {
        return {
            seedId: this.seedId,
            organizationId: this.organizationId,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            status: this.status,
            name: this.name,
            species: this.species,
            image: this.image,
            description: this.description,
            sentOn: this.sentOn,
            tags: this.tags,
            sow: this.sow,
            family: this.family,
            sfgOriginal: this.sfgOriginal,
            sfgMultisow: this.sfgMultisow,
            sfgClump: this.sfgClump,
            germinationMin: this.germinationMin,
            germinationMax: this.germinationMax
        };
    }
}