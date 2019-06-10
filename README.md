# Moravec

Requirements: Node 10.15 LTS, Java 8.

## Running integration tests

Just set ENVFILE var to '.env.test' before running the app.

On Webstorm, you can duplicate the original app runner and set this Environment variable on the configuration window 
for the copy.

Tests results will appear in log console. 


## Playing tutorial videos

Create a new file named 'secrets.js' on the root directory.

On secrets.js, add a constant with name 'YOUTUBE_API_KEY' that contains the api key of YouTube API for Moravec
by adding the following line:

    export const YOUTUBE_API_KEY = "paste_key_here";

## Releasing a new version

### 0. First time setup: Android APK signature config

Copy APK signature config (gradle.properties and .keystore file) into android/app.

### 1. Run all tests and make sure they pass

Run Unit tests with:

    jest

Run integration tests on Android with:

    ENVFILE=.env.test react-native run-android

Run integration tests on iOS with:

    ENVFILE=.env.test react-native run-ios
    
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
