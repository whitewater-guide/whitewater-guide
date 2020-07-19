import { DescentInput, DescentInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';
import { isInputValidResolver, TopLevelResolver } from '~/apollo';
import { isAuthenticatedResolver } from '~/apollo/enhancedResolvers';

interface Vars {
  descent: DescentInput;
  shareToken?: string | null;
}

const Struct = yup.object({
  descent: DescentInputSchema.clone(),
  shareToken: yup
    .string()
    .notRequired()
    .nullable(true),
});

const resolver: TopLevelResolver<Vars> = async (
  _,
  { descent, shareToken },
  { language, dataSources },
) => {
  return null;
};

const deleteDescent = isAuthenticatedResolver(
  isInputValidResolver(Struct, resolver),
);

export default deleteDescent;
