package guide.whitewater.soft_input;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SoftInputPackage implements ReactPackage {

   @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext context) {
       return Collections.emptyList();
   }

   @Override
   public List<NativeModule> createNativeModules(
           ReactApplicationContext context) {
       List<NativeModule> modules = new ArrayList<>();

       modules.add(new SoftInputModule(context));

       return modules;
   }

}
