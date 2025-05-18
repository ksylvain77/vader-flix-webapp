const axios = require('axios');
require('dotenv').config();

async function getPlexToken() {
    try {
        const response = await axios.post('https://plex.tv/users/sign_in.json', 
            `user[login]=${process.env.PLEX_USERNAME}&user[password]=${process.env.PLEX_PASSWORD}`,
            {
                headers: {
                    'X-Plex-Client-Identifier': 'vader-flix',
                    'X-Plex-Product': 'Vader Flix',
                    'X-Plex-Version': '1.0',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const token = response.data.user.authentication_token;
        console.log('Plex Token:', token);
        return token;
    } catch (error) {
        console.error('Error getting Plex token:', error.message);
        process.exit(1);
    }
}

getPlexToken(); 