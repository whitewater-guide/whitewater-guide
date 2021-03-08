import { Ref, useImperativeHandle, useRef } from 'react';

interface Focusable {
  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused(): boolean | null | undefined;
  /**
   * Removes all text from the TextInput.
   */
  clear(): void | null | undefined;
  /**
   * Focuses the input.
   */
  focus(): void | null | undefined;
  /**
   * Removes focus from the input.
   */
  blur(): void | null | undefined;
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
