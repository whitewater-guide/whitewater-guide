import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { AdminOnly } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import React from 'react';
import { Clipboard, DeleteButton } from '../../../components';
import { paths } from '../../../utils';
import MergeSectionsButton from './MergeSectionsButton';
import SectionMenuItem from './SectionMenuItem';

interface Props {
  regionId: string;
  section: Section;
  deleteHandler?: (id?: string) => void;
}

const SectionMenu = React.memo(
  ({ section, regionId, deleteHandler }: Props) => {
    const { id: sectionId } = section;
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (e: React.MouseEvent<any>) => {
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
      <React.Fragment>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={handleClose}
          autoFocus={false}
          disableAutoFocusItem={true}
          disableEnforceFocus={true}
          disableRestoreFocus={true}
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
      </React.Fragment>
    );
  },
);

export default SectionMenu;
