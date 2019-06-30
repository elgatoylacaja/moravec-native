import {
    ASK_FOR_HINT,
    CALCULATOR_ERASE_INPUT,
    CALCULATOR_TYPE_INPUT,
    LOAD_GAME_DATA,
    NEW_TRIAL,
    START_LEVEL,
    SUBMIT_TRIAL,
    UPDATE_LEVELS_HISTORY,
    UPDATE_TRIALS_HISTORY,
} from '../actions/game_actions'
import {OperationCategory} from "../models/operations/Category";
import {
    calculateTotalTrialTime,
    hasExceededMaxSolveTime,
    initilizeSessionInfo,
    isAnswerCorrect,
    updatedLastAnswerData,
    updatedSessionInfoAfterTrialSubmit,
    updatedTrialAfterErase,
    updatedTrialAfterNewInput,
    updatedTrialAfterSubmit,
    updateTotalCorrect
} from "./calculator_logic";

export const LOADING = 'LOADING';
export const PLAYING = 'PLAYING';
export const LEVEL_FINISHED = 'LEVEL_FINISHED';

const initialState = {
    state: LOADING,
    currentLevel: undefined,
    sessionInfo: undefined,
    currentTrial: undefined,
    lastAnswerData: undefined,
    playedLevelsStats: null,
    trialsHistory: null,
    stats: emptyStats()
};

export const TOTAL_TRIALS_PER_LEVEL = 20;

export const MAX_HINTS_PER_LEVEL = 3;

function calculateTotalLevelTime(totalTimeUntilNow, currentTrialStartTime, currentTrialSubmitTime) {
    return totalTimeUntilNow + calculateTotalTrialTime(currentTrialStartTime, currentTrialSubmitTime);
}

function playingOrLevelFinishedState(trialNumberSubmitted, totalTrials) {
    if (trialNumberSubmitted === totalTrials) {
        return LEVEL_FINISHED;
    } else {
        return PLAYING;
    }
}

function newTrialForLevel(levelNumber, operation, startTime, hintsAvailable) {
    return {
        levelNumber: levelNumber,
        currentUserInput: null,
        operation: operation,
        startTime: startTime,
        keysPressed: [],
        responseTimes: [],
        hasErased: false,
        timeExceeded: false,
        hintShown: false,
        hintsCurrentlyAvailable: hintsAvailable,
    }
}

function shouldShowHint(hintsAvailable, operationHint, hintShown) {
    return hintShown || (hintsAvailable > 0 && operationHint.hasHint());
}

function calculateHintsAvailable(prevHintsAvailable, operationHint, hintShown) {
    if (!hintShown && shouldShowHint(prevHintsAvailable, operationHint, hintShown)) {
        return prevHintsAvailable - 1;
    } else {
        return prevHintsAvailable;
    }
}

function calculateStars(totalCorrect) {
    if (totalCorrect < 15) {
        return 0;
    }
    if (totalCorrect < 17) {
        return 1;
    }
    if (totalCorrect < 20) {
        return 2;
    }
    if (totalCorrect >= 20) {
        return 3;
    }
}

export function emptyStats() {
    return OperationCategory.allCategories().map((category) => {
        return {
            categoryCodename: category.codename(),
            correctTrialsTimes: [],
            incorrectTrialsTimes: [],
        }
    });
}

function addStatsFromNewTrials(previousStats, newTrials) {
    return previousStats.map((operationStats) => {
        const trialsOfCategory = newTrials.filter((trial) => {
            return trial.operation.opType === operationStats.categoryCodename
        });

        const correctTrials = trialsOfCategory.filter((trial) => trial.isCorrect);
        const incorrectTrials = trialsOfCategory.filter((trial) => !trial.isCorrect);

        const correctTrialsTimes = correctTrials.map((trial) => trial.totalTime);
        const incorrectTrialsTimes = incorrectTrials.map((trial) => trial.totalTime);

        return {
            ...operationStats,
            correctTrialsTimes: operationStats.correctTrialsTimes.concat(correctTrialsTimes),
            incorrectTrialsTimes: operationStats.incorrectTrialsTimes.concat(incorrectTrialsTimes),
        }
    });
}

