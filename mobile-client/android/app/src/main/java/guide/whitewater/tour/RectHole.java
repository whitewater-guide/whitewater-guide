package guide.whitewater.tour;

import com.facebook.react.bridge.ReadableMap;

public class RectHole implements IHole {
    private float x;
    private float y;
    private float width;
    private float height;

    public RectHole(float x, float y, float width, float height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public RectHole(ReadableMap data) {
        this(
            (float) data.getDouble("x"),
            (float) data.getDouble("y"),
            (float) data.getDouble("width"),
            (float) data.getDouble("heght")
        );
    }

    @Override
    public boolean isInside(float x, float y) {
        return x >= this.x &&
               x <= this.x + this.width &&
               y >= this.y &&
               y <= this.y + this.height;
    }
}
