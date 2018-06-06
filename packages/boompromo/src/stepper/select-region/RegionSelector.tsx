import Popover from '@material-ui/core/Popover';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Downshift from 'downshift';
import React from 'react';
import { NamedNode } from '../../ww-commons';
import filterRegions from './filterRegions';
import RegionItem from './RegionItem';

type ClassNames = 'container' | 'paper' | 'inputRoot';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 100,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

interface Props extends WithStyles<ClassNames> {
  regions: NamedNode[];
  value: NamedNode | null;
  onChange: (value: NamedNode | null) => void;
}

interface State {
  anchorEl?: HTMLElement;
}

const regionToString = (region: NamedNode | null) => (region ? region.name : '');

class RegionSelector extends React.PureComponent<Props, State> {
  state: State = { anchorEl: undefined };

  setAnchorEl = (anchorEl: any) => this.setState({ anchorEl });

  render() {
    const { regions, classes, value, onChange } = this.props;
    return (
      <Downshift itemToString={regionToString} onChange={onChange} selectedItem={value}>
        {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            selectedItem,
            highlightedIndex,
            openMenu,
            closeMenu,
            clearSelection,
        }) => (
          <div className={classes.container}>
            <TextField
              inputRef={this.setAnchorEl}
              InputProps={{
                onFocus: openMenu,
                classes: {
                  root: classes.inputRoot,
                },
                ...getInputProps({
                  placeholder: 'Выберите регион',
                  id: 'promo-region-input',
                  onChange: (e: any) => {
                    if (e.target.value === '') {
                      clearSelection();
                    }
                  },
                }),
              }}
            />

            <Popover
              open={isOpen}
              anchorEl={this.state.anchorEl}
              onClose={closeMenu as any}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              disableRestoreFocus
              disableAutoFocus
              disableEnforceFocus
            >
              {filterRegions(regions, inputValue).map((region, index) =>
                <RegionItem
                  key={region.id}
                  region={region}
                  index={index}
                  itemProps={getItemProps({ item: region })}
                  highlightedIndex={highlightedIndex}
                  selectedItem={selectedItem}
                />,
              )}
            </Popover>
          </div>
        )}
      </Downshift>
    );
  }
}

export default withStyles(styles)(RegionSelector);
