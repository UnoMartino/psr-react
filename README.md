# radio-song-requester
## STILL WORK IN PROGRESS (Not ready for use)
### Radio Song Requester pozwala zobaczyć, co jest aktualnie grane w radiowęźle, oraz umożliwia zaproponowanie następnych piosenek. Integracja ze Spotify i serwisem Tekstowo.pl zapewnia szybką i zautomatyzowaną weryfikację zgłoszeń.

## Installation
1. `git clone https://github.com/UnoMartino/radio-song-requester`
2. Edit the `.env` file
3. `docker-compose run --rm radio-song-requester-backend sh startup.sh`
4. If you configured `.env` file correctly, you will be given a link, which authorizes you with Spotify.
5. Paste the response URL from your browser's address bar.
6. `docker-compose up -d`
