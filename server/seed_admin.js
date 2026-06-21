const bcrypt = require('bcrypt');
const { User } = require('./models');

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'System Admin',
            email: 'admin@buspass.com',
            password: hashedPassword,
            phone: '1234567890',
            role: 'admin'
        });
        console.log('Admin user created: admin@buspass.com / admin123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();
