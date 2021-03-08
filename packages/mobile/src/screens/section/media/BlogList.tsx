import { Media, MediaKind } from '@whitewater-guide/commons';
import React from 'react';

import BlogItem from './BlogItem';
import NoMedia from './NoMedia';

interface Props {
  blogs?: Media[];
}

const BlogList: React.SFC<Props> = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return <NoMedia kind={MediaKind.blog} />;
  }
  return (
    <React.Fragment>
      {blogs.map((blog, index) => (
        <BlogItem key={index} blog={blog} />
      ))}
    </React.Fragment>
  );
};

export default BlogList;
