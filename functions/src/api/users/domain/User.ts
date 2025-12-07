export class User {
    constructor(
        public readonly id: string,
        public name: string,
        public image: string,
        public readonly roles: string[],
        public have: string[],
        public want: string[],
        public offer: string[]
    ){
    }

    update(updates: Partial<Omit<User, "id" | "roles">>) {
        this.name = updates.name ?? this.name;
        this.image = updates.image ?? this.image;
        this.have = updates.have ?? this.have;
        this.want = updates.want ?? this.want;
        this.offer = updates.offer ?? this.offer;
    }
}