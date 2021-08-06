import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { AdminOnly, ListedSectionFragment } from '@whitewater-guide/clients';
import React from 'react';

import { Clipboard, DeleteButton } from '../../../components';
import { paths } from '../../../utils';
import MergeSectionsButton from './MergeSectionsButton';
import SectionMenuItem from './SectionMenuItem';

interface Props {
  regionId: string;
  section: ListedSectionFragment;
  deleteHandler?: (id?: string) => void;
}

const SectionMenu = React.memo(
  ({ section, regionId, deleteHandler }: Props) => {
    const { id: sectionId } = section;
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
    };

    const handleClose = (e: any) => {
      e.stopPropagation();
      setAnchorEl(null);
    };

    const handleDelete = (id?: string) => {
      setAnchorEl(null);
      deleteHandler?.(id);
    };

    return (
      <>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={handleClose}
          autoFocus={false}
          disableAutoFocusItem
          disableEnforceFocus
          disableRestoreFocus
        >
          <Clipboard text={sectionId} onCopy={handleClose}>
            <SectionMenuItem icon="code" label="Copy id" />
          </Clipboard>

          <SectionMenuItem
            icon="file_copy"
            label="Duplicate"
            to={paths.to({ regionId, sectionId: `new?copy=${sectionId}` })}
          />

          <AdminOnly>
            <SectionMenuItem
              icon="settings"
              label="Administrate"
              to={paths.admin({ regionId, sectionId })}
            />
          </AdminOnly>

          <DeleteButton id={sectionId} deleteHandler={handleDelete}>
            <SectionMenuItem icon="delete" label="Delete" />
          </DeleteButton>

          <MergeSectionsButton section={section} onClick={handleClose} />
        </Menu>
      </>
    );
  },
);

SectionMenu.displayName = 'SectionMenu';

export default SectionMenu;
