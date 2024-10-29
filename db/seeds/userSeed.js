const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');  // Path to your User model
const Permission = require('../models/permission');  // Path to your Permission model

// Seed Data function
async function userSeed() {
    try {
        // 1. Create or update permissions
        const permissionsData = [
            { name: 'user-list', module_name: 'panel', description: 'Permission to read user' },
            { name: 'user-create', module_name: 'panel', description: 'Permission to create user' },
            { name: 'user-update', module_name: 'panel', description: 'Permission to update user' },
            { name: 'user-delete', module_name: 'panel', description: 'Permission to delete user' }
        ];

        const createdPermissions = [];

        for (let perm of permissionsData) {
            const permission = await Permission.findOneAndUpdate(
                { name: perm.name }, // Find by unique name
                perm,                // Data to insert/update
                { upsert: true, new: true, setDefaultsOnInsert: true }  // Create if not found
            );
            createdPermissions.push(permission);
        }

        console.log('Permissions seeded:', createdPermissions);

        // 2. Hash a sample password
        const password = await bcrypt.hash('password123', 10);

        // 3. Create or update users with permissions
        const usersData = [
            {
                name: 'Admin',
                email: 'admin@dg.com',
                password: password,
                permissions: createdPermissions.map(p => p.name)  // Assign all permissions to admin
            },
            {
                name: 'Manager',
                email: 'manager@dg.com',
                password: password,
                permissions: [createdPermissions[0].name]  // Assign 'user-list' permission to manager
            }
        ];

        for (let userData of usersData) {
            await User.findOneAndUpdate(
                { email: userData.email },  // Find by unique email
                userData,                   // Data to insert/update
                { upsert: true, new: true, setDefaultsOnInsert: true }  // Create if not found
            );
        }

        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();  // Close the connection
    }
}

// Ensure the function runs
(async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    await userSeed();  // Call the seed function
})();
