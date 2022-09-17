CONFIGURED="CONFIGURED"
if [ ! -e /data/$CONFIGURED ]; then
    echo "-- Container not configured --"
    sed -i 's/webbrowser.open(auth.url)/print(auth.url)/g' /usr/local/lib/python3.8/dist-packages/tekore/_auth/util.py
    python3 /data/backend.py configure $SPOTIFY_CLIENT_ID $SPOTIFY_CLIENT_SECRET $SPOTIFY_USERNAME $SPOTIFY_REVIEW_PLAYLIST_ID $DB_HOST $DB_USER $DB_PASSWORD $DB_DATABASE $SPOTIFY_REJECTED_PLAYLIST_ID $SPOTIFY_BLACKLIST_SONGS_PLAYLIST_ID $SPOTIFY_BLACKLIST_ARTISTS_PLAYLIST_ID $SPOTIFY_WHITELIST_SONGS_PLAYLIST_ID $SPOTIFY_WHITELIST_ARTISTS_PLAYLIST_ID $SPOTIFY_QUEUE_PLAYLIST_ID
    touch /data/$CONFIGURED
else
    echo "-- Container configured --"
    gunicorn -w 9 backend:app
fi
