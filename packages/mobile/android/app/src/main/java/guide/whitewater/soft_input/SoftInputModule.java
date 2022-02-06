package guide.whitewater.soft_input;

import android.app.Activity;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class SoftInputModule extends ReactContextBaseJavaModule {

    public SoftInputModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "SoftInputModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("ADJUST_PAN", WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        constants.put("ADJUST_RESIZE", WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        return constants;
    }

    @ReactMethod
    public void setSoftInputMode(int mode) {
        final Activity activity = getCurrentActivity();

        if (activity == null) {
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                activity.getWindow().setSoftInputMode(mode);
            }
        });
    }

}
