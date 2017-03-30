import React, { PropTypes } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Spinner } from 'native-base';

const styles = StyleSheet.create({
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function Screen({ children, loading, style }) {
  const contentStyle = loading ? styles.loadingContent : style;
  return (
    <Container>
      <Content contentContainerStyle={contentStyle}>
        {
          loading ?
            <Spinner /> :
            children
        }
      </Content>
    </Container>
  );
}

Screen.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  style: PropTypes.any,
};

Screen.defaultProps = {
  children: null,
  loading: false,
  style: null,
};
