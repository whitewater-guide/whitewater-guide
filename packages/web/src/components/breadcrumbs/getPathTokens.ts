export default function getPathTokens(pathname: string): string[] {
  const paths: string[] = [];

  if (pathname === '/') {
    return paths;
  }

  pathname.split('/').reduce((prev, curr) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });

  return paths;
}
