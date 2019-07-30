import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { NamedNode } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { Multicomplete } from './Multicomplete';
import { MulticompleteProps } from './types';

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

interface StoryProps
  extends Omit<MulticompleteProps, 'values' | 'onAdd' | 'onDelete'> {
  initialValues?: NamedNode[];
}

const Story: React.FC<StoryProps> = ({ initialValues = [], ...props }) => {
  const [values, setValues] = useState<NamedNode[]>(initialValues);
  const onAdd = useCallback(
    (v: NamedNode) => {
      setValues([...values, v]);
    },
    [values, setValues],
  );
  const onDelete = useCallback(
    (id: string) => {
      setValues(values.filter((v) => v.id !== id));
    },
    [values, setValues],
  );
  return (
    <div>
      <Multicomplete
        {...props}
        values={values}
        onAdd={onAdd}
        onDelete={onDelete}
      />
      <div>{`Selected: ${JSON.stringify(values)}`}</div>
    </div>
  );
};

storiesOf('Multicomplete', module)
  .addDecorator((story) => <div>{story()}</div>)
  .add('default', () => {
    return (
      <Multicomplete
        options={options}
        values={[options[0], options[1]]}
        onAdd={action('add')}
        onDelete={action('delete')}
      />
    );
  })
  .add('controlled', () => {
    return <Story options={options} initialValues={[options[0], options[1]]} />;
  })
  .add('bottom of the screen', () => {
    return (
      <div style={{ marginTop: 500 }}>
        <Story options={options} initialValues={[options[0], options[1]]} />
      </div>
    );
  });
