import { MediaKind } from '@whitewater-guide/schema';

import { LocalPhoto } from '../../../../utils/files';

export interface MediaDialogProps {
  open: boolean;
  prefix?: string;
  kind?: MediaKind;
  onCancel: () => void;
  onSubmit: () => any;
  localPhoto?: LocalPhoto;
}
