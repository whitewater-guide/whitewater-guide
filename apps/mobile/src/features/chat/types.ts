import type { EventTimeline, MsgType } from 'matrix-js-sdk';

// This type is not exported from matrix-js-sdk
export interface IRoomTimelineData {
  timeline: EventTimeline;
  liveEvent?: boolean;
}

export interface TextMessage {
  msgtype: MsgType.Text;
  body: string;
}
