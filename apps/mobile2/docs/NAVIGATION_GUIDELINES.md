# Navigation Guidelines

## Screen options typing

When defining screen options as a constant, always annotate the type explicitly using the appropriate navigation options type. For example

```tsx
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const screenOptions: NativeStackNavigationOptions = {
  // ...options
};

// Then
<Stack.Navigator screenOptions={screenOptions} />;
```
