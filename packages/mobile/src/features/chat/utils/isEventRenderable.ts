import { EventType, MatrixEvent } from 'matrix-js-sdk';

export function isEventRenderable(event: MatrixEvent): boolean {
  const type = event.getType();
  return type === EventType.RoomMessage || type === EventType.RoomCreate;
}
