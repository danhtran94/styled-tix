import { ElementType, ElementRef, ForwardedRef, Ref } from "react";

import { Tix, PolymorphicTixProps } from "./types";

export function withProps<T>(tixInstance: Tix): Tix<T> {
  return tixInstance as Tix<T>;
}

export const refAs = <C extends ElementType, E extends ElementType = "div">(
  ref: ForwardedRef<ElementRef<E>>
): ForwardedRef<ElementRef<C>> => {
  return ref as ForwardedRef<ElementRef<C>>;
};

export const compareAsEl = <C extends ElementType, E extends ElementType>(
  isAs: C,
  El: E,
  ref: ForwardedRef<ElementRef<E>>
): [C, ForwardedRef<ElementRef<C>>] | [] => {
  if ((isAs as ElementType) == (El as ElementType)) {
    return [isAs, refAs<C, E>(ref)];
  }

  return [];
};

export const propsOf = <C extends ElementType>(
  El: C,
  props: PolymorphicTixProps<any>
) => {
  return props as PolymorphicTixProps<C>;
};

export const str = (str: string) => str;
