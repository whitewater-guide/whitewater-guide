import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import { Tag } from '@whitewater-guide/commons';
import xorBy from 'lodash/xorBy';
import React, { useCallback } from 'react';

interface Props {
  tag: Tag;
  selected: Tag[];
  onChange: (value: Tag[]) => void;
}

const TagChip: React.FC<Props> = React.memo((props) => {
  const { tag, selected, onChange } = props;
  const isSelected = !!selected.find(({ id }) => id === tag.id);
  const onClick = useCallback(() => {
    onChange(xorBy(selected, [tag], 'id'));
  }, [tag, selected, onChange]);
  return (
    <Chip
      label={tag.name}
      clickable={true}
      color={isSelected ? 'primary' : 'default'}
      onClick={onClick}
      icon={
        <Icon>
          {isSelected ? 'check_circle_outline' : 'radio_button_unchecked'}
        </Icon>
      }
    />
  );
});

TagChip.displayName = 'TagChip';

export default TagChip;
