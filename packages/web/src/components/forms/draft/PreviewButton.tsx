import React from 'react';

interface Props {
  enabled: boolean;
  onToggle?: () => void;
}

const PreviewButton: React.SFC<Props> = ({ enabled, onToggle }) => (
  <div
    className={enabled ? 'rdw-option-active rdw-option-wrapper' : 'rdw-option-wrapper'}
    onClick={onToggle}
  >
    md
 ️</div>
);

export default PreviewButton;
