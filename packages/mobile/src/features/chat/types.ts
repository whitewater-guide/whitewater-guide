import { EventTimeline } from 'matrix-js-sdk';

// This type is not exported from matrix-js-sdk
export interface IRoomTimelineData {
  timeline: EventTimeline;
  liveEvent?: boolean;
}
