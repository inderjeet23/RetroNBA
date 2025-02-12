// NBA API endpoints
const ESPN_API = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
const NBA_API = 'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json';
const NBA_BOXSCORE_API = 'https://cdn.nba.com/static/json/liveData/boxscore/boxscore_';

// Team logos mapping (since the API doesn't provide logos)
const teamLogos = {
    'ATL': 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg',
    'BOS': 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
    'BKN': 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
    'CHA': 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg',
    'CHI': 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg',
    'CLE': 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg',
    'DAL': 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
    'DEN': 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
    'DET': 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg',
    'GSW': 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
    'HOU': 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg',
    'IND': 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg',
    'LAC': 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg',
    'LAL': 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'MEM': 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg',
    'MIA': 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
    'MIL': 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
    'MIN': 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg',
    'NOP': 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg',
    'NY': 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
    'OKC': 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg',
    'ORL': 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg',
    'PHI': 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
    'PHX': 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
    'POR': 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg',
    'SAC': 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg',
    'SAS': 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg',
    'TOR': 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
    'UTA': 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg',
    'WAS': 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg'
};

// Player sprite mapping (placeholder URLs - you'll need to add actual sprite images)
const playerSprites = {
    default: 'img/player-sprite.png'
};

// Get current date in YYYYMMDD format
const getCurrentDate = () => {
    const date = new Date();
    // Convert to EST/EDT
    const estDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    // Format date components
    const year = estDate.getFullYear();
    const month = String(estDate.getMonth() + 1).padStart(2, '0');
    const day = String(estDate.getDate()).padStart(2, '0');
    
    // Log the date being used
    console.log('Date components:', {
        year,
        month,
        day,
        fullDate: `${year}${month}${day}`,
        originalDate: date,
        estDate: estDate
    });
    
    return `${year}${month}${day}`;
};

// Get yesterday's date in YYYYMMDD format
const getYesterdayDate = () => {
    const date = new Date();
    // Convert to EST/EDT
    const estDate = new Date(date.toLocaleString("en-US", {timeZone: "America/New_York"}));
    // Subtract one day
    estDate.setDate(estDate.getDate() - 1);
    
    // Format date components
    const year = estDate.getFullYear();
    const month = String(estDate.getMonth() + 1).padStart(2, '0');
    const day = String(estDate.getDate()).padStart(2, '0');
    
    return `${year}${month}${day}`;
};

// Format date for API in YYYYMMDD format
const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};

