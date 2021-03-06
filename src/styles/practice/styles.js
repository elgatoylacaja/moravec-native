import {
    advancedLevelColor,
    grayColor,
    greenColor,
    intermediateLevelColor,
    lightGrayColor,
    superLightGrayColor,
    whiteColor
} from "../global";
import {getWindowHeight, getWindowWidth} from "../../utils/get_window_info";

const windowHeight = getWindowHeight();
const windowWidth = getWindowWidth();

export const PRACTICE_MODE_SELECTION_STYLES = {
    content: {
        ios: {
            height: getWindowHeight() * 0.9,
        },
        android: {
            height: getWindowHeight() * 0.86,
        }
    },
    container: {
        justifyContent: 'space-between',
        backgroundColor: lightGrayColor,
        borderStyle: 'solid',
        borderLeftWidth: 3,
        borderLeftColor: superLightGrayColor,
        borderRightWidth: 3,
        borderRightColor: superLightGrayColor,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    option: {
        height: windowHeight * 0.15,
        width: windowWidth * 0.33,
        paddingTop: 4,
        backgroundColor: whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderTopWidth: 2,
        borderTopColor: superLightGrayColor,
        borderBottomWidth: 2,
        borderBottomColor: superLightGrayColor,
        borderLeftWidth: 2,
        borderLeftColor: superLightGrayColor,
        borderRightWidth: 2,
        borderRightColor: superLightGrayColor,
    },
    operationCategoryName: {
        fontSize: 25,
        fontFamily: 'GothamMedium',
        color: grayColor,
        letterSpacing: 2,
    },
    difficultyInitial: {
        color: greenColor,
        fontFamily: 'Gotham-Book',
    },
    difficultyIntermediate: {
        color: intermediateLevelColor,
        fontFamily: 'Gotham-Book',
    },
    difficultyAdvanced: {
        color: advancedLevelColor,
        fontFamily: 'Gotham-Book',
    },
};