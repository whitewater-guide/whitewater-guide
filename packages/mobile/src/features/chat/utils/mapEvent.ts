import { MatrixEvent } from 'matrix-js-sdk';

export function mapEvent(event: MatrixEvent) {
  return {
    id: event.getId(),
    type: event.getType(),
    content: event.getContent(),
    date: event.getDate(),
  };
}
