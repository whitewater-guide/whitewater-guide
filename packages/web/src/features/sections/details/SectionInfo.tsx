import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import {
  DifficultyFragment,
  renderDifficulty,
  SafeSectionDetails,
  sectionName,
  stringifySeason,
} from '@whitewater-guide/clients';
import { Durations, Tag, TagCategory } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';
import React from 'react';

import { Row, Title } from '../../../layout/details';

const useStyles = makeStyles((theme) =>
  createStyles({
    chip: {
      margin: theme.spacing(0.5),
    },
    root: {
      padding: theme.spacing(1),
    },
  }),
);

interface Props {
  section: SafeSectionDetails;
}

const renderTags = (tags: Tag[] | undefined, className: string) =>
  tags?.map((tag) => (
    <Chip key={tag.id} label={tag.name} className={className} />
  ));

const SectionInfo: React.FC<Props> = ({ section }) => {
  const classes = useStyles();
  let fullName = sectionName(section);
  if (section.altNames?.length) {
    fullName += ` (also known as ${section.altNames?.join(', ')})`;
  }
  const tagsByCategory = groupBy(section.tags, 'category');
  return (
    <Grid container className={classes.root}>
      <Row>
        <Title>Name</Title>
        <Grid>{fullName}</Grid>
      </Row>

      {section.difficulty && (
        <Row>
          <Title>Difficulty</Title>
          <Grid>{renderDifficulty(section as DifficultyFragment)}</Grid>
        </Row>
      )}

      <Row>
        <Title>Rating</Title>
        <Grid>
          <Rating value={section.rating} precision={0.5} readOnly />
        </Grid>
      </Row>

      <Row>
        <Title>Drop</Title>
        <Grid>{section.drop ? `${section.drop} m` : ''}</Grid>
      </Row>

      <Row>
        <Title>Length</Title>
        <Grid>{section.distance ? `${section.distance} km` : ''}</Grid>
      </Row>

      <Row>
        <Title>Duration</Title>
        <Grid>{section.duration && Durations.get(section.duration)}</Grid>
      </Row>

      <Row>
        <Title>Season</Title>
        <Grid>
          <div>{section.season}</div>
          <div>{stringifySeason(section.seasonNumeric)}</div>
        </Grid>
      </Row>

      <Row>
        <Title>Kayaking types</Title>
        <Grid>
          {renderTags(tagsByCategory[TagCategory.Kayaking], classes.chip)}
        </Grid>
      </Row>

      <Row>
        <Title>Hazards</Title>
        <Grid>
          {renderTags(tagsByCategory[TagCategory.Hazards], classes.chip)}
        </Grid>
      </Row>

      <Row>
        <Title>River supply types</Title>
        <Grid>
          {renderTags(tagsByCategory[TagCategory.Supply], classes.chip)}
        </Grid>
      </Row>

      <Row>
        <Title>Miscellaneous tags</Title>
        <Grid>
          {renderTags(tagsByCategory[TagCategory.Misc], classes.chip)}
        </Grid>
      </Row>

      <Row>
        <Title>Timezone</Title>
        <Grid>{section.timezone}</Grid>
      </Row>
    </Grid>
  );
};

export default SectionInfo;
