import {OperationCategory} from "../models/operations/Category";
import {AndroidV1Data} from "./AndroidV1Data";
import DeviceInfo from "react-native-device-info";
import {NativeSharedPreferences} from "./shared_preferences/NativeSharedPreferences";
import {AppDataStorage} from "../storage/AppDataStorage";

export class Version1DataMigrator {
    static async wasMigratedBefore() {
        return await Version1DataMigrator._checkMigrated();
    }

    static newForProduction() {
        const nativeSharedPreferences = new NativeSharedPreferences();
        const deviceInfoClass = DeviceInfo;
        return new Version1DataMigrator(nativeSharedPreferences, deviceInfoClass);
    }

    constructor(sharedPreferences, deviceInfoClass) {
        this._androidV1Data = new AndroidV1Data(sharedPreferences, deviceInfoClass);
    }

    async getRawDataForDebugging() {
        return this._androidV1Data.getRaw();
    }

    async migrateAll() {
        await this.migratePersonalDataSentStatus();
        await this.migratePlayedLevelsStats();
        await this.migrateStatsPerOperation();
        await this._persistThatDataWasMigrated();
    }

    async migratePlayedLevelsStats() {
        const playedLevelsStats = await this.getPlayedLevelsStats();
        await this._storePlayedLevelStats(playedLevelsStats);
    }

    async migrateStatsPerOperation() {
        const statsData = await this.getStatsPerOperation();
        await this._storeStatsData(statsData);
    }

    async migratePersonalDataSentStatus() {
        const wasPersonalDataSent = await this.wasPersonalDataSent();
        if (wasPersonalDataSent) {
            await this._persistThatPersonalDataWasSent();
        }
    }

    // get data

    async wasPersonalDataSent() {
        return await this._androidV1Data.wasPersonalDataSent();
    }

    async getPlayedLevelsStats() {
        const starsPerLevel = await this._androidV1Data.getLevelsStars();
        const trialsTimePerLevel = await this._androidV1Data.getLevelsTotalTimes();

        if (trialsTimePerLevel.length === 0 || starsPerLevel.length === 0) {
            return {};
        }

        return this._buildPlayedLevelsStats(trialsTimePerLevel, starsPerLevel);
    }

    async getStatsPerOperation() {
        let statsPerOperation = [];

        for (const category of OperationCategory.allCategories()) {
            statsPerOperation.push(await this._buildStatsForCategory(category));
        }

        return statsPerOperation;
    }

    // private - build data

    _buildPlayedLevelsStats(trialsTimePerLevel, starsPerLevel) {
        let levelData = {};

        const trialsTimePerPlayedLevel = trialsTimePerLevel.filter((time) => time > 0);

        trialsTimePerPlayedLevel.forEach((trialsTime, index) => {
            const numLevel = index + 1;
            levelData[numLevel] = {
                stars: starsPerLevel[index],
                totalTrialsTime: trialsTime,
                levelCompleted: starsPerLevel[index] > 0,
            }
        });

        return levelData;
    }

    async _buildStatsForCategory(category) {
        const codename = category.codename();
        const correctTimes = await this._androidV1Data.getCorrectTimesForOperation(codename);
        const incorrectTimes = await this._androidV1Data.getIncorrectTimesForOperation(codename);

        return {
            categoryCodename: codename,
            correctTrialsTimes: correctTimes,
            incorrectTrialsTimes: incorrectTimes,
        }
    }

    // private - store data

    async _persistThatPersonalDataWasSent() {
        // NOTE: This normally has all the personal info data.
        // For now, we'll not migrate this data as it's not needed anymore (because was sent once before).
        await AppDataStorage.save("personalInfo", {sentToBackend: true});
    }

    async _storeStatsData(statsData) {
        await AppDataStorage.save("stats", statsData);
    }

    async _storePlayedLevelStats(statsData) {
        await AppDataStorage.save("playedLevelsStats", statsData);
    }

    async _persistThatDataWasMigrated() {
        await AppDataStorage.save("dataMigrated", true);
    }

    static async _checkMigrated() {
        const dataMigrated = await AppDataStorage.fetch("dataMigrated");
        return dataMigrated !== null;
    }

}
