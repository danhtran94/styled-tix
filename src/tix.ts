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
    const { variants = {}, defaults = {} } = config;

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
          className: classesMixer([
            tixClassName,
            ...upperTixClassNames,
            config.base || "",
            ...variantClassNames,
            ...upperClassNames,
          ]),
        },
      ] as any;
    };

    const RefComponent = forwardRef(render(styled));
    RefComponent.displayName = tixComponentName;
    (RefComponent as any).variants = variants;

    return RefComponent as any;
  };
};

// Variant Helpers

const computeVariantClassNames = (
  variants: Variants<{}>,
  variantKeys: string[],
  variantProps: VariantProps<Variants<{}>>,
  parentNames: string[]
) => {
  return variantKeys
    .map((k) => {
      if (Object.keys(variantProps).includes(k)) {
        const variant = variants[k];

        if (typeof variant === "string") {
          if (variantProps[k]) {
            return variant;
          } else {
            return "";
          }
        }

        if (typeof variant === "object") {
          return variant[variantProps[k]];
        }

        return variantProps[k]
          ? variant(variantProps[k], (_TixEl: any) => variantProps, parentNames)
          : "";
      }

      return "";
    })
    .filter((c) => c !== "");
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
      return {
        ...vprops,
        [key]: props[key] !== undefined ? props[key] : defaults[key],
      };
    }, {}) as VariantProps<Variants<{}>>,
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
