import { ElementType } from "react";

import { PolymorphicRef, PolymorphicTixProps } from "./types";

export const refAs = <C extends ElementType>(
  El: C,
  ref: PolymorphicRef<any>
) => {
  return ref as PolymorphicRef<C>;
};

export const propsAs = <C extends ElementType>(
  El: C,
  props: PolymorphicTixProps<any>
) => {
  return props as PolymorphicTixProps<C>;
};

export const str = (str: string) => str;
