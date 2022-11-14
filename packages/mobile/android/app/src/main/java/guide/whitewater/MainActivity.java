package guide.whitewater;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "whitewater";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        RNBootSplash.init(this); // <- initialize the splash screen
        super.onCreate(null); // or super.onCreate(null) with react-native-screens
    }

}
