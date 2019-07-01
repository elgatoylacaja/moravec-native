import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PERSONAL_INFO_FORM, TERMS_AND_CONDITIONS} from "../reducers/personal_info_reducer";
import {agreeTerms} from "../actions/personal_info_actions";
import {TermsAndConditions} from "../components/personalInfo/TermsAndConditions";
import {PersonalInfoForm} from "../components/personalInfo/PersonalInfoForm";
import {AppDataStorage} from "../storage/AppDataStorage";
import {sendPersonalInfo} from "../send_data";
import AsyncStorage from '@react-native-community/async-storage';

const mapStateToProps = (state) => {
    return {
        state: state.personalInfo.state,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            agreeTerms: () => {
                dispatch(agreeTerms())
            },
        }
    }
};

class PersonalInfo extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(personalInfo) {
        personalInfo['sentToBackend'] = false;
        const storageBackend = AsyncStorage;
        const appDataStorage = new AppDataStorage(storageBackend);
        appDataStorage.save('personalInfo', personalInfo).then(() => {
            sendPersonalInfo(personalInfo, appDataStorage).then(() => {
                this.goToHome();
            });
        });
    };

    goToHome() {
        this.props.navigation.navigate('Home');
    }

    render() {
        if (this.props.state === TERMS_AND_CONDITIONS) {
            return <TermsAndConditions handleAgreeTerms={this.props.actions.agreeTerms}/>
        } else if (this.props.state === PERSONAL_INFO_FORM) {
            return <PersonalInfoForm onSubmit={this.onSubmit}/>;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfo);
