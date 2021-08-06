import { MediaKind, MediaWithThumbFragment } from '@whitewater-guide/schema';
import React from 'react';

import BlogItem from './BlogItem';
import NoMedia from './NoMedia';

interface Props {
  blogs?: MediaWithThumbFragment[];
}

const BlogList: React.FC<Props> = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return <NoMedia kind={MediaKind.Blog} />;
  }
  return (
    <>
      {blogs.map((blog) => (
        <BlogItem key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogList;
