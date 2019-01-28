module.exports = {
    connection: 'Mysqladapter',
    attributes: {
        id: {
            type: "integer",
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: "longtext"
        },
        country: {
            type: "string"
        },
        number: {
            type: "string"
        },
        volume: {
            type: "string"
        },
        year: {
            type: "string"
        },
        journal: {
            type: "string"
        },
        editorial: {
            type: "string"
        },
        abstract: {
            type: "longtext"
        },
        issns: {
            type: "string"
        },
        language: {
            type: "string"
        },
        keywords: {
            type: "string"
        },
        link: {
            type: "longtext"
        },
        authores: {
            type: "string"
        },
        category: {
            type: "string"
        },
        pages: {
            type: "string"
        },
        notas: {
            type: "longtext"
        },
        files: {
            collection: 'File',
            via: 'fkIdArticulo'
        },
        fkIdUser: {
            model: 'User'
        }
    }
};
