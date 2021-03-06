import {ApiClient} from "./api_client/ApiClient";
import {SendDataToBackendError} from "./api_client/SendDataToBackendError";

export function sendPersonalInfo(personalInfo, appDataStorage) {
    return new Promise((resolve) => {
        new ApiClient().sendPersonalData(personalInfo)
            .then(() => {
                appDataStorage.save('personalInfo', {...personalInfo, sentToBackend: true}).then(() => {
                    resolve();
                });
            })
            .catch((error) => {
                if (error instanceof SendDataToBackendError) {
                    resolve();
                } else {
                    throw error;
                }
            });
    });
}

const ARCADE_GAME_TYPE = 'Arcade';
const PRACTICE_GAME_TYPE = 'Practice';

export function sendUnsentGameTrials(trialsHistory) {
    return sendUnsentTrials(ARCADE_GAME_TYPE, trialsHistory);
}

export function sendUnsentPracticeTrials(trialsHistory) {
    return sendUnsentTrials(PRACTICE_GAME_TYPE, trialsHistory);
}

function sendUnsentTrials(gameType, trialsHistory) {
    const allUnsentTrials = filterUnsentTrials(trialsHistory);

    const totalTrials = trialsHistory.length;

    const totalTrialsSentBefore = totalTrials - allUnsentTrials.length;

    const updatedTrialsHistoryPromise = sendTrials(allUnsentTrials, totalTrialsSentBefore, trialsHistory, gameType);
    return updatedTrialsHistoryPromise;
}

function filterUnsentTrials(trials) {
    return trials.filter((trial) => !trial.hasOwnProperty('sentToBackend') || !trial['sentToBackend']);
}

function sendTrials(allUnsentTrials, totalTrialsSentBefore, trialsHistory, gameType) {
    return new ApiClient().sendTrials(allUnsentTrials, totalTrialsSentBefore, gameType).then(() => {
        const markedHistory = markTrialsAsSent(trialsHistory);
        return markedHistory;
    });
}

function markTrialsAsSent(trials) {
    return trials.map((trial) => {
        return {
            ...trial,
            sentToBackend: true,
        };
    });
}
