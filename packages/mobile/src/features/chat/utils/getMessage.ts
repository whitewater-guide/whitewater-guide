import { MatrixEvent } from 'matrix-js-sdk';

import { TextMessage } from '~/features/chat/types';

export function getMessage(event: MatrixEvent): string {
  return event.getContent<TextMessage>().body;
}
