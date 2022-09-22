const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 10;
const HEAL_VALUE = 20;
const enteredValueHp = prompt('Choose your health.', '');
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK'
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER'

let chosenMaxHealth = parseInt(enteredValueHp);
let lastLoggedEvent;

if (isNaN(chosenMaxHealth) || chosenMaxHealth < 0) {
    chosenMaxHealth = 100;
};

let currentMonsterHealth = chosenMaxHealth;
let currentPlayerHealth = chosenMaxHealth;
let hasBonusLife = true; 
let battleLog = [];

adjustHealthBars(chosenMaxHealth);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHelath: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev,
                value: val,
                finalMonsterHelath: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        default:
            logEntry = {};

    }
    // if (ev === LOG_EVENT_PLAYER_ATTACK) {
    //     logEntry.target = 'MONSTER'
    // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'MONSTER',
    //         finalMonsterHelath: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         target: 'PLAYER',
    //         finalMonsterHelath: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    //     logEntry.target = 'PLAYER';
    // } else if (ev === LOG_EVENT_GAME_OVER) {
    //     logEntry = {
    //         event: ev,
    //         value: val,
    //         finalMonsterHelath: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxHealth;
    currentPlayerHealth = chosenMaxHealth;
    resetGame(chosenMaxHealth);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDemage = dealPlayerDamage(MONSTER_ATTACK_VALUE); 
    currentPlayerHealth -= playerDemage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK, 
        playerDemage, 
        currentMonsterHealth, 
        currentPlayerHealth
        );
    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You used your one and only bonus life!');
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("You Won!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('Monster Won!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert('It is a draw!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'ITS A DRAW WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } 
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

function attackMonster(mode) {
    const maxDemage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
/*     if (mode === MODE_ATTACK) {
        maxDemage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDemage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK; 
    }*/
    const demage = dealMonsterDamage(maxDemage);
    currentMonsterHealth -= demage;
    writeToLog(
        logEvent,
        demage,
        currentMonsterHealth,
        currentPlayerHealth
    );
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
    endRound();
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
    endRound();
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxHealth - HEAL_VALUE) {
        healValue = chosenMaxHealth - currentPlayerHealth;
        increasePlayerHealth(healValue);
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += HEAL_VALUE;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function printLogHandler() {
    // for (let i = 0; i < 3; i++) {
    //     console.log('-----------');
    // }
    let j = 3;
    do {
        console.log(j);
        j++;
    } while (j < 3);
    // for (let i = 0; i < battleLog.length; i++) {
    //     console.log(battleLog[i]);
    // }
    // for (const logEntry of battleLog) {
    //     console.log(logEntry);
    // }
    let i = 0;
    for (const logEntry of battleLog) {
        if ((!lastLoggedEvent && lastLoggedEvent !== 0) || lastLoggedEvent < i) {
            console.log(`#${i}`);
            for (const key in logEntry) {
                console.log(`${key} => ${logEntry[key]}`);      // this for is to make battle log readable
            }
        lastLoggedEvent = i;
        break;
        }
        i++;
    }
}
attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);



// let randomNumbers = [];
// let finished = false;
// while (!finished) {
//     const rndNumber = Math.random();
//     randomNumbers.push(rndNumber);
//     if (rndNumber > 0.5) {
//         finsihed = true;
//         console.log(randomNumbers);              while loop that will log an array of every number, stops execute when it hits >0.5
//     }
// }
//lets see if this works
