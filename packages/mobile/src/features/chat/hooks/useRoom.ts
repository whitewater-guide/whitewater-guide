import { useChatClient } from '../ChatClientProvider';

export function useRoom(type: string, id: string) {
  const roomId = `${type}__${id}`;
  const client = useChatClient();
}
