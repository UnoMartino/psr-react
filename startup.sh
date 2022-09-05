CONFIGURED="CONFIGURED"
if [ ! -e /data/$CONFIGURED ]; then
    echo "-- Container not configured --"
    sed -i 's/webbrowser.open(auth.url)/print(auth.url)/g' /usr/local/lib/python3.8/dist-packages/tekore/_auth/util.py
    python3 /data/backend.py configure $SPOTIFY_CLIENT_ID $SPOTIFY_CLIENT_SECRET
    touch /data/$CONFIGURED
else
    echo "-- Container configured --"
    python3 /data/backend.py $SPOTIFY_CLIENT_ID $SPOTIFY_CLIENT_SECRET $SPOTIFY_USERNAME $SPOTIFY_DESTINATION_PLAYLIST_ID $DB_HOST $DB_USER $DB_PASSWORD $DB_DATABASE $SPOTIFY_REJECTED_PLAYLIST_ID
fi
