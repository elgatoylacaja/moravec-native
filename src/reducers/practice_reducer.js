import {
    CALCULATOR_ERASE_INPUT_PRACTICE,
    CALCULATOR_TYPE_INPUT_PRACTICE,
    LOAD_PRACTICE_DATA,
    NEW_TRIAL_PRACTICE,
    START_PRACTICE_MODE,
    SUBMIT_TRIAL_PRACTICE,
    UPDATE_TRIALS_HISTORY_PRACTICE,
} from '../actions/practice_actions'
import {
    hasExceededMaxSolveTime, initilizeSessionInfo,
    isAnswerCorrect,
    updatedLastAnswerData,
    updatedSessionInfoAfterTrialSubmit,
    updatedTrialAfterErase,
    updatedTrialAfterNewInput,
    updatedTrialAfterSubmit,
    updateTotalCorrect
} from "./calculator_logic";

export const LOADING = 'LOADING';
export const PRACTICING = 'PRACTICING';

const initialState = {
    state: LOADING,
    practiceMode: undefined,
    currentTrial: undefined,
    lastAnswerData: undefined,
    trialsHistory: undefined
};

function newTrialForPractice(operation, startTime) {
    return {
        levelNumber: null,
        currentUserInput: null,
        operation: operation,
        startTime: startTime,
        keysPressed: [],
        responseTimes: [],
        hasErased: false,
        timeExceeded: false,
        hintShown: operation.hint.hasHint(),
        hintsCurrentlyAvailable: operation.hint.hasHint(),
    }
}

export function practiceReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_PRACTICE_DATA:
            return {
                ...state,
                trialsHistory: action.trialsHistory
            };

        case START_PRACTICE_MODE:
            return {
                ...state,
                state: PRACTICING,
                practiceMode: action.practiceMode,
                currentTrial: newTrialForPractice(action.operation, action.startTime),
                sessionInfo: initilizeSessionInfo(),
            };

        case NEW_TRIAL_PRACTICE:
            return {
                ...state,
                currentTrial: newTrialForPractice(action.operation, action.startTime)
            };

        case CALCULATOR_TYPE_INPUT_PRACTICE:
            return {
                ...state,
                currentTrial: updatedTrialAfterNewInput(state.currentTrial, action.newUserInput, action.inputTime)
            };

        case CALCULATOR_ERASE_INPUT_PRACTICE:
            return {
                ...state,
                currentTrial: updatedTrialAfterErase(state.currentTrial, action.inputTime)
            };

        case SUBMIT_TRIAL_PRACTICE:
            const isCorrect = isAnswerCorrect(state.currentTrial.operation.correctResult, state.currentTrial.currentUserInput);

            const exceededMaxSolveTime = hasExceededMaxSolveTime(state.currentTrial.startTime, action.submitTime,
                state.currentTrial.operation.maxSolveTime);

            const currentTrialAfterSubmit = updatedTrialAfterSubmit(state.currentTrial, action.submitTime, isCorrect,
                exceededMaxSolveTime, state.sessionInfo);

            const totalCorrect = updateTotalCorrect(isCorrect, state.sessionInfo.totalCorrect);

            return {
                ...state,
                sessionInfo: updatedSessionInfoAfterTrialSubmit(state.sessionInfo, isCorrect, exceededMaxSolveTime,
                    totalCorrect),
                lastAnswerData: updatedLastAnswerData(state.currentTrial, isCorrect, exceededMaxSolveTime),
                trialsHistory: state.trialsHistory.concat(currentTrialAfterSubmit),
            };

        case UPDATE_TRIALS_HISTORY_PRACTICE:
            return {
                ...state,
                trialsHistory: action.trialsHistory,
            };

        default:
            return state
    }
}
