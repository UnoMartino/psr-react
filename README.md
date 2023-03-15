# Radio Song Requester
### Radio Song Requester lets the user see what is played on the radio at the moment and allows user to request their song to be played next. Integration with Spotify and lyrics database guarantees quick and automated request verification.

## Functions
- Lyrics local cache
- Admin panel
- Custom message on homepage
- Responsive mobile design
- Blacklist and whitelist songs and artists

## Screenshots

<img src="https://user-images.githubusercontent.com/69631058/191817413-41bd70d7-c531-4cb9-b2e2-80a87b054f73.png" alt="App" width=600>
<img src="https://user-images.githubusercontent.com/69631058/191818252-1619cb46-6646-4a22-ba3f-b3f5815c425d.png" alt="App" width=600>


## Installation
1. `git clone https://github.com/UnoMartino/radio-song-requester`
2. `cd radio-song-requester`
3. Edit the `.env` file
4. `docker-compose run --rm radio-song-requester-backend sh startup.sh`
5. If you configured `.env` file correctly, you will be given a link, which authorizes you with Spotify.
6. Paste the response URL from your browser's address bar.
7. `docker-compose up -d`
8. Setup your reverse proxy in the way that `/api` points to the `BACKEND_PORT` and `/` points to `APP_PORT`

Sample configuration with Nginx Proxy Manager:  
<img src="https://user-images.githubusercontent.com/69631058/191816610-cd8b2052-dd21-436d-87db-db79976e9cc4.png" alt="Nginx" width=400>  
<img src="https://user-images.githubusercontent.com/69631058/191816683-1aacea43-f37f-4470-83c9-64140a0f1dfb.png" alt="Nginx" width=400>  

## `.env` file
```
SPOTIFY_CLIENT_ID=""                # Spotify client ID
SPOTIFY_CLIENT_SECRET=""            # Spotify client secret
SPOTIFY_USERNAME=""                 # Spotify username
SPOTIFY_REVIEW_PLAYLIST_ID=""       # Spotify review playlist ID
SPOTIFY_REJECTED_PLAYLIST_ID=""     # Spotify rejected playlist ID
SPOTIFY_BLACKLIST_SONGS_PLAYLIST_ID=""      # Spotify blacklist songs playlist ID
SPOTIFY_BLACKLIST_ARTISTS_PLAYLIST_ID=""    # Spotify blacklist artists playlist ID
SPOTIFY_WHITELIST_SONGS_PLAYLIST_ID=""      # Spotify whitelist songs playlist ID
SPOTIFY_WHITELIST_ARTISTS_PLAYLIST_ID=""    # Spotify whitelist artists playlist ID
SPOTIFY_QUEUE_PLAYLIST_ID=""                # Spotify queue playlist ID

DB_HOST=""                      # Database host
DB_USER=""                      # Database user
DB_PASSWORD=""                  # Database password
# DB_DATABASE="spotify"         # Database name

BACKEND_PORT=8072                       # Port to run the backend server on
APP_PORT=8073                           # Port to run the app server on
```

| Variable          | Description                                                                        | 
| ----------------- | -----------------------------------------------------------------------------------|
| SPOTIFY_CLIENT_ID | Spotify OAuth Client ID from [developer.spotify.com](https://developer.spotify.com)|
| SPOTIFY_CLIENT_SECRET | Spotify OAuth Client Secret from [developer.spotify.com](https://developer.spotify.com) |
| SPOTIFY_USERNAME | Username of the account with playlists |
| SPOTIFY_REVIEW_PLAYLIST_ID | Playlist, where all accepted songs by the app will be appended to |
| SPOTIFY_REJECTED_PLAYLIST_ID | Playlist, where songs that were rejected by the app (text or blacklist) will be appended to - think of it as log playlist |
| SPOTIFY_BLACKLIST_SONGS_PLAYLIST_ID | Songs added to this playlist will not be accepted by the app |
| SPOTIFY_BLACKLIST_ARTISTS_PLAYLIST_ID | Artists, whose songs are added to this playlist will not be accepted by the app | 
| SPOTIFY_WHITELIST_SONGS_PLAYLIST_ID | Songs added to this playlist will be accepted by the app automatically, without any checks |
| SPOTIFY_WHITELIST_ARTISTS_PLAYLIST_ID | Artists, whose songs are added to this playlist will be accepted by the app automatically, without any checks |
| SPOTIFY_QUEUE_PLAYLIST_ID | If a song is on this playlist, the app will display a message to a user that the song is already in queue. It is meant to be used like that: <ul><li> Song is accepted by the app and added to review playlist </li> <li> Song is additionaly manually reviewed by admin and after that added to this playlist </li><li> After the song is played, an operator removes a song from this playlist, automatically unlocking the possibility for the user to add it via the app </li> |
| DB_HOST | Database hostname or IP address | 
| DB_USER | Database user | 
| DB_PASSWORD | Database password |
| DB_DATABASE | (optional) Name of the database used for the app (default value: spotify) |
| BACKEND_PORT | (optional) Port used for the API backend (default value: 8072) |
| APP_PORT | (optional) Port used for frontend (default value: 8073) |

## Additional information
The software is provided "as is", without any warranty and it's licensed under GNU General Public License version 3.

DockerHub: 
- Frontend: [https://hub.docker.com/r/unomartino/radio-song-requester-web](https://hub.docker.com/r/unomartino/radio-song-requester-web)
- Backend: [https://hub.docker.com/r/unomartino/radio-song-requester-backend](https://hub.docker.com/r/unomartino/radio-song-requester-backend)
