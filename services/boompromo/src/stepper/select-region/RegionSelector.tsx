import Popover from '@material-ui/core/Popover';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Region } from '@whitewater-guide/commons';
import Downshift from 'downshift';
import React from 'react';
import { useTranslation } from 'react-i18next';
import filterRegions from './filterRegions';
import RegionItem from './RegionItem';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      flexGrow: 1,
      position: 'relative',
    },
    paper: {
      position: 'absolute',
      zIndex: 100,
      marginTop: theme.spacing(),
      left: 0,
      right: 0,
    },
    inputRoot: {
      flexWrap: 'wrap',
    },
  });

interface Props extends WithStyles<typeof styles> {
  regions: Region[];
  value: Region | null;
  onChange: (value: Region | null) => void;
}

const regionToString = (region: Region | null) => (region ? region.name : '');

const RegionSelector: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { regions, classes, value, onChange } = props;
  return (
    <Downshift
      itemToString={regionToString}
      onChange={onChange}
      selectedItem={value}
    >
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
            inputRef={setAnchorEl}
            InputProps={{
              onFocus: openMenu,
              classes: {
                root: classes.inputRoot,
              },
              ...(getInputProps({
                placeholder: t('select:selectorPlaceholder'),
                id: 'promo-region-input',
                onChange: (e: any) => {
                  if (e.target.value === '') {
                    clearSelection();
                  }
                },
              }) as any),
            }}
          />

          <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={closeMenu as any}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            disableRestoreFocus={true}
            disableAutoFocus={true}
            disableEnforceFocus={true}
          >
            {filterRegions(regions, inputValue).map((region, index) => (
              <RegionItem
                key={region.id}
                region={region}
                index={index}
                itemProps={getItemProps({ item: region })}
                highlightedIndex={highlightedIndex}
                selectedItem={selectedItem}
              />
            ))}
          </Popover>
        </div>
      )}
    </Downshift>
  );
};

export default withStyles(styles)(RegionSelector);
