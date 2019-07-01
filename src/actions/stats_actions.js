import {AppDataStorage} from "../storage/AppDataStorage";
import {emptyStats} from "../reducers/game_reducer";
import AsyncStorage from "@react-native-community/async-storage";

export const CALCULATE_STATS = 'CALCULATE_STATS';

export function fetchOperationCategoryStats() {
    return (dispatch) => {
        let stats = emptyStats();
        const storageBackend = AsyncStorage;
        const appDataStorage = new AppDataStorage(storageBackend);
        appDataStorage.fetch('stats').then((savedStats) => {
            if (savedStats !== null) {
                stats = savedStats;
            }
            dispatch(calculateStats(stats));
        });
    }
}

function calculateStats(stats) {
    return {
        type: CALCULATE_STATS,
        stats: stats
    }
}
