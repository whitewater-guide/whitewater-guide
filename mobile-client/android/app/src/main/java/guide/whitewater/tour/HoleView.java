package guide.whitewater.tour;

import android.content.Context;
import android.view.MotionEvent;

import com.facebook.react.views.view.ReactViewGroup;

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
//        Log.d("--------------", this.getPointerEvents().toString());
        if (this.hole.isInside(e.getX(), e.getY())) {
            return true;
        }
        return super.onInterceptTouchEvent(e);
//        return true;
    }

    @Override
    public boolean onTouchEvent(MotionEvent e) {
//        return false;
      return !this.hole.isInside(e.getX(), e.getY());
    }
}
