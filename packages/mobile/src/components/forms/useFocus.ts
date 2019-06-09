import { Ref, useImperativeHandle, useRef } from 'react';

interface Focusable {
  isFocused: () => boolean;
  clear: () => void;
  focus: () => void;
  blur: () => void;
}

const useFocus = (ref: Ref<Focusable>) => {
  const inputRef = useRef<Focusable>();
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    blur: () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    },
    isFocused: () => {
      if (inputRef.current) {
        return inputRef.current.isFocused();
      }
      return false;
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.clear();
      }
    },
  }));
  return inputRef;
};

export default useFocus;
