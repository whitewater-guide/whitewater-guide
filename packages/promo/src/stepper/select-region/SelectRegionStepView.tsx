import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { FC, useState } from 'react';

import { StepFooter } from '../../components';
import { PromoRegionFragment } from '../promoRegion.generated';
import NoRegions from './NoRegions';
import { usePromoRegionsQuery } from './promoRegions.generated';
import RegionSelector from './RegionSelector';

const useStyles = makeStyles((theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
    button: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
    },
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  }),
);

type Props = Omit<StepProps, 'classes'> & {
  prev: () => void;
  next: (region: PromoRegionFragment) => void;
};

const SelectRegionStepView: FC<Props> = (props) => {
  const { prev, next, ...stepProps } = props;
  const classes = useStyles();
  const [region, setRegion] = useState<PromoRegionFragment | null>(null);
  const { data, loading } = usePromoRegionsQuery();

  const onNext = async () => {
    if (region) {
      next(region);
      setRegion(null);
    }
  };

  const onPrev = () => {
    setRegion(null);
    prev();
  };

  let content: React.ReactElement;
  if (loading || !data) {
    content = <LinearProgress />;
  } else if (data.promoRegions.length === 0) {
    content = <NoRegions />;
  } else {
    content = (
      <RegionSelector
        regions={data.promoRegions}
        value={region}
        onChange={setRegion}
      />
    );
  }

  return (
    <StepContent {...stepProps}>
      {content}
      <Divider className={classes.divider} />
      <StepFooter
        onPrev={onPrev}
        onNext={onNext}
        nextDisabled={!region}
        nextLoading={false}
      />
    </StepContent>
  );
};

export default SelectRegionStepView;
