import { useApolloClient } from '@apollo/client';
import {
  RegionNameDocument,
  RegionNameQuery,
  RegionNameQueryVariables,
  sectionName,
  SectionNameDocument,
  SectionNameQuery,
  SectionNameQueryVariables,
} from '@whitewater-guide/clients';
import { useEffect } from 'react';

import { useChatClient } from '~/features/chat';

import { ChatNavProps } from './types';

export default function useChatHeaderTitle({
  navigation,
  route,
}: ChatNavProps) {
  const { roomId } = route.params;
  const apollo = useApolloClient();
  const { client: chats } = useChatClient();

  useEffect(() => {
    // Trying to read region or section name from local apollo cache
    const id = roomId.split(':')[0].slice(1);
    let name: string | undefined;
    const regName = apollo.cache.readQuery<
      RegionNameQuery,
      RegionNameQueryVariables
    >({
      query: RegionNameDocument,
      variables: { id },
    });
    name = regName?.region?.name;
    if (!name) {
      const sectName = apollo.cache.readQuery<
        SectionNameQuery,
        SectionNameQueryVariables
      >({
        query: SectionNameDocument,
        variables: { id },
      });
      name = sectionName(sectName?.section);
    }

    // If apollo cache doesn't contain this entity, resort to using room name
    // It might be in different language than user's language
    if (!name) {
      const room = chats.getRoom(roomId);
      name = room?.name;
    }

    navigation.setOptions({
      headerTitle: name,
    });
  }, [navigation, apollo, chats, roomId]);
}