// Transform ESPN data to our format with detailed logging
const transformGameData = (event) => {
    const competition = event.competitions[0];
    const gameState = event.status.type.id;
    
    // Find home and away teams
    const homeTeam = competition.competitors.find(team => team.homeAway === 'home');
    const awayTeam = competition.competitors.find(team => team.homeAway === 'away');
    
    // Log competition data
    console.log('\nCompetition Data:', {
        id: competition.id,
        status: competition.status,
        competitors: competition.competitors,
        hasDetailedState: !!competition.status,
        statusType: competition.status?.type
    });
    
    // Log raw team data before any processing
    console.log('\nRaw Team Data:', {
        gameId: event.id,
        homeTeam: {
            name: homeTeam.team.name,
            rawScore: homeTeam.score,
            scoreType: typeof homeTeam.score,
            hasScoreProperty: 'score' in homeTeam,
            fullTeamData: homeTeam,
            allProperties: Object.keys(homeTeam)
        },
        awayTeam: {
            name: awayTeam.team.name,
            rawScore: awayTeam.score,
            scoreType: typeof awayTeam.score,
            hasScoreProperty: 'score' in awayTeam,
            fullTeamData: awayTeam,
            allProperties: Object.keys(awayTeam)
        }
    });

    // Enhanced score logging
    console.log('\nDetailed Score Analysis:', {
        gameId: event.id,
        status: {
            state: event.status.type.id,
            detail: event.status.type.detail,
            description: event.status.type.description
        },
        homeTeam: {
            name: homeTeam.team.name,
            score: homeTeam.score,
            scoreType: typeof homeTeam.score,
            hasScore: 'score' in homeTeam,
            linescores: homeTeam.linescores,
            statistics: homeTeam.statistics,
            allKeys: Object.keys(homeTeam)
        },
        awayTeam: {
            name: awayTeam.team.name,
            score: awayTeam.score,
            scoreType: typeof awayTeam.score,
            hasScore: 'score' in awayTeam,
            linescores: awayTeam.linescores,
            statistics: awayTeam.statistics,
            allKeys: Object.keys(awayTeam)
        },
        competition: {
            id: competition.id,
            status: competition.status,
            statusType: competition.status?.type,
            hasDetailedState: !!competition.status,
            allKeys: Object.keys(competition)
        }
    });

    // Score validation and parsing with enhanced logging
    let homeScore = 0;
    let awayScore = 0;

    // Process scores for all game states
    if ('score' in homeTeam) {
        const parsedScore = parseInt(homeTeam.score);
        console.log('Processing home score:', {
            team: homeTeam.team.name,
            rawScore: homeTeam.score,
            parsedScore: parsedScore,
            isValid: !isNaN(parsedScore),
            gameState: gameState,
            hasLinescores: Array.isArray(homeTeam.linescores),
            linescore: homeTeam.linescores
        });
        homeScore = !isNaN(parsedScore) ? parsedScore : 0;
    }

    if ('score' in awayTeam) {
        const parsedScore = parseInt(awayTeam.score);
        console.log('Processing away score:', {
            team: awayTeam.team.name,
            rawScore: awayTeam.score,
            parsedScore: parsedScore,
            isValid: !isNaN(parsedScore),
            gameState: gameState,
            hasLinescores: Array.isArray(awayTeam.linescores),
            linescore: awayTeam.linescores
        });
        awayScore = !isNaN(parsedScore) ? parsedScore : 0;
    }

    // Log final processed scores
    console.log('Final processed scores:', {
        gameId: event.id,
        status: gameState,
        statusDetail: event.status.type.detail,
        homeTeam: homeTeam.team.name,
        homeScore: homeScore,
        homeLinescores: homeTeam.linescores,
        awayTeam: awayTeam.team.name,
        awayScore: awayScore,
        awayLinescores: awayTeam.linescores,
        period: competition.status.period,
        clock: competition.status.displayClock
    });

    return {
        id: event.id,
        homeTeam: {
            teamTricode: homeTeam.team.abbreviation,
            teamName: homeTeam.team.name,
            score: homeScore,
            statistics: homeTeam.statistics || [],
            linescores: homeTeam.linescores || []
        },
        awayTeam: {
            teamTricode: awayTeam.team.abbreviation,
            teamName: awayTeam.team.name,
            score: awayScore,
            statistics: awayTeam.statistics || [],
            linescores: awayTeam.linescores || []
        },
        gameStatus: gameState === "2" ? 2 : (gameState === "3" ? 3 : 1),
        gameStatusText: event.status.type.shortDetail,
        period: competition.status.period,
        clock: competition.status.displayClock,
        gameTimeUTC: event.date,
        date: getCurrentDate()
    };
};

// Fetch games for a specific date
const fetchGames = async (date = getCurrentDate()) => {
    try {
        console.log('\n=== Fetching games for date:', date, '===');
        
        // Validate date format
        if (!/^\d{8}$/.test(date)) {
            throw new Error(`Invalid date format: ${date}. Expected YYYYMMDD`);
        }
        
        // Log the URL being fetched
        const url = `${ESPN_API}?date=${date}`;
        console.log('Fetching URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('\nAPI Response Summary:', {
            totalEvents: data.events?.length || 0,
            date: data.day?.date,
            season: data.season?.year,
            requestedDate: date,
            currentDate: new Date().toISOString()
        });
        
        const events = data.events || [];
        if (events.length === 0) {
            console.log('No games found for date:', date);
            return [];
        }

        // Transform and log each game
        return events.map(event => {
            console.log('\n=== Processing Game ===');
            console.log('Game ID:', event.id);
            console.log('Status:', event.status?.type?.state);
            console.log('Game Time:', event.date);
            return transformGameData(event);
        });

    } catch (error) {
        console.error('Error fetching games:', {
            message: error.message,
            stack: error.stack,
            date: date,
            currentDate: new Date().toISOString()
        });
        throw error;
    }
};

