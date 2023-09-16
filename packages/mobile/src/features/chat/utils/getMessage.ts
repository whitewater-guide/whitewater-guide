import type { MatrixEvent } from 'matrix-js-sdk';

import type { TextMessage } from '~/features/chat/types';

export function getMessage(event: MatrixEvent): string {
  return event.getContent<TextMessage>().body;
}
