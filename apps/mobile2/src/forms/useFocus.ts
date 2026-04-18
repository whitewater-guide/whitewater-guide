import type { Ref } from 'react';
import { useImperativeHandle, useRef } from 'react';

interface Focusable {
  isFocused: () => boolean;
  clear: () => void;
  focus: () => void;
  blur: () => void;
}

const useFocus = (ref: Ref<Focusable>) => {
  const inputRef = useRef<Focusable>(undefined);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    isFocused: () => inputRef.current?.isFocused() ?? false,
    clear: () => inputRef.current?.clear(),
  }));
  return inputRef;
};

export default useFocus;