// Fetch team standings
const fetchStandings = async () => {
    try {
        const response = await fetch(`${NBA_API_BASE}/standings?per_page=30`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Standings API Response:', data);
        return data.data;
    } catch (error) {
        console.error('Error fetching standings:', error);
        return [];
    }
};

// Get team seed from standings
const getTeamSeed = (teamId, standings) => {
    const team = standings.find(team => team.team.id === teamId);
    if (!team) return '';
    return team.conference_rank;
};

// Helper function to format game time and status
const formatGameTime = (game) => {
    if (game.gameStatus === 3) {
        return 'Final';
    }
    
    if (game.gameStatus === 2) {
        return game.gameStatusText;
    }
    
    // For scheduled games, show local time
    const gameTime = new Date(game.gameTimeUTC);
    return gameTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });
};

// Create game row HTML
const createGameRow = (game) => {
    const homeTeam = game.homeTeam;
    const awayTeam = game.awayTeam;
    const gameTimeInfo = formatGameTime(game);
    
    // Ensure scores are numbers and default to 0 if undefined
    const homeScore = typeof homeTeam.score === 'number' ? homeTeam.score : 0;
    const awayScore = typeof awayTeam.score === 'number' ? awayTeam.score : 0;
    
    // Determine game status class
    let statusClass = 'game-status-scheduled';
    if (game.gameStatus === 2) {
        statusClass = 'game-status-live';
    } else if (game.gameStatus === 3) {
        statusClass = 'game-status-final';
    }
    
    return `
        <tr class="game-row" data-game-id="${game.id}">
            <td>
                <span class="game-time ${statusClass}">${gameTimeInfo}</span>
            </td>
            <td>
                <div class="team-cell">
                    <img src="${teamLogos[awayTeam.teamTricode]}" 
                         alt="${awayTeam.teamName}" 
                         title="${awayTeam.teamName}">
                    <span class="team-name">${awayTeam.teamName}</span>
                </div>
            </td>
            <td class="score-cell">${awayScore}</td>
            <td>@</td>
            <td>
                <div class="team-cell">
                    <img src="${teamLogos[homeTeam.teamTricode]}" 
                         alt="${homeTeam.teamName}" 
                         title="${homeTeam.teamName}">
                    <span class="team-name">${homeTeam.teamName}</span>
                </div>
            </td>
            <td class="score-cell">${homeScore}</td>
        </tr>
    `;
};

// Update scores for a specific date
const updateScores = async (date) => {
    const scoresContainer = document.querySelector('.scores-container');
    if (!scoresContainer) return;

    // Show loading state
    scoresContainer.innerHTML = `
        <div class="loading">
            <img src="img/basketball.gif" alt="Loading..." class="loading-gif">
            <p>Loading Scores...</p>
        </div>
    `;
    
    try {
        const games = await fetchGames(date);
        console.log('Fetched games for date:', date, games);
        
        if (!games || games.length === 0) {
            scoresContainer.innerHTML = `
                <div class="no-games">
                    <h2>No games scheduled for this date!</h2>
                    <p>Try another day!</p>
                </div>
            `;
            return;
        }

        // Create table from template
        const template = document.getElementById('scores-table-template');
        const table = template.content.cloneNode(true);
        const tbody = table.querySelector('tbody');

        // Add game rows
        games.forEach(game => {
            const gameRow = createGameRow(game);
            tbody.insertAdjacentHTML('beforeend', gameRow);
        });

        // Clear container and add table
        scoresContainer.innerHTML = '';
        scoresContainer.appendChild(table);

        // Add click handlers
        document.querySelectorAll('.game-row').forEach(row => {
            row.addEventListener('click', () => {
                createBoxScore(row.dataset.gameId);
            });
        });

    } catch (error) {
        console.error('Error updating scores:', error);
        scoresContainer.innerHTML = `
            <div class="error">
                <h2>Oops! Something went wrong!</h2>
                <p>Unable to load NBA scores at the moment.</p>
                <p>Please try again later.</p>
            </div>
        `;
    }
};

