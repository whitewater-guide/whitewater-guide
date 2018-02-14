import { InjectedFormProps } from 'redux-form';
import { Region, River, SectionInput } from '../../../ww-commons';

export type SectionFormProps = {region: Region, river: River | null } & InjectedFormProps<SectionInput>;
