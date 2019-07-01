package tedxperiments.math.entrenamente;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.bugsnag.BugsnagReactNative;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.kevinresol.react_native_default_preference.RNDefaultPreferencePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new AsyncStoragePackage(),
            BugsnagReactNative.getPackage(),
            new SplashScreenReactPackage(),
            new ReactNativeYouTube(),
            new SvgPackage(),
            new RNDeviceInfo(),
            new RNI18nPackage(),
            new KCKeepAwakePackage(),
            new VectorIconsPackage(),
            new ReactNativeConfigPackage(),
            new RNDefaultPreferencePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
