const { Route, PassType } = require('./models');

async function seed() {
    try {
        await Route.bulkCreate([
            { source: 'Downtown', destination: 'University Campus', distance: 12.5, basePrice: 50 },
            { source: 'North Station', destination: 'City Center', distance: 8.0, basePrice: 30 },
            { source: 'East Side', destination: 'West End', distance: 20.0, basePrice: 80 }
        ]);

        await PassType.bulkCreate([
            { name: 'Monthly', durationDays: 30, multiplier: 1.0 },
            { name: 'Quarterly', durationDays: 90, multiplier: 2.5 },
            { name: 'Yearly', durationDays: 365, multiplier: 9.0 }
        ]);

        console.log('Database seeded with Routes and Pass Types.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
