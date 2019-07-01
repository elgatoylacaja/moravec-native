import {
    emptyStats,
    gameReducer,
    LOADING,
    MAX_HINTS_PER_LEVEL,
    PLAYING,
    TOTAL_TRIALS_PER_LEVEL
} from "../src/reducers/game_reducer";
import {OperationCategory} from "../src/models/operations/Category";
import {initilizeSessionInfo} from "../src/reducers/calculator_logic";
import {NoHint} from "../src/models/hints/NoHint";
import {LOAD_GAME_DATA, START_LEVEL, SUBMIT_TRIAL} from "../src/actions/game_actions_types";

const currentTime = new Date().getTime();

function simpleOperationData() {
    return {
        opType: new OperationCategory("1d+1d"),
        operator: "+",
        operand1: 1,
        operand2: 1,
        operation: "1 + 1",
        correctResult: 2,
        maxSolveTime: 7000,
        hint: new NoHint(),
        shouldBeHidden: 0
    };
}

describe('game reducer', () => {
    it('should load game data correctly the first time', () => {
        const loadGameDataAction = {
            type: LOAD_GAME_DATA,
            playedLevelsStats: {},
            trialsHistory: [],
            stats: emptyStats(),
        };

        expect(gameReducer(undefined, loadGameDataAction)).toEqual(
            {
                state: LOADING,
                currentLevel: undefined,
                sessionInfo: undefined,
                currentTrial: undefined,
                lastAnswerData: undefined,
                playedLevelsStats: {},
                trialsHistory: [],
                stats: emptyStats()
            }
        )
    });

    it('should start the first level correctly the first time', () => {
        const gameDataLoadedFirstTime =
            {
                state: LOADING,
                currentLevel: undefined,
                sessionInfo: undefined,
                currentTrial: undefined,
                lastAnswerData: undefined,
                playedLevelsStats: {},
                trialsHistory: [],
                stats: emptyStats()
            };

        const startLevelAction = {
            type: START_LEVEL,
            levelNumber: 1,
            operation: simpleOperationData(),
            startTime: currentTime
        };

        expect(gameReducer(gameDataLoadedFirstTime, startLevelAction)).toEqual(
            {
                state: PLAYING,
                currentLevel: {
                    number: 1,
                    trials: [],
                    totalTrials: TOTAL_TRIALS_PER_LEVEL,
                    stars: 0,
                    totalTrialsTime: 0,
                    levelCompleted: false,
                    hintsAvailable: MAX_HINTS_PER_LEVEL,
                },
                sessionInfo: initilizeSessionInfo(),
                currentTrial: {
                    levelNumber: 1,
                    currentUserInput: null,
                    operation: simpleOperationData(),
                    startTime: currentTime,
                    keysPressed: [],
                    responseTimes: [],
                    hasErased: false,
                    timeExceeded: false,
                    hintShown: false,
                    hintsCurrentlyAvailable: MAX_HINTS_PER_LEVEL,
                },
                lastAnswerData: undefined,
                playedLevelsStats: {},
                trialsHistory: [],
                stats: emptyStats()
            }
        )
    });

    it('should submit a correct trial correctly', () => {
        const trialStateBefore = {
            levelNumber: 1,
            currentUserInput: 2,
            operation: simpleOperationData(),
            startTime: currentTime,
            keysPressed: [2],
            responseTimes: [500],
            hasErased: false,
            timeExceeded: false,
            hintShown: false,
            hintsCurrentlyAvailable: MAX_HINTS_PER_LEVEL,
        };

        const playingFirstTrial = {
            state: PLAYING,
            currentLevel: {
                number: 1,
                trials: [],
                totalTrials: TOTAL_TRIALS_PER_LEVEL,
                stars: 0,
                totalTrialsTime: 0,
                levelCompleted: false,
                hintsAvailable: MAX_HINTS_PER_LEVEL,
            },
            sessionInfo: initilizeSessionInfo(),
            currentTrial: trialStateBefore,
            lastAnswerData: undefined,
            playedLevelsStats: {},
            trialsHistory: [],
            stats: emptyStats()
        };

        const submitTime = new Date(currentTime + 700);

        const submitTrialAction = {
            type: SUBMIT_TRIAL,
            submitTime: submitTime,
        };

        const trialStateAfter = {
            levelNumber: 1,
            currentUserInput: 2,
            operation: simpleOperationData(),
            startTime: currentTime,
            keysPressed: [2, 20],
            responseTimes: [500, 700],
            hasErased: false,
            timeExceeded: false,
            hintShown: false,
            hintsCurrentlyAvailable: MAX_HINTS_PER_LEVEL,
            submitTime: submitTime,
            totalTime: 700,
            isCorrect: true,
            trialNumber: 1,
            totalCorrectUntilNow: 1,
            correctInARowUntilNow: 1,
        };

        expect(gameReducer(playingFirstTrial, submitTrialAction)).toEqual(
            {
                state: PLAYING,
                currentLevel: {
                    number: 1,
                    trials: [trialStateAfter],
                    totalTrials: TOTAL_TRIALS_PER_LEVEL,
                    stars: 0,
                    totalTrialsTime: 700,
                    levelCompleted: false,
                    hintsAvailable: MAX_HINTS_PER_LEVEL,
                },
                currentTrial: trialStateBefore,
                sessionInfo: {
                    currentTrialNumber: 2,
                    totalCorrect: 1,
                    lastCorrectInARowValue: 1,
                },
                lastAnswerData: {
                    userInput: 2,
                    correctResult: 2,
                    isCorrect: true,
                    timeExceeded: false,
                },
                playedLevelsStats: {},
                trialsHistory: [trialStateAfter],
                stats: emptyStats()
            }
        )
    });
});
