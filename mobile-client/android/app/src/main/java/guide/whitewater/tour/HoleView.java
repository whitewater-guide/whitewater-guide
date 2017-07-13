package guide.whitewater.tour;

import android.content.Context;
import android.graphics.Point;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

import com.facebook.react.views.view.ReactViewGroup;
import com.horcrux.svg.SvgView;

public class HoleView extends ReactViewGroup {

    private IHole hole;

    public HoleView(Context context) {
        super(context);
    }

    public void setHole(IHole hole) {
        this.hole = hole;
    }



    @Override
    public boolean onInterceptTouchEvent(MotionEvent e) {
        Log.d("--------------", whatTouches(e.getX(), e.getY()));
        if (this.hole.isInside(e.getX(), e.getY())) {
            return true;
        }
        return super.onInterceptTouchEvent(e);
//        return true;
    }

    public String whatTouches(float x, float y) {
        String result = "nothing";
        for(int i = 0; i < this.getChildCount(); i++) {
            View child = this.getChildAt(i);
            boolean isSvg = child instanceof SvgView;
            if (isSvg) {
                result = "svg";
                int tag = ((SvgView) child).getShadowNode().hitTest(new Point((int) x, (int) y));
                if (tag == -1) {
                    result = "hole";
                }
                break;
            }
        }
        return result;
    }

    @Override
    public boolean onTouchEvent(MotionEvent e) {
//        return false;
      return !this.hole.isInside(e.getX(), e.getY());
    }
}
