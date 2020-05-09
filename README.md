# Moravec

Requirements: 
- Node 10.20.1 LTS

For Android: 
- Java 8 (OpenJDK works)
- Android SDK 9.0

## Setup development environment

### Install requirements

Check requirements above to know the specific versions to install.

1. Install NodeJS. Using nvm is recommended, instead of global node installation.
2. Run `npm install` to install project dependencies.

For Android testing and building:
1. Install Java.
2. Install Android Studio.
3. Install Android SDK version needed using SDK Manager (from Android Studio). 

### Configure YouTube API Key

Create a new file named 'secrets.js' on the root directory.

On secrets.js, add a constant with name 'YOUTUBE_API_KEY' that contains the api key of YouTube API for Moravec
by adding the following line:

    export const YOUTUBE_API_KEY = "paste_key_here";

## Development

### Starting the app

Run `npm start`

### Running the app on a device

With the app started in background, run the following:

- Android: `react-native run-android`
- iOS:`react-native run-ios`

### Debugging

Shake the device to open up Developer's Menu on the phone.

## Running integration tests

Note: The app has to be started in background (see above) to run integration test suite.

Just set ENVFILE var to '.env.test' before running the app.

Run integration tests on Android with:

    ENVFILE=.env.test cavy run-android

Run integration tests on iOS with:

    ENVFILE=.env.test cavy run-ios

## Releasing a new version

### 0. First time setup: Android APK signature config

Copy APK signature config (gradle.properties and .keystore file) into android/app.

### 1. Run all tests and make sure they pass

Run Unit tests with:

    jest __tests__

Run integration tests on Android with:

    ENVFILE=.env.test cavy run-android

Run integration tests on iOS with:

    ENVFILE=.env.test cavy run-ios
    
Make sure all tests pass before proceeding.

### 2. Update version number and commit

- Change `version` string in `package.json`.
- Change `android:versionName` and `android:versionCode` (increase by 1) in 
`android/app/src/main/AndroidManifiest.xml`
- Change `versionName` and `versionCode` (increase by 1) in 
`android/app/build.gradle`
- Change `CFBundleShortVersionString` and `CFBundleVersion` (increase by 1) in `ios/Moravec/Info.plist`
- Commit the changes on master and push

### 3. Deploy sourcemaps

Run 

    ./deploy_sourcemaps [VERSION_NUMBER]
     
on the terminal, replacing [VERSION_NUMBER] accordingly.

### 4a. Build a new production release for Android

Build with:

    cd android
    ENVFILE=.env.production ./gradlew assembleRelease
    
Optional - Build AND install release:

    cd android
    ENVFILE=.env.production ./gradlew installRelease
        
### 4b. Build a new production release for iOS

Build the release using XCode.

### 5. Upload to Play Store and App Store

## Troubleshooting

#### The app always runs the integration tests (instead of running normally)

The build probably is not being rebuilt. Make a manual random change on `index.js` to force rebuild.
 