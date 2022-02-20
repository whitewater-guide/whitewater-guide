import { EventType, MatrixEvent } from 'matrix-js-sdk';

export function isEventRenderable(event: MatrixEvent): boolean {
  const type = event.getType();
  if (event.isRelation('m.replace')) {
    return false;
  }
  return type === EventType.RoomMessage || type === EventType.RoomCreate;
}