// Box score functionality
const createBoxScore = async (gameId) => {
    try {
        // Validate gameId
        if (!gameId) {
            console.error('Invalid gameId:', gameId);
            showErrorModal('Invalid game ID. Please try again.');
            return;
        }
        
        console.log('Fetching game details for gameId:', gameId);
        
        // First fetch the main scoreboard to get the game data
        const response = await fetch(`${ESPN_API}?dates=${getCurrentDate()}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Scoreboard API response:', data);
        
        // Find the specific game from the events array
        const game = data.events?.find(event => event.id === gameId);
        
        if (!game) {
            console.error('Game not found in scoreboard data:', gameId);
            showErrorModal('Game data is not available at this time.');
            return;
        }
        
        // Validate response data
        if (!game.competitions || !game.competitions[0]) {
            console.error('Invalid or incomplete game data:', game);
            showErrorModal('Game data is incomplete or unavailable.');
            return;
        }

        const competition = game.competitions[0];
        const gameState = game.status.type.id;
        const homeTeam = competition.competitors.find(team => team.homeAway === 'home');
        const awayTeam = competition.competitors.find(team => team.homeAway === 'away');
        
        // Log game state and data availability
        console.log('Game Data Debug:', {
            gameId,
            gameState,
            hasHomeTeam: !!homeTeam,
            hasAwayTeam: !!awayTeam,
            homeScore: homeTeam?.score,
            awayScore: awayTeam?.score,
            hasBoxScore: !!game.boxscore,
            gameStatusDetail: competition.status?.type?.detail || 'N/A'
        });

        // Validate teams data
        if (!homeTeam || !awayTeam) {
            console.error('Missing team data:', { homeTeam, awayTeam });
            showErrorModal('Team data is unavailable.');
            return;
        }

        // Handle different game states
        if (gameState === "1") {
            console.log('Game has not started yet:', gameId);
            showPreGameModal(homeTeam, awayTeam, game);
            return;
        }

        // For live or completed games, attempt to fetch box score
        if (gameState === "2" || gameState === "3") {
            try {
                console.log('Fetching box score for gameId:', gameId);
                // Use the main scoreboard endpoint with the specific date
                const boxScoreResponse = await fetch(`${ESPN_API}?dates=${getCurrentDate()}`);
                
                if (!boxScoreResponse.ok) {
                    throw new Error(`Box score HTTP error! status: ${boxScoreResponse.status}`);
                }
                
                const boxScoreData = await boxScoreResponse.json();
                const gameWithBoxScore = boxScoreData.events?.find(event => event.id === gameId);
                
                if (!gameWithBoxScore) {
                    console.warn('Box score not found, showing basic game info');
                    showBasicGameModal(homeTeam, awayTeam, game);
                    return;
                }
                
                console.log('Box score data:', gameWithBoxScore);
                showBoxScoreModal(homeTeam, awayTeam, game, gameWithBoxScore);
            } catch (boxScoreError) {
                console.warn('Error fetching box score:', boxScoreError);
                showBasicGameModal(homeTeam, awayTeam, game);
            }
        } else {
            console.warn('Unknown game state:', gameState);
            showBasicGameModal(homeTeam, awayTeam, game);
        }
    } catch (error) {
        console.error('Error in createBoxScore:', {
            error: error.message,
            stack: error.stack,
            gameId: gameId
        });
        showErrorModal('Unable to load game details. Please try again later.');
    }
};

const showPreGameModal = (homeTeam, awayTeam, game) => {
    const modal = document.createElement('div');
    modal.className = 'box-score-modal';
    modal.innerHTML = `
        <div class="box-score-container">
            <button class="close-button">×</button>
            <div class="box-score-header">
                <h2>${awayTeam.team.displayName || awayTeam.team.name} @ ${homeTeam.team.displayName || homeTeam.team.name}</h2>
                <p class="game-status">Game starts at ${formatGameTime(game)}</p>
            </div>
            <div class="team-stats">
                <div class="team-summary pre-game">
                    <div class="team-header">
                        <img src="${teamLogos[awayTeam.team.abbreviation]}" 
                             alt="${awayTeam.team.displayName}" class="team-logo">
                        <h3>${awayTeam.team.displayName}</h3>
                    </div>
                    <div class="team-record">
                        Season Record: ${awayTeam.records?.[0]?.summary || 'N/A'}
                    </div>
                </div>
                <div class="team-summary pre-game">
                    <div class="team-header">
                        <img src="${teamLogos[homeTeam.team.abbreviation]}" 
                             alt="${homeTeam.team.displayName}" class="team-logo">
                        <h3>${homeTeam.team.displayName}</h3>
                    </div>
                    <div class="team-record">
                        Season Record: ${homeTeam.records?.[0]?.summary || 'N/A'}
                    </div>
                </div>
            </div>
            <div class="pre-game-note">
                <p>Full game statistics will be available once the game begins.</p>
            </div>
        </div>
    `;
    
    addModalEventListeners(modal);
};

const showBasicGameModal = (homeTeam, awayTeam, game) => {
    const modal = document.createElement('div');
    modal.className = 'box-score-modal';
    modal.innerHTML = `
        <div class="box-score-container">
            <button class="close-button">×</button>
            <div class="box-score-header">
                <h2>${awayTeam.team.displayName || awayTeam.team.name} @ ${homeTeam.team.displayName || homeTeam.team.name}</h2>
                <p class="game-status">${game.status?.type?.detail || game.gameStatusText || ''}</p>
            </div>
            <div class="team-stats">
                <div class="team-summary">
                    <div class="team-header">
                        <img src="${teamLogos[awayTeam.team.abbreviation]}" 
                             alt="${awayTeam.team.displayName}" class="team-logo">
                        <h3>${awayTeam.team.displayName}</h3>
                        <div class="team-score">${awayTeam.score || '0'}</div>
                    </div>
                    <div class="basic-stats">
                        ${createBasicStats(awayTeam)}
                    </div>
                </div>
                <div class="team-summary">
                    <div class="team-header">
                        <img src="${teamLogos[homeTeam.team.abbreviation]}" 
                             alt="${homeTeam.team.displayName}" class="team-logo">
                        <h3>${homeTeam.team.displayName}</h3>
                        <div class="team-score">${homeTeam.score || '0'}</div>
                    </div>
                    <div class="basic-stats">
                        ${createBasicStats(homeTeam)}
                    </div>
                </div>
            </div>
            <div class="stats-note">
                <p>Detailed statistics are currently being compiled.</p>
                <p>Basic game information shown above.</p>
            </div>
        </div>
    `;
    
    addModalEventListeners(modal);
};

const createBasicStats = (team) => {
    return `
        <div class="team-stats-container">
            <div class="stat-row">
                <span class="stat-label">Score:</span>
                <span class="stat-value">${team.score || '0'}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Record:</span>
                <span class="stat-value">${team.records?.[0]?.summary || 'N/A'}</span>
            </div>
            ${team.leaders ? `
                <div class="stat-row">
                    <span class="stat-label">Points Leader:</span>
                    <span class="stat-value">${team.leaders.points?.displayValue || 'N/A'}</span>
                </div>
            ` : ''}
        </div>
    `;
};

const addModalEventListeners = (modal) => {
    const closeButton = modal.querySelector('.close-button');
    
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    };

    // Single event listener for close button
    closeButton.addEventListener('click', closeModal);

    // Single event listener for clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Single event listener for escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    }, { once: true });

    // Add the modal to the DOM and make it visible
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
};

const showErrorModal = (message) => {
    const errorModal = document.createElement('div');
    errorModal.className = 'box-score-modal';
    errorModal.innerHTML = `
        <div class="box-score-container">
            <button class="close-button">×</button>
            <div class="box-score-header">
                <h2>Game Details</h2>
            </div>
            <div class="error-message">
                <p>🏀 ${message} 🏀</p>
            </div>
        </div>
    `;

    addModalEventListeners(errorModal);
};

const showBoxScoreModal = (homeTeam, awayTeam, game, boxScoreData) => {
    const modal = document.createElement('div');
    modal.className = 'box-score-modal';
    
    // Get scores from the game data
    const homeScore = parseInt(homeTeam.score) || 0;
    const awayScore = parseInt(awayTeam.score) || 0;
    
    // Log the full game data for debugging
    console.log('Full Game Data:', {
        game,
        boxScoreData,
        homeTeam,
        awayTeam,
        competition: game.competitions[0],
        status: game.status
    });
    
    modal.innerHTML = `
        <div class="box-score-container">
            <button class="close-button" aria-label="Close">×</button>
            <div class="box-score-header">
                <h2>${awayTeam.team.displayName} @ ${homeTeam.team.displayName}</h2>
                <p class="game-status">${game.status?.type?.detail || 'Status unavailable'}</p>
            </div>
            <div class="team-stats">
                <div class="team-summary">
                    <div class="team-header">
                        <img src="${teamLogos[awayTeam.team.abbreviation]}" 
                             alt="${awayTeam.team.displayName}" class="team-logo">
                        <h3>${awayTeam.team.displayName}</h3>
                        <div class="team-score">${awayScore}</div>
                    </div>
                    <div class="team-details">
                        ${createTeamStats(awayTeam)}
                    </div>
                </div>
                <div class="team-summary">
                    <div class="team-header">
                        <img src="${teamLogos[homeTeam.team.abbreviation]}" 
                             alt="${homeTeam.team.displayName}" class="team-logo">
                        <h3>${homeTeam.team.displayName}</h3>
                        <div class="team-score">${homeScore}</div>
                    </div>
                    <div class="team-details">
                        ${createTeamStats(homeTeam)}
                    </div>
                </div>
            </div>
            ${game.status?.type?.state === 'pre' ? 
                '<div class="stats-note">Game has not started yet. Check back during the game for live statistics.</div>' :
                '<div class="stats-note">Detailed statistics are currently unavailable. Basic information shown above.</div>'
            }
        </div>
    `;

    addModalEventListeners(modal);
};

// Helper function to create team stats
const createTeamStats = (team) => {
    const stats = team.statistics || [];
    const record = team.records?.[0]?.summary || '';
    
    // Helper function to format stat name
    const formatStatName = (name) => {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace('Percentage', '%');
    };

    // Helper function to get stat value
    const getStatValue = (statName) => {
        const stat = stats.find(s => s.name.toLowerCase() === statName.toLowerCase());
        return stat?.displayValue;
    };

    // Only include stats that have values
    const availableStats = {
        points: getStatValue('points'),
        rebounds: getStatValue('rebounds'),
        assists: getStatValue('assists'),
        fieldGoalsPercentage: getStatValue('fieldGoalsPercentage'),
        threePointPercentage: getStatValue('threePointPercentage'),
        freeThrowPercentage: getStatValue('freeThrowPercentage')
    };

    // Filter out undefined or N/A values
    const validStats = Object.entries(availableStats).filter(([_, value]) => 
        value && value !== 'N/A' && value !== '0'
    );

    // If we have no valid stats, show a message
    if (validStats.length === 0) {
        return `
            <div class="team-stats-container">
                ${record ? `<div class="team-record">RECORD: ${record}</div>` : ''}
                <div class="stats-note">Detailed statistics are currently unavailable.</div>
            </div>
        `;
    }

    // Group available stats
    const mainStats = validStats.filter(([key]) => 
        ['points', 'rebounds', 'assists'].includes(key)
    );

    const shootingStats = validStats.filter(([key]) => 
        ['fieldGoalsPercentage', 'threePointPercentage', 'freeThrowPercentage'].includes(key)
    );

    return `
        <div class="team-stats-container">
            ${record ? `<div class="team-record">RECORD: ${record}</div>` : ''}
            
            ${mainStats.length > 0 ? `
                <div class="stat-group">
                    <div class="stat-group-title">KEY STATS</div>
                    ${mainStats.map(([key, value]) => `
                        <div class="stat-row important">
                            <span class="stat-label">${formatStatName(key)}</span>
                            <span class="stat-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${shootingStats.length > 0 ? `
                <div class="stat-group">
                    <div class="stat-group-title">SHOOTING</div>
                    ${shootingStats.map(([key, value]) => `
                        <div class="stat-row">
                            <span class="stat-label">${formatStatName(key)}</span>
                            <span class="stat-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
};

const showPlayerCard = (playerId, gameData) => {
    const player = findPlayer(playerId, gameData);
    if (!player) return;

    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
        <button class="close-button">×</button>
        <div class="player-card-content">
            <img class="player-sprite" src="${playerSprites.default}" alt="${player.name}">
            <h3>${player.name}</h3>
            <div class="player-stats-detail">
                <p>Points: ${player.stats.points}</p>
                <p>Rebounds: ${player.stats.rebounds}</p>
                <p>Assists: ${player.stats.assists}</p>
                <p>FG%: ${player.stats.fieldGoalPercentage}%</p>
                <p>3P%: ${player.stats.threePointPercentage}%</p>
            </div>
        </div>
    `;

    card.querySelector('.close-button').addEventListener('click', () => {
        card.remove();
    });

    document.body.appendChild(card);
    setTimeout(() => card.classList.add('active'), 0);
};

// Helper function to find player in game data
const findPlayer = (playerId, gameData) => {
    const allPlayers = [
        ...gameData.stats.home.players,
        ...gameData.stats.away.players
    ];
    return allPlayers.find(player => player.id === playerId);
};

// Initialize the app
const initApp = async () => {
    const scoresContainer = document.querySelector('.scores-container');
    if (!scoresContainer) return;

    // Create date toggle buttons
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'date-toggle';
    toggleContainer.innerHTML = `
        <button class="toggle-btn active" data-date="today">
            <span class="btn-text">TODAY'S GAMES</span>
            <span class="btn-glow"></span>
        </button>
    `;
    scoresContainer.insertAdjacentElement('beforebegin', toggleContainer);

    // Initial load of today's games
    const today = getCurrentDate();
    console.log('Initial load for date:', today);
    await updateScores(today);
};

// Modify the auto-refresh interval to only update if viewing today's games
const REFRESH_INTERVAL = 30000; // 30 seconds
let refreshTimer = null;

const startAutoRefresh = () => {
    // Clear any existing timer
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
    
    // Start new refresh timer
    refreshTimer = setInterval(async () => {
        const activeButton = document.querySelector('.toggle-btn.active');
        if (!activeButton || activeButton.dataset.date !== 'today') {
            clearInterval(refreshTimer);
            refreshTimer = null;
            return;
        }
        
        const scoresContainer = document.querySelector('.scores-container');
        if (!scoresContainer) return;

        try {
            const games = await fetchGames(getCurrentDate());
            if (!games || games.length === 0) return;

            // Check if we have any live games
            const hasLiveGames = games.some(game => game.gameStatus === 2);
            console.log('Auto-refresh status:', {
                totalGames: games.length,
                liveGames: games.filter(game => game.gameStatus === 2).length,
                refreshInterval: REFRESH_INTERVAL
            });

            const gameCards = games.map(game => {
                // Log score updates for live games
                if (game.gameStatus === 2) {
                    console.log('Live game update:', {
                        gameId: game.id,
                        matchup: `${game.awayTeam.teamName} @ ${game.homeTeam.teamName}`,
                        homeScore: game.homeTeam.score,
                        awayScore: game.awayTeam.score,
                        period: game.period,
                        clock: game.clock
                    });
                }
                
                return createGameRow(game);
            }).join('');

            const wrapper = document.querySelector('.scores-wrapper');
            if (wrapper) {
                const newWrapper = document.createElement('div');
                newWrapper.className = 'scores-wrapper';
                newWrapper.innerHTML = `
                    ${gameCards}
                    <p class="refresh-note">↻ TODAY'S SCORES - Auto-refresh every ${REFRESH_INTERVAL/1000} seconds ↻</p>
                    ${hasLiveGames ? '<p class="live-note">🔴 Live Games in Progress</p>' : ''}
                `;
                
                wrapper.style.opacity = '0';
                setTimeout(() => {
                    wrapper.replaceWith(newWrapper);
                    // Re-attach click handlers
                    document.querySelectorAll('.game-row').forEach(row => {
                        row.addEventListener('click', () => {
                            createBoxScore(row.dataset.gameId);
                        });
                    });
                }, 300);
            }
        } catch (error) {
            console.error('Error refreshing scores:', error);
            // Don't stop refresh on error, just log it
        }
    }, REFRESH_INTERVAL);
};

// Initialize the app when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    startAutoRefresh();
    
    // Update marquee text
    const marquee = document.querySelector('.marquee p');
    if (marquee) {
        const text = '⭐ LIVE NBA SCORES ⭐ Auto-updates every 30 seconds ⭐ Bookmark this page! ⭐ Made with Web 1.0 Love ⭐';
        marquee.innerHTML = `${text} ${text} ${text}`;
    }

    // Update visitor counter HTML
    document.querySelector('.visitor-counter').innerHTML = `
        <img src="img/counter.gif" alt="Visitor counter">
        <span>Visitors: 000001</span>
    `;
}); 