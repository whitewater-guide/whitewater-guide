const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const res = MarkdownIt.parseInline(
  'The content you are adding will be available under an open licence (CC). See our [Terms of Use](1) and others',
);

const nodes = [];
let currentLink;
res[0].children.forEach((child) => {
  if (child.type === 'text') {
    if (currentLink) {
      currentLink.text = child.content;
    } else {
      nodes.push(child.content);
    }
  } else if (child.type === 'link_open') {
    currentLink = { href: child.attrGet('href') };
  } else if (child.type === 'link_close') {
    nodes.push(currentLink);
    currentLink = null;
  }
});
console.log(nodes);
