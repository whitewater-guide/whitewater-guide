import { createAction } from 'redux-actions';

export const GUIDE_STEP_SHOW = 'GUIDE_STEP_SHOW';
export const GUIDE_STEP_HIDE = 'GUIDE_STEP_HIDE';
export const GUIDE_STEP_COMPLETE = 'GUIDE_STEP_COMPLETE';
export const GUIDE_OVERLAY_LAYOUT = 'GUIDE_OVERLAY_LAYOUT';

export const completeGuideStep = createAction(GUIDE_STEP_COMPLETE, step => ({ step }));
export const showGuideStep = createAction(GUIDE_STEP_SHOW, step => ({ step }));
export const hideGuideStep = createAction(GUIDE_STEP_HIDE, step => ({ step }));
export const guideOverlayLayout = createAction(GUIDE_OVERLAY_LAYOUT, (step, layout) => ({ step, layout }));
