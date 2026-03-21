# React Conventions

## Component typing

- Use plain functions with typed props, not `React.FC` or `React.FunctionComponent`
- Use React 19's ref-as-prop instead of `forwardRef`

```tsx
// Good
function MyComponent({ title, onPress }: MyComponentProps) {
  return ...;
}

// Avoid
const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  return ...;
};
```
