const bcrypt = require('bcryptjs');

const users = [
    { username: 'vader', password: 'imperial123' },
    { username: 'tarkin', password: 'deathstar456' },
    { username: 'thrawn', password: 'art789' },
    { username: 'piett', password: 'admiral123' },
    { username: 'veers', password: 'at-at456' }
];

async function generateHashes() {
    for (const user of users) {
        const hash = await bcrypt.hash(user.password, 10);
        console.log(`${user.username}: ${hash}`);
    }
}

generateHashes(); 