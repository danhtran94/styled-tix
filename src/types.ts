import {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementRef,
  ElementType,
  ForwardRefExoticComponent,
  ForwardedRef,
  ReactElement,
} from "react";

type TixConfig<V extends Variants<V>> = {
  name?: string;
  base?: string;
  variants: V;
  defaults?: VariantProps<V>;
};

export type Variants<V extends Variants<V>> = {
  [key: string]: string | { [key: string]: string } | VariantFunc<V>;
};

interface VariantFunc<V extends Variants<V>, T = any> {
  (val: T, getStyles: VariantPropsGetter, parents: string[]): string;
}

interface VariantPropsGetter {
  <V extends Variants<V>>(
    TixEl: PolymorphicTixComponentWithVariants<any, V>
  ): VariantProps<V>;
}

export type VariantProps<V extends Variants<V>> = {
  [K in keyof V]?: V[K] extends string
    ? boolean
    : V[K] extends VariantFunc<V, infer P>
    ? P
    : V[K] extends { [key: string]: string }
    ? keyof V[K]
    : any;
};

export interface TixRender<
  E extends ElementType,
  V extends Variants<V>,
  CustomProps = {}
> {
  (
    styled: <C extends ElementType = E>(
      props: CustomProps &
        VariantProps<V> &
        Omit<PolymorphicTixProps<E, CustomProps>, "ref">
    ) => [
      C,
      CustomProps &
        Omit<PolymorphicTixProps<E, CustomProps>, "ref" | "as" | keyof V>
    ]
  ): (
    props: CustomProps &
      VariantProps<V> &
      Omit<PolymorphicTixProps<E, CustomProps>, "ref">,
    ref: ForwardedRef<ElementRef<E>>
  ) => ReactElement;
}

export interface Tix<CustomProps = {}> {
  <V extends Variants<V>, E extends ElementType>(
    config: TixConfig<V>,
    Element: E,
    render?: TixRender<E, V, CustomProps>
  ): PolymorphicTixComponentWithVariants<E, V, CustomProps>;
}

interface PolymorphicTixComponentWithVariants<
  E extends ElementType,
  V extends Variants<V>,
  CustomProps = {}
> extends ForwardRefExoticComponent<
    CustomProps & VariantProps<V> & PolymorphicTixProps<E, CustomProps>
  > {
  <C extends ElementType = E>(
    props: CustomProps & VariantProps<V> & PolymorphicTixProps<C, CustomProps>
  ): ReactElement;
  readonly config: TixConfig<V>;
}

export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>["ref"];

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<C extends ElementType, Props = {}> = Props &
  AsProp<C> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicComponentPropWithRef<
  C extends ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

export type PolymorphicTixProps<
  C extends ElementType,
  CustomProps = {}
> = PolymorphicComponentPropWithRef<C, { className?: string } & CustomProps>;

export type PropsOverrides<T, U> = Omit<T, keyof U> & U;
