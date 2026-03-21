import type { MediaKind } from '@whitewater-guide/schema';

import type { LocalPhoto } from '../../../../utils/files';

export interface MediaDialogProps {
  open: boolean;
  prefix?: string;
  kind?: MediaKind;
  onCancel: () => void;
  onSubmit: () => any;
  localPhoto?: LocalPhoto;
}
