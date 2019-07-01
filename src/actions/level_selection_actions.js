import {AppDataStorage} from "../storage/AppDataStorage";
import AsyncStorage from "@react-native-community/async-storage";

export const LOAD_LEVELS_FROM_FILE = 'LOAD_LEVELS_FROM_FILE';
export const LOAD_LEVEL_STATS = 'LOAD_LEVEL_STATS';

export function loadLevels() {
    return {
        type: LOAD_LEVELS_FROM_FILE,
    }
}

export function getSavedLevelStatsFromDevice() {
    return (dispatch) => {
        const storageBackend = AsyncStorage;
        const appDataStorage = new AppDataStorage(storageBackend);
        appDataStorage.fetch('playedLevelsStats').then(playedLevelsStats => {
            dispatch({
                type: LOAD_LEVEL_STATS,
                playedLevelsStats: playedLevelsStats || {},
            });
        });
    }
}
