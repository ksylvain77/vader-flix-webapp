// Plex Token Service
const PLEX_TOKEN = 'KghtDhw7utRNszSA8k5n';

class PlexTokenService {
    static getToken() {
        return PLEX_TOKEN;
    }

    static getHeaders() {
        return {
            'X-Plex-Token': PLEX_TOKEN,
            'Accept': 'application/json'
        };
    }
}

export default PlexTokenService; 