/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    pgm.createType("seed_status", ["draft", "published"]);

    pgm.createTable("seeds", {
        id: {
            type: "text",
            primaryKey: true,
        },
        name: {
            type: "text",
            notNull: true,
        },
        species: {
            type: "text",
            notNull: true,
        },
        image: {
            type: "text",
            notNull: true,
        },
        owner: {
            type: "text",
            notNull: true,
        },
        description: {
            type: "text",
        },
        sent_on: {
            type: "text",
        },
        tags: {
            type: "text[]",
        },
        sow: {
            type: "integer[]",
        },
        family: {
            type: "text",
        },
        sfg_original: {
            type: "numeric",
        },
        sfg_multisow: {
            type: "numeric",
        },
        sfg_clump: {
            type: "numeric",
        },
        germination_min: {
            type: "integer",
        },
        germination_max: {
            type: "integer",
        },
        status: {
            type: "seed_status",
            notNull: true,
            default: "draft",
        },
        user_have_ids: {
            type: "text[]",
        },
        user_want_ids: {
            type: "text[]",
        },
    });

    pgm.createIndex("seeds", "owner");
    pgm.createIndex("seeds", "status");
    pgm.createIndex("seeds", "family");
    pgm.createIndex("seeds", "sent_on");
    pgm.createIndex("seeds", "tags", {method: "gin"});
    pgm.createIndex("seeds", "sow", {method: "gin"});
    pgm.createIndex("seeds", "user_have_ids", {method: "gin"});
    pgm.createIndex("seeds", "user_want_ids", {method: "gin"});
};

exports.down = (pgm) => {
    pgm.dropTable("seeds");
    pgm.dropType("seed_status");
};
