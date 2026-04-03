import { SectionsStatus, useSectionsList } from '@whitewater-guide/clients';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../../theme';

const BAR_HEIGHT = 32;

const styles = StyleSheet.create({
  body: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visible: {
    top: 0,
  },
  hidden: {
    top: -BAR_HEIGHT,
  },
  text: {
    color: theme.colors.textLight,
    fontSize: 12,
  },
});

function SectionsProgress() {
  const { status, sections, count } = useSectionsList();
  const { t } = useTranslation();
  const loaded = sections?.length ?? 0;

  const [debouncedStatus, setDebouncedStatus] = useState(status);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedStatus(status), 200);
    return () => clearTimeout(timer);
  }, [status]);

  const visible = debouncedStatus !== SectionsStatus.READY && loaded < count;

  const caption = t(
    debouncedStatus === SectionsStatus.LOADING
      ? 'region:sections.loading'
      : 'region:sections.loadingUpdates',
    { loaded, count },
  );

  return (
    <View style={[styles.body, visible ? styles.visible : styles.hidden]}>
      <Text style={styles.text}>{caption}</Text>
    </View>
  );
}

export default SectionsProgress;
