import { renderDifficulty, stringifySeason } from '@whitewater-guide/clients';
import {
  Durations,
  Section,
  sectionName,
  Tag,
  TagCategory,
} from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import Chip from 'material-ui/Chip';
import React from 'react';
import { Col } from 'react-grid-system';
import { Rating } from '../../../components';
import { Container, Row, Title } from '../../../layout/details';

interface Props {
  section: Section;
}

const styles = {
  chip: {
    margin: 4,
  },
  tagsCol: {
    display: 'flex',
  },
};

const renderTags = (tags?: Tag[]) => (
  <div style={styles.tagsCol}>
    {tags &&
      tags.map((tag) => (
        <Chip key={tag.id} style={styles.chip}>
          {tag.name}
        </Chip>
      ))}
  </div>
);

const SectionInfo: React.FC<Props> = ({ section }) => {
  let fullName = sectionName(section);
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
        <Col>
          <Rating value={section.rating!} />
        </Col>
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
          <div>{section.season}</div>
          <div>{stringifySeason(section.seasonNumeric)}</div>
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
