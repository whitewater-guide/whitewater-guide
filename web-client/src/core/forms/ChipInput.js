import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MUIChipInput from 'material-ui-chip-input';
import _ from 'lodash';
import {findDOMNode} from 'react-dom';
import EventListener, {withOptions} from 'react-event-listener';

const MAX_HEIGHT = 250;

class ChipInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    options: PropTypes.array,
    field: PropTypes.shape({
      value: PropTypes.array,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
  };

  static defaultProps = {
    options: [],
  };

  state = {
    direction: {
      anchorOrigin: {horizontal: "left", vertical: "bottom"},
      targetOrigin: {horizontal: "left", vertical: "top"},
    },
    open: false,
  };

  render() {
    const {field, options} = this.props;
    const dataSourceConfig = {text: 'name', value: '_id'};
    //Value is array of strings, but must be array of objects from options
    let value = field.value || [];
    value = _.map(value, (chipValue) => {
      return _.find(options, {_id: chipValue._id});
    });
    value = _.compact(value);
    return (
      <div>
        <EventListener target="document" onScroll={withOptions(this.updateDirection, {passive: true, capture: true})} onResize={this.updateDirection}/>
        <MUIChipInput
          ref={this.onMount}
          fullWidth={true}
          openOnFocus={true}
          value={value}
          dataSource={options}
          dataSourceConfig={dataSourceConfig}
          errorText={this.props.field.error}
          onRequestAdd={this.onRequestAdd}
          onRequestDelete={this.onRequestDelete}
          floatingLabelText={this.props.title}
          hintText={this.props.title}
          menuStyle={{maxHeight: MAX_HEIGHT}}
          onFocus={this.onFocus}
          {...this.state.direction}
        />
      </div>
    );
  }

  onMount = (node) => {
    if (node) {
      this.self = node;
      this.updateDirection();
    }
  };

  onRequestAdd = (chip) => {
    let value = this.props.field.value || [];
    this.props.field.onChange([...value, chip]);
  };

  onRequestDelete = (_id) => {
    const {field: {value}} = this.props;
    // console.log('On chip delete', value, chip);
    this.props.field.onChange(_.reject(value, {_id}));
  };

  updateDirection = () => {
    const rect = findDOMNode(this.self).getBoundingClientRect();
    const bottom = window.innerHeight - rect.bottom;
    this.setState({
      direction: {
        anchorOrigin: {horizontal: "left", vertical: bottom < MAX_HEIGHT ? "top" : "bottom"},
        targetOrigin: {horizontal: "left", vertical: bottom < MAX_HEIGHT ? "bottom" : "top"},
      }
    });
  };

}

export default ChipInput;