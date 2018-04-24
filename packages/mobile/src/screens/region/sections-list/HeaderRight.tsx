import React from 'react';
import FilterButton from '../FilterButton';
import SearchButton from '../SearchButton';

const HeaderRight: React.StatelessComponent = () => (
  <React.Fragment>
    <SearchButton />
    <FilterButton />
  </React.Fragment>
);

export default HeaderRight;
