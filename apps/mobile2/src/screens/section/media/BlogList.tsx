import type { MediaWithThumbFragment } from '@whitewater-guide/schema';
import { MediaKind } from '@whitewater-guide/schema';

import BlogItem from './BlogItem';
import NoMedia from './NoMedia';

interface Props {
  blogs?: MediaWithThumbFragment[];
}

function BlogList({ blogs }: Props) {
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
}

export default BlogList;
