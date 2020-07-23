import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Paragraph, Subheading, Title, Caption } from 'react-native-paper';
import { Left, Right, Row } from '~/components/Row';
import theme from '~/theme';
import format from 'date-fns/format';
import { Descent } from '@whitewater-guide/commons';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  title: {
    paddingLeft: theme.margin.single,
  },
  commentHeader: {
    marginVertical: theme.margin.single,
    fontWeight: '600',
  },
  commentBlock: {
    marginTop: theme.margin.double,
    paddingLeft: theme.margin.single,
  },
});

interface Props {
  descent: Descent;
}

const DescentInfo = ({ descent }: Props) => {
  const { t } = useTranslation();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.title}>
        <Title>
          {descent.section.river.name + '- ' + descent.section.name}
        </Title>
        <Caption>{descent.section.region.name}</Caption>
      </View>

      <Row>
        <Left>
          <Subheading>{t('screens:descent.info.startedAt')}</Subheading>
        </Left>
        <Right>
          <Paragraph>
            {format(new Date(descent.startedAt), 'dd LLLL yyyy HH:mm')}
          </Paragraph>
        </Right>
      </Row>

      <Row>
        <Left>
          <Subheading>{t('screens:descent.info.level')}</Subheading>
        </Left>
        <Right>
          <Paragraph>
            {descent.level?.value + ' ' + descent.level?.unit}
          </Paragraph>
        </Right>
      </Row>

      <View style={styles.commentBlock}>
        <Subheading style={styles.commentHeader}>
          {t('screens:descent.info.commentHeader')}
        </Subheading>
        <Paragraph>{descent.comment}</Paragraph>
      </View>
    </ScrollView>
  );
};

export default DescentInfo;