function updateLevelStatsIfBetterRecord(playedLevelStats, newLevelData) {
    let aBetterRecord = true;

    const previousStats = playedLevelStats[newLevelData.number];
    if (previousStats !== undefined) {
        const moreStars = newLevelData.stars > previousStats.stars;
        const sameStars = newLevelData.stars === previousStats.stars;
        const timeImproved = newLevelData.totalTrialsTime < previousStats.totalTrialsTime;

        aBetterRecord = moreStars || (sameStars && timeImproved);
    }

    if (aBetterRecord) {
        return {
            ...playedLevelStats,
            [newLevelData.number]: {
                stars: newLevelData.stars,
                totalTrialsTime: newLevelData.totalTrialsTime,
                levelCompleted: newLevelData.levelCompleted,
            }
        };
    } else {
        return playedLevelStats;
    }
}

export function gameReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_GAME_DATA:
            return {
                ...state,
                playedLevelsStats: action.playedLevelsStats,
                trialsHistory: action.trialsHistory,
                stats: action.stats
            };

        case NEW_TRIAL:
            return {
                ...state,
                currentTrial: newTrialForLevel(state.currentLevel.number, action.operation, action.startTime,
                    state.currentLevel.hintsAvailable)
            };

        case CALCULATOR_TYPE_INPUT:
            return {
                ...state,
                currentTrial: updatedTrialAfterNewInput(state.currentTrial, action.newUserInput, action.inputTime)
            };

        case CALCULATOR_ERASE_INPUT:
            return {
                ...state,
                currentTrial: updatedTrialAfterErase(state.currentTrial, action.inputTime)
            };

        case ASK_FOR_HINT:
            return {
                ...state,
                currentLevel: {
                    ...state.currentLevel,
                    hintsAvailable: calculateHintsAvailable(state.currentLevel.hintsAvailable,
                        state.currentTrial.operation.hint, state.currentTrial.hintShown),
                },
                currentTrial: {
                    ...state.currentTrial,
                    hintShown: shouldShowHint(state.currentLevel.hintsAvailable,
                        state.currentTrial.operation.hint, state.currentTrial.hintShown),
                }
            };

        case START_LEVEL:
            return {
                ...state,
                state: PLAYING,
                currentLevel: {
                    number: action.levelNumber,
                    trials: [],
                    totalTrials: TOTAL_TRIALS_PER_LEVEL,
                    stars: 0,
                    totalTrialsTime: 0,
                    levelCompleted: false,
                    hintsAvailable: MAX_HINTS_PER_LEVEL,
                },
                sessionInfo: initilizeSessionInfo(),
                currentTrial: newTrialForLevel(action.levelNumber, action.operation, action.startTime,
                    MAX_HINTS_PER_LEVEL)
            };

        case SUBMIT_TRIAL:
            const isCorrect = isAnswerCorrect(state.currentTrial.operation.correctResult,
                state.currentTrial.currentUserInput);

            const exceededMaxSolveTime = hasExceededMaxSolveTime(state.currentTrial.startTime, action.submitTime,
                state.currentTrial.operation.maxSolveTime);

            const currentTrialAfterSubmit = updatedTrialAfterSubmit(state.currentTrial, action.submitTime, isCorrect,
                exceededMaxSolveTime, state.sessionInfo);

            const totalCorrect = updateTotalCorrect(isCorrect, state.sessionInfo.totalCorrect);

            const levelCompleted = totalCorrect >= 15;

            return {
                ...state,
                state: playingOrLevelFinishedState(state.sessionInfo.currentTrialNumber, state.currentLevel.totalTrials),
                currentLevel: {
                    ...state.currentLevel,
                    trials: state.currentLevel.trials.concat(currentTrialAfterSubmit),
                    stars: calculateStars(totalCorrect),
                    totalTrialsTime: calculateTotalLevelTime(state.currentLevel.totalTrialsTime,
                        state.currentTrial.startTime,
                        action.submitTime),
                    levelCompleted: levelCompleted,
                },
                sessionInfo: updatedSessionInfoAfterTrialSubmit(state.sessionInfo, isCorrect, exceededMaxSolveTime,
                    totalCorrect),
                lastAnswerData: updatedLastAnswerData(state.currentTrial, isCorrect, exceededMaxSolveTime),
                trialsHistory: state.trialsHistory.concat(currentTrialAfterSubmit),
            };

        case UPDATE_LEVELS_HISTORY:
            return {
                ...state,
                playedLevelsStats: updateLevelStatsIfBetterRecord(state.playedLevelsStats, state.currentLevel),
                stats: addStatsFromNewTrials(state.stats, state.currentLevel.trials),
            };

        case UPDATE_TRIALS_HISTORY:
            return {
                ...state,
                trialsHistory: action.trialsHistory,
            };

        default:
            return state
    }
}
