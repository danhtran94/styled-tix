import { createElement, forwardRef } from "react";
import {
  PolymorphicTixProps,
  Tix,
  TixRender,
  VariantProps,
  Variants,
} from "./types";
import { omit, createTixClassName, parseIncomingClass } from "./utils";

export const newTix = (classesMixer: (classes: string[]) => string): Tix => {
  return (config, El, render = defaultRender) => {
    const { base = "", variants = {}, defaults = {} } = config;

    const { tixClassName, tixComponentName } = createTixClassName(
      El,
      config.name
    );

    const styled = (props: Omit<PolymorphicTixProps<typeof El>, "ref">) => {
      const { upperTixClassNames, upperClassNames } = parseIncomingClass(
        props.className
      );

      const { variantKeys, variantProps } = getVariantKeysAndProps(
        variants,
        props,
        defaults
      );

      const variantClassNames = computeVariantClassNames(
        variants,
        variantKeys,
        variantProps,
        upperTixClassNames
      );

      if (props.as) {
        El = props.as;
      }

      return [
        El,
        {
          ...omit(props, variantKeys.concat(["as"])),
          className: classesMixer(
            [tixClassName]
              .concat(upperTixClassNames)
              .concat(base)
              .concat(variantClassNames)
              .concat(upperClassNames)
          ),
        },
      ] as any;
    };

    const RefComponent = forwardRef(render(styled));
    RefComponent.displayName = tixComponentName;

    return { ...RefComponent, variants } as any;
  };
};

// Variant Helpers

const computeVariantClassNames = (
  variants: Variants<{}>,
  variantKeys: string[],
  variantProps: VariantProps<Variants<{}>>,
  parentNames: string[]
) => {
  const variantPropKeys = Object.keys(variantProps);
  return variantKeys
    .filter((k) => variantPropKeys.includes(k))
    .map((k) => {
      const variant = variants[k];
      const variantVal = variantProps[k];

      if (typeof variant === "string") {
        return variantVal ? variant : "";
      }

      if (typeof variant === "object") {
        return variant[variantVal];
      }

      return variantVal !== undefined
        ? variant(variantVal, (_TixEl: any) => variantProps, parentNames)
        : "";
    })
    .filter((c) => c!!);
};

const getVariantKeysAndProps = (
  variants: Variants<{}>,
  props: VariantProps<Variants<{}>>,
  defaults: VariantProps<Variants<{}>>
) => {
  const variantKeys = Object.keys(variants);
  return {
    variantKeys,
    variantProps: variantKeys.reduce((vprops, key) => {
      if (props[key] === undefined && defaults[key] === undefined) {
        return vprops;
      }

      return {
        ...vprops,
        [key]: props[key] !== undefined ? props[key] : defaults[key],
      };
    }, {} as VariantProps<Variants<{}>>),
  };
};

const defaultRender: TixRender<any, any> = (styled) => (props, ref) => {
  const [El, restProps] = styled(props);
  return createElement(El, { ...restProps, ref });
};

// Helpers

export function withProps<T>(tixInstance: Tix): Tix<T> {
  return tixInstance as Tix<T>;
}

export function tw(classes: TemplateStringsArray, ...args: string[]) {
  return (
    Array.from(classes)
      .slice(0, -1)
      .map((c, i) => c + args[i])
      .join("") + classes[classes.length - 1]
  );
}
