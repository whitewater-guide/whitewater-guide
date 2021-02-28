import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import { renderDifficulty, stringifySeason } from '@whitewater-guide/clients';
import {
  Durations,
  Section,
  sectionName,
  Tag,
  TagCategory,
} from '@whitewater-guide/commons';
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
  section: Section;
}

const renderTags = (tags: Tag[] | undefined, className: string) => (
  <React.Fragment>
    {tags &&
      tags.map((tag) => (
        <Chip key={tag.id} label={tag.name} className={className} />
      ))}
  </React.Fragment>
);

const SectionInfo: React.FC<Props> = ({ section }) => {
  const classes = useStyles();
  let fullName = sectionName(section);
  if (section.altNames.length) {
    fullName += ` (also known as ${section.altNames.join(', ')})`;
  }
  const tagsByCategory = groupBy(section.tags, 'category');
  return (
    <Grid container={true} className={classes.root}>
      <Row>
        <Title>Name</Title>
        <Grid>{fullName}</Grid>
      </Row>
      <Row>
        <Title>Difficulty</Title>
        <Grid>{renderDifficulty(section)}</Grid>
      </Row>
      <Row>
        <Title>Rating</Title>
        <Grid>
          <Rating value={section.rating} precision={0.5} readOnly={true} />
        </Grid>
      </Row>
      <Row>
        <Title>Drop</Title>
        <Grid>{`${section.drop} m`}</Grid>
      </Row>
      <Row>
        <Title>Length</Title>
        <Grid>{`${section.distance} km`}</Grid>
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
          {renderTags(tagsByCategory[TagCategory.kayaking], classes.chip)}
        </Grid>
      </Row>
      <Row>
        <Title>Hazards</Title>
        <Grid>
          {renderTags(tagsByCategory[TagCategory.hazards], classes.chip)}
        </Grid>
      </Row>
      <Row>
        <Title>River supply types</Title>
        <Grid>
          {renderTags(tagsByCategory[TagCategory.supply], classes.chip)}
        </Grid>
      </Row>
      <Row>
        <Title>Miscellaneous tags</Title>
        <Grid>
          {renderTags(tagsByCategory[TagCategory.misc], classes.chip)}
        </Grid>
      </Row>
    </Grid>
  );
};

export default SectionInfo;
