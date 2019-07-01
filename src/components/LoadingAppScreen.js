import React from "react";
import {Platform, View} from "react-native";
import {Spinner} from "native-base";
import {MAIN_STYLES, spinnerColor} from "../styles/main/styles";
import {Version1DataMigrator} from "../android_v1_migration/Version1DataMigrator";
import {AppDataStorage} from "../storage/AppDataStorage";
import {sendPersonalInfo} from "../send_data";
import SplashScreen from 'react-native-splash-screen'
import DeviceInfo from "react-native-device-info";
import AsyncStorage from '@react-native-community/async-storage';


export class LoadingAppScreen extends React.Component {
    constructor(props) {
        super(props);
        const storageBackend = AsyncStorage;
        this._appDataStorage = new AppDataStorage(storageBackend);
    }

    componentDidMount() {
        SplashScreen.hide();

        this._migrateV1DataIfNeeded().then(() => {
            this._wasPersonalInfoCompletedBefore().then((wasCompletedBefore) => {
                if (!wasCompletedBefore) {
                    this.goToPersonalInfo();
                } else {
                    this._retrySendPersonalInfoIfNotSentBefore().then(() => {
                        this.goToHome();
                    });
                }
            });
        });
    }

    async _migrateV1DataIfNeeded() {
        if (Platform.OS !== "android") {
            return;
        }

        const deviceInfoObj = DeviceInfo;
        const storageBackend = AsyncStorage;
        const migrator = Version1DataMigrator.newForProduction(deviceInfoObj, storageBackend);
        const wasMigratedBefore = await migrator.wasMigratedBefore();
        if (!wasMigratedBefore) {
            return migrator.migrateAll();
        }
    }

    async _wasPersonalInfoCompletedBefore() {
        return await this._appDataStorage.exists('personalInfo');
    }

    async _retrySendPersonalInfoIfNotSentBefore() {
        const savedPersonalInfo = await this._appDataStorage.fetch('personalInfo');
        if (!savedPersonalInfo.sentToBackend) {
            return sendPersonalInfo(savedPersonalInfo, this._appDataStorage);
        }
    }

    goToHome() {
        this.props.navigation.navigate('Home');
    };

    goToPersonalInfo() {
        this.props.navigation.navigate('PersonalInfo');
    };

    render() {
        return (
            <View style={MAIN_STYLES.main}>
                <Spinner color={spinnerColor}/>
            </View>
        )
    }
}
