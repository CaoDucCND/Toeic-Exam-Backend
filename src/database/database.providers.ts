import { DataSource } from 'typeorm';

export const DatabaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: 'db-mysql-sgp1-95439-do-user-13533061-0.b.db.ondigitalocean.com',
                port: 25060,
                username: 'duccao',
                password: 'AVNS_0DlAkoOltYDWD0wPDzX',
                database: 'toeic_exam',
                entities: [__dirname + '/../**/*{.ts,.js}'],
                migrations: ['src/migrations/*.ts', 'dist/migrations/*{.ts,.js}'],
                synchronize: false,
            });
            return dataSource.initialize();
        },
    },
];
