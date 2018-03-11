import * as React from 'react';
import ReactRating from 'react-rating';

export interface RatingProps {
  fontSize?: number;
  value?: number;
  onChange?: (value: number) => void;
}

export const Rating: React.StatelessComponent<RatingProps> = ({ fontSize = 24, value, onChange }) => (
  <ReactRating
    readonly={!onChange}
    start={0}
    stop={5}
    initialRating={value || 0}
    onChange={onChange}
    emptySymbol={<i className="material-icons" style={{ fontSize }}>star_border</i>}
    fullSymbol={<i className="material-icons" style={{ fontSize }}>star</i>}
  />
);
