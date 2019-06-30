import {PracticeMode} from "../models/practice/PracticeMode";
import {AppDataStorage} from "../storage/AppDataStorage";
import {sendUnsentPracticeTrials} from "../send_data";
import {createRandomOperationFor} from "./common";

export const LOAD_PRACTICE_DATA = 'LOAD_PRACTICE_DATA';
export const START_PRACTICE_MODE = 'START_PRACTICE_MODE';
export const NEW_TRIAL_PRACTICE = 'NEW_TRIAL_PRACTICE';
export const CALCULATOR_TYPE_INPUT_PRACTICE = 'CALCULATOR_TYPE_INPUT_PRACTICE';
export const CALCULATOR_ERASE_INPUT_PRACTICE = 'CALCULATOR_ERASE_INPUT_PRACTICE';
export const SUBMIT_TRIAL_PRACTICE = 'SUBMIT_TRIAL_PRACTICE';
export const UPDATE_TRIALS_HISTORY_PRACTICE = 'UPDATE_TRIALS_HISTORY_PRACTICE';

export function loadPracticeData() {
    return (dispatch) => {
        AppDataStorage.fetch('trialsHistory').then(trialsHistory => {
            dispatch({
                type: LOAD_PRACTICE_DATA,
                trialsHistory: trialsHistory || [],
            });
        });
    }
}

export function startPracticeMode(category, difficulty) {
    return (dispatch) => {
        const practiceMode = new PracticeMode(category, difficulty);
        dispatch({
            type: START_PRACTICE_MODE,
            practiceMode: practiceMode,
            operation: createRandomOperationFor(practiceMode),
            startTime: new Date().getTime()
        });
    }
}

function newTrialForPractice() {
    return (dispatch, getState) => {
        const practiceMode = getState().practice.practiceMode;
        dispatch({
            type: NEW_TRIAL_PRACTICE,
            operation: createRandomOperationFor(practiceMode),
            startTime: new Date().getTime(),
        });
    }
}

export function typeInput(newUserInput) {
    return {
        type: CALCULATOR_TYPE_INPUT_PRACTICE,
        newUserInput: newUserInput,
        inputTime: new Date().getTime(),
    }
}

export function eraseInput() {
    return {
        type: CALCULATOR_ERASE_INPUT_PRACTICE,
        inputTime: new Date().getTime(),
    }
}

export function submitTrialAndContinue() {
    return (dispatch) => {
        dispatch({
            type: SUBMIT_TRIAL_PRACTICE,
            submitTime: new Date().getTime(),
        });

        dispatch(storePracticeInfoAndSendTrialsToServer());
        dispatch(newTrialForPractice());
    }
}

function storePracticeInfoAndSendTrialsToServer() {
    return (dispatch, getState) => {
        const practiceState = getState().practice;

        sendUnsentPracticeTrials(practiceState.trialsHistory).then(updatedTrialsHistory => {
            dispatch({type: UPDATE_TRIALS_HISTORY_PRACTICE, trialsHistory: updatedTrialsHistory});
            AppDataStorage.save('trialsHistory', updatedTrialsHistory);
        }).catch(error => {
            AppDataStorage.save('trialsHistory', practiceState.trialsHistory);
            throw error;
        });
    }
}

