package guide.whitewater.tour;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewManager;

public class HoleViewManager extends ReactViewManager {

    public static final String REACT_CLASS = "HoleView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }
    @Override
    public HoleView createViewInstance(ThemedReactContext context) {
        return new HoleView(context);
    }

    @ReactProp(name = "hole")
    public void setHole(HoleView view, ReadableMap hole) {
        String holeType = hole.getString("type");
        switch (holeType) {
            case "circle":
                view.setHole(new CircleHole(hole));
                break;
            case "rect":
                view.setHole(new RectHole(hole));
                break;
        }
    }
}