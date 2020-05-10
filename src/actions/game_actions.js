import {emptyStats, LEVEL_FINISHED} from "../reducers/game_reducer";
import {AppDataStorage} from "../storage/AppDataStorage";
import AsyncStorage from '@react-native-community/async-storage';
import {sendUnsentGameTrials} from "../send_data";
import {createRandomOperationFor} from "./common";
import {
    ASK_FOR_HINT,
    CALCULATOR_ERASE_INPUT,
    CALCULATOR_TYPE_INPUT,
    LOAD_GAME_DATA,
    NEW_TRIAL,
    START_LEVEL,
    SUBMIT_TRIAL,
    UPDATE_LEVELS_HISTORY,
    UPDATE_TRIALS_HISTORY
} from "./game_actions_types";
import {SendDataToBackendError} from "../api_client/SendDataToBackendError";

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
        const storageBackend = AsyncStorage;
        const appDataStorage = new AppDataStorage(storageBackend);
        const trialsHistory = appDataStorage.fetch('trialsHistory');
        const stats = appDataStorage.fetch('stats');

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
        const storageBackend = AsyncStorage;
        const appDataStorage = new AppDataStorage(storageBackend);
        appDataStorage.save('playedLevelsStats', gameState.playedLevelsStats);
        appDataStorage.save('stats', gameState.stats);
        sendUnsentGameTrials(gameState.trialsHistory).then(updatedTrialsHistory => {
            dispatch({type: UPDATE_TRIALS_HISTORY, trialsHistory: updatedTrialsHistory});
            appDataStorage.save('trialsHistory', updatedTrialsHistory);
        }).catch(error => {
            if (error instanceof SendDataToBackendError) {
                appDataStorage.save('trialsHistory', gameState.trialsHistory);
            } else {
                throw error;
            }
        });
    }
}
