import {emptyStats, LEVEL_FINISHED} from "../reducers/game_reducer";
import {AppDataStorage} from "../storage/AppDataStorage";
import {sendUnsentGameTrials} from "../send_data";
import {createRandomOperationFor} from "./common";

export const LOAD_GAME_DATA = 'LOAD_GAME_DATA';
export const CALCULATOR_TYPE_INPUT = 'CALCULATOR_TYPE_INPUT';
export const CALCULATOR_ERASE_INPUT = 'CALCULATOR_ERASE_INPUT';
export const ASK_FOR_HINT = 'ASK_FOR_HINT';
export const NEW_TRIAL = 'NEW_TRIAL';
export const SUBMIT_TRIAL = 'SUBMIT_TRIAL';
export const START_LEVEL = 'START_LEVEL';
export const UPDATE_LEVELS_HISTORY = 'UPDATE_LEVELS_HISTORY';
export const UPDATE_TRIALS_HISTORY = 'UPDATE_TRIALS_HISTORY';


function newTrialForGame() {
    return (dispatch, getState) => {
        const gameState = getState().game;
        const levelsState = getState().levels;
        const currentLevel = levelsState.levels[gameState.currentLevel.number];
        dispatch({
            type: NEW_TRIAL,
            operation: createRandomOperationFor(currentLevel),
            startTime: new Date().getTime(),
        });
    }
}

export function loadGameData() {
    return (dispatch, getState) => {
        const playedLevelsStats = getState().levels.playedLevelsStats;
        const trialsHistory = AppDataStorage.fetch('trialsHistory');
        const stats = AppDataStorage.fetch('stats');

        Promise.all([trialsHistory, stats]).then(promiseValues => {
            dispatch({
                type: LOAD_GAME_DATA,
                playedLevelsStats: playedLevelsStats,
                trialsHistory: promiseValues[0] || [],
                stats: promiseValues[1] || emptyStats(),
            });
        });
    }
}

export function typeInput(newUserInput) {
    return {
        type: CALCULATOR_TYPE_INPUT,
        newUserInput: newUserInput,
        inputTime: new Date().getTime(),
    }
}

export function eraseInput() {
    return {
        type: CALCULATOR_ERASE_INPUT,
        inputTime: new Date().getTime(),
    }
}

export function askForHint() {
    return {
        type: ASK_FOR_HINT,
    }
}

export function submitTrialAndContinue() {
    return (dispatch, getState) => {
        dispatch({
            type: SUBMIT_TRIAL,
            submitTime: new Date().getTime(),
        });

        if (getState().game.state === LEVEL_FINISHED) {
            dispatch(updateLevelsHistory());
        } else {
            dispatch(newTrialForGame());
        }
    }
}

export function startLevel(levelNumber) {
    return (dispatch, getState) => {
        const levelsState = getState().levels;
        const currentLevel = levelsState.levels[levelNumber];
        dispatch({
            type: START_LEVEL,
            levelNumber: levelNumber,
            operation: createRandomOperationFor(currentLevel),
            startTime: new Date().getTime()
        })
    }
}

function updateLevelsHistory() {
    return (dispatch) => {
        dispatch({
            type: UPDATE_LEVELS_HISTORY,
        });
        dispatch(storeGameInfoAndSendTrialsToServer());
    }
}

function storeGameInfoAndSendTrialsToServer() {
    return (dispatch, getState) => {
        const gameState = getState().game;
        AppDataStorage.save('playedLevelsStats', gameState.playedLevelsStats);
        AppDataStorage.save('stats', gameState.stats);

        sendUnsentGameTrials(gameState.trialsHistory).then(updatedTrialsHistory => {
            dispatch({type: UPDATE_TRIALS_HISTORY, trialsHistory: updatedTrialsHistory});
            AppDataStorage.save('trialsHistory', updatedTrialsHistory);
        }).catch(error => {
            AppDataStorage.save('trialsHistory', gameState.trialsHistory);
            throw error;
        });
    }
}
