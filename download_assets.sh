#!/bin/bash

# Create directories if they don't exist
mkdir -p img sounds

# Download existing assets
curl -o img/counter.gif "https://web.archive.org/web/20090830075223if_/http://geocities.com/Area51/Corridor/5177/counter.gif"
curl -o img/netscape.gif "https://web.archive.org/web/20090829130231if_/http://geocities.com/Hollywood/Hills/8944/images/netscape.gif"
curl -o img/ie.gif "https://web.archive.org/web/20090830075223if_/http://geocities.com/Area51/Corridor/5177/ie.gif"
curl -o img/construction.gif "https://web.archive.org/web/20090830075223if_/http://geocities.com/Area51/Corridor/5177/construction.gif"
curl -o img/basketball.gif "https://web.archive.org/web/20090830075223if_/http://geocities.com/Area51/Corridor/5177/basketball.gif"
curl -o img/stars.gif "https://web.archive.org/web/20090830075223if_/http://geocities.com/Area51/Corridor/5177/stars.gif"

# Download NBA Jam sound effects
curl -o sounds/boomshakalaka.mp3 "https://archive.org/download/nba-jam-sfx/boomshakalaka.mp3"
curl -o sounds/heating-up.mp3 "https://archive.org/download/nba-jam-sfx/heating-up.mp3"
curl -o sounds/on-fire.mp3 "https://archive.org/download/nba-jam-sfx/on-fire.mp3"
curl -o sounds/rejected.mp3 "https://archive.org/download/nba-jam-sfx/rejected.mp3"
curl -o sounds/click.mp3 "https://archive.org/download/nba-jam-sfx/click.mp3"

# Download player sprite
curl -o img/player-sprite.png "https://archive.org/download/nba-jam-sprites/player-sprite.png"

# Make the script executable
chmod +x download_assets.sh 