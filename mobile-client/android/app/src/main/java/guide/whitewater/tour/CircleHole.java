package guide.whitewater.tour;

import android.content.res.Resources;
import android.util.DisplayMetrics;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;

public class CircleHole implements IHole {
    private float x;
    private float y;
    private float r2;
    private float radius;

    public CircleHole(float x, float y, float radius) {
        DisplayMetrics metrics = Resources.getSystem().getDisplayMetrics();
        float density = ((float)metrics.densityDpi / DisplayMetrics.DENSITY_DEFAULT);
        this.x = x * density;
        this.y = y * density;
        this.radius = radius * density;
        this.r2 = this.radius * this.radius;
    }

    public CircleHole(ReadableMap data) {
        this(
            (float) data.getDouble("x"),
            (float) data.getDouble("y"),
            (float) data.getDouble("radius")
        );
    }

    @Override
    public boolean isInside(float x, float y) {
        return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) <= r2;
    }
}