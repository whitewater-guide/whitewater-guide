import { groupBy } from 'lodash';
import Chip from 'material-ui/Chip';
import * as React from 'react';
import { Col } from 'react-grid-system';
import { Rating } from '../../../components';
import { Container, Row, Title } from '../../../layout/details';
import { renderDifficulty, stringifySeason } from '../../../ww-clients/utils';
import { Durations, Section } from '../../../ww-commons/features/sections';
import { Tag, TagCategory } from '../../../ww-commons/features/tags';

interface Props {
  section: Section;
}

const styles = {
  chip: {
    margin: 4,
  },
};

const renderTags = (tags?: Tag[]) => (
  <React.Fragment>
    {tags && tags.map(tag => (<Chip key={tag.id} style={styles.chip}>{tag.name}</Chip>))}
  </React.Fragment>
);

const SectionInfo: React.StatelessComponent<Props> = ({ section }) => {
  let fullName = `${section.river.name} - ${section.name}`;
  if (section.altNames.length) {
    fullName += ` (also known as ${section.altNames.join(', ')})`;
  }
  const tagsByCategory = groupBy(section.tags, 'category');
  return (
    <Container>
      <Row>
        <Title>Name</Title>
        <Col>{fullName}</Col>
      </Row>
      <Row>
        <Title>Difficulty</Title>
        <Col>{renderDifficulty(section)}</Col>
      </Row>
      <Row>
        <Title>Rating</Title>
        <Col><Rating value={section.rating!}/></Col>
      </Row>
      <Row>
        <Title>Drop</Title>
        <Col>{`${section.drop} m`}</Col>
      </Row>
      <Row>
        <Title>Length</Title>
        <Col>{`${section.distance} km`}</Col>
      </Row>
      <Row>
        <Title>Duration</Title>
        <Col>{section.duration && Durations.get(section.duration)}</Col>
      </Row>
      <Row>
        <Title>Season</Title>
        <Col>
          <div>
            {section.season}
          </div>
          <div>
            {stringifySeason(section.seasonNumeric)}
          </div>
        </Col>
      </Row>
      <Row>
        <Title>Kayaking types</Title>
        <Col>{renderTags(tagsByCategory[TagCategory.kayaking])}</Col>
      </Row>
      <Row>
        <Title>Hazards</Title>
        <Col>{renderTags(tagsByCategory[TagCategory.hazards])}</Col>
      </Row>
      <Row>
        <Title>River supply types</Title>
        <Col>{renderTags(tagsByCategory[TagCategory.supply])}</Col>
      </Row>
      <Row>
        <Title>Miscellaneous tags</Title>
        <Col>{renderTags(tagsByCategory[TagCategory.misc])}</Col>
      </Row>
    </Container>
  );
};

export default SectionInfo;
