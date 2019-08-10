import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { NamedNode } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { AutocompleteProps } from './types';

const options: NamedNode[] = [
  { id: 'Afghanistan', name: 'Afghanistan' },
  { id: 'Aland Islands', name: 'Aland Islands' },
  { id: 'Albania', name: 'Albania' },
  { id: 'Algeria', name: 'Algeria' },
  { id: 'American Samoa', name: 'American Samoa' },
  { id: 'Andorra', name: 'Andorra' },
  { id: 'Angola', name: 'Angola' },
  { id: 'Anguilla', name: 'Anguilla' },
  { id: 'Antarctica', name: 'Antarctica' },
  { id: 'Antigua and Barbuda', name: 'Antigua and Barbuda' },
  { id: 'Argentina', name: 'Argentina' },
  { id: 'Armenia', name: 'Armenia' },
  { id: 'Aruba', name: 'Aruba' },
  { id: 'Australia', name: 'Australia' },
  { id: 'Austria', name: 'Austria' },
  { id: 'Azerbaijan', name: 'Azerbaijan' },
  { id: 'Bahamas', name: 'Bahamas' },
  { id: 'Bahrain', name: 'Bahrain' },
  { id: 'Bangladesh', name: 'Bangladesh' },
  { id: 'Barbados', name: 'Barbados' },
  { id: 'Belarus', name: 'Belarus' },
  { id: 'Belgium', name: 'Belgium' },
  { id: 'Belize', name: 'Belize' },
  { id: 'Benin', name: 'Benin' },
  { id: 'Bermuda', name: 'Bermuda' },
  { id: 'Bhutan', name: 'Bhutan' },
  {
    id: 'Bolivia, Plurinational State of',
    name: 'Bolivia, Plurinational State of',
  },
  {
    id: 'Bonaire, Sint Eustatius and Saba',
    name: 'Bonaire, Sint Eustatius and Saba',
  },
  { id: 'Bosnia and Herzegovina', name: 'Bosnia and Herzegovina' },
  { id: 'Botswana', name: 'Botswana' },
  { id: 'Bouvet Island', name: 'Bouvet Island' },
  { id: 'Brazil', name: 'Brazil' },
  {
    id: 'British Indian Ocean Territory',
    name: 'British Indian Ocean Territory',
  },
  { id: 'Brunei Darussalam', name: 'Brunei Darussalam' },
];

interface StoryProps extends Omit<AutocompleteProps, 'value' | 'onChange'> {
  initialValue?: NamedNode | null;
}

const Story: React.FC<StoryProps> = ({ initialValue = null, ...props }) => {
  const [value, setValue] = useState<NamedNode | null>(initialValue);
  const onChange = useCallback(
    (v: NamedNode | null) => {
      action(`Change: ${v}`);
      setValue(v);
    },
    [setValue],
  );
  return (
    <div>
      <Autocomplete {...props} value={value} onChange={onChange} />
      <div>{`Selected: ${JSON.stringify(value)}`}</div>
    </div>
  );
};

storiesOf('Autocomplete', module)
  .addDecorator((story) => <div>{story()}</div>)
  .add('default', () => {
    return (
      <Story
        options={options}
        label="Country"
        placeholder="Search for a country"
      />
    );
  })
  .add('allows null', () => {
    return (
      <Story
        options={options}
        label="Country"
        placeholder="Search for a country"
        allowNull={true}
      />
    );
  })
  .add('allows null, initialValue', () => {
    return (
      <Story
        initialValue={{ id: 'Belarus', name: 'Belarus' }}
        options={options}
        label="Country"
        placeholder="Search for a country"
        allowNull={true}
      />
    );
  })
  .add('no filter, disallow null', () => {
    return (
      <Story
        options={options}
        label="Country"
        placeholder="Search for a country"
        filterOptions={{ matchInput: true }}
      />
    );
  })
  .add('no filter, allow null', () => {
    return (
      <Story
        options={options}
        label="Country"
        placeholder="Search for a country"
        allowNull={true}
        filterOptions={{ matchInput: true }}
      />
    );
  });
