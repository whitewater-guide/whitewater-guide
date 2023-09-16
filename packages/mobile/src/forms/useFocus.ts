import type { Ref } from 'react';
import { useImperativeHandle, useRef } from 'react';

interface Focusable {
  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused: () => boolean;
  /**
   * Removes all text from the TextInput.
   */
  clear: () => void;
  /**
   * Focuses the input.
   */
  focus: () => void;
  /**
   * Removes focus from the input.
   */
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
