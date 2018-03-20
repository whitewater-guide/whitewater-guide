import React from 'react';
import { Formatter, Normalizer, Parser, Validator } from 'redux-form';

declare module 'redux-form' {

  type EventHandler<Event> = (event: Event) => void;

  interface EventOrValueHandler<Event> extends EventHandler<Event> {
    (value: any): void;
  }

  interface CommonFieldProps {
    name: string;
    onBlur: EventOrValueHandler<React.FocusEvent<any>>;
    onChange: EventOrValueHandler<React.ChangeEvent<any>>;
    onDragStart: EventHandler<React.DragEvent<any>>;
    onDrop: EventHandler<React.DragEvent<any>>;
    onFocus: EventHandler<React.FocusEvent<any>>;
  }

  export interface BaseFieldProps<P = {}> extends Partial<CommonFieldProps> {
    name: string;
    component?: React.ComponentType<P> | 'input' | 'select' | 'textarea';
    format?: Formatter | null;
    normalize?: Normalizer;
    props?: P;
    parse?: Parser;
    validate?: Validator | Validator[];
    warn?: Validator | Validator[];
    withRef?: boolean;
  }

}