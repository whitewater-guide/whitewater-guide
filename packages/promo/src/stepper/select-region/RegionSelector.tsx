import { MenuList } from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Downshift from 'downshift';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { PromoRegionFragment } from '../promoRegion.generated';
import filterRegions from './filterRegions';
import RegionItem from './RegionItem';

const useStyles = makeStyles((theme) =>
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
  }),
);

interface Props {
  regions: PromoRegionFragment[];
  value: PromoRegionFragment | null;
  onChange: (value: PromoRegionFragment | null) => void;
}

const regionToString = (region: PromoRegionFragment | null) =>
  region?.name ?? '';

const RegionSelector: React.FC<Props> = (props) => {
  const { regions, value, onChange } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
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
            disableRestoreFocus
            disableAutoFocus
            disableEnforceFocus
          >
            <MenuList>
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
            </MenuList>
          </Popover>
        </div>
      )}
    </Downshift>
  );
};

export default RegionSelector;
