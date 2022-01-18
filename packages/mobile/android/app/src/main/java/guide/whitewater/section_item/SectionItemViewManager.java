package guide.whitewater.section_item;


import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.ReactFontManager;

import guide.whitewater.R;

public class SectionItemViewManager extends SimpleViewManager<RelativeLayout> {
    public static final String REACT_CLASS = "RNSectionItem";

    private static final String STAR = new String(Character.toChars(984270));
    private static final String STAR_OUTLINE = new String(Character.toChars(984274));
    private static final String STAR_HALF = new String(Character.toChars(984272));
    private static final String OPEN_LOCK = new String(Character.toChars(983872));

    ReactApplicationContext mCallerContext;
    Typeface materialCommunityIcons;

    public SectionItemViewManager(ReactApplicationContext reactContext) {
        mCallerContext = reactContext;
        materialCommunityIcons = ReactFontManager.getInstance().getTypeface("MaterialCommunityIcons", 300, false, reactContext.getAssets());
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    public RelativeLayout createViewInstance(ThemedReactContext context) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        RelativeLayout layout = (RelativeLayout) inflater.inflate(R.layout.section_item, null);

        TextView rating = layout.findViewById(R.id.rating);
        rating.setTypeface(materialCommunityIcons);

        TextView demo = layout.findViewById(R.id.demo);
        demo.setTypeface(materialCommunityIcons);
        demo.setText(OPEN_LOCK);

        return layout;
    }

    @ReactProp(name = "difficulty")
    public void setDifficulty(RelativeLayout view, String value) {
        TextView txt = view.findViewById(R.id.difficulty);
        txt.setText(value);
    }

    @ReactProp(name = "difficultyExtra")
    public void setDifficultyExtra(RelativeLayout view, @Nullable String value) {
        TextView txt = view.findViewById(R.id.difficultyExtra);
        if (value == null || value.length() == 0) {
            txt.setVisibility(View.GONE);
        } else {
            txt.setVisibility(View.VISIBLE);
            txt.setText("(" + value + ")");
        }
    }

    @ReactProp(name = "riverName")
    public void setRiverName(RelativeLayout view, String value) {
        TextView txt = view.findViewById(R.id.river_name);
        txt.setText(value);
    }

    @ReactProp(name = "sectionName")
    public void setSectionName(RelativeLayout view, String value) {
        TextView txt = view.findViewById(R.id.section_name);
        txt.setText(value);
    }

    @ReactProp(name = "rating", defaultFloat = -1.0f)
    public void setRating(RelativeLayout view, float value) {
        TextView txt = view.findViewById(R.id.rating);
        if (value < 0) {
            txt.setVisibility(View.GONE);
        } else {
            txt.setVisibility(View.VISIBLE);
            txt.setText(getStarString(value));
        }
    }

    @ReactProp(name = "verified", defaultBoolean = true)
    public void setVerified(RelativeLayout view, boolean value) {
        TextView txt = view.findViewById(R.id.unverified);
        if (value) {
            txt.setVisibility(View.GONE);
        } else {
            txt.setVisibility(View.VISIBLE);
        }
    }

    @ReactProp(name = "demo", defaultBoolean = false)
    public void setDemo(RelativeLayout view, boolean value) {
        TextView txt = view.findViewById(R.id.demo);
        if (value) {
            txt.setVisibility(View.VISIBLE);
        } else {
            txt.setVisibility(View.GONE);
        }
    }

    @ReactProp(name = "flows")
    public void setFlows(RelativeLayout view, @Nullable ReadableMap value) {
        LinearLayout group = view.findViewById(R.id.flows_group);
        if (value == null || !value.hasKey("value")) {
            group.setVisibility(View.GONE);
        } else {
            group.setVisibility(View.VISIBLE);

            String colorStr = value.getString("color");
            int color = Color.parseColor(colorStr);

            TextView valTxt = view.findViewById(R.id.flow_value);
            valTxt.setText(value.getString("value"));
            valTxt.setTextColor(color);

            TextView unitTxt = view.findViewById(R.id.flow_unit);
            unitTxt.setText(value.getString("unit"));
            unitTxt.setTextColor(color);

            TextView timeTxt = view.findViewById(R.id.flow_time);
            timeTxt.setText(value.getString("fromNow"));
        }
    }

    private static String getStarString(float value) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            if (value - i == 0.5) {
                result.append(STAR_HALF);
            } else if (value > i) {
                result.append(STAR);
            } else {
                result.append(STAR_OUTLINE);
            }
        }
        return result.toString();
    }
}
