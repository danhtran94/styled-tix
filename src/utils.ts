import { ElementType } from "react";

export function omit(obj: any, keys: string[]) {
  let _obj = {} as any;

  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key)) {
      _obj[key] = obj[key];
    }
  });

  return _obj;
}

export function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function getDisplayName(Component: ElementType) {
  if (typeof Component === "string") {
    return capitalizeFirstLetter(Component);
  }

  return capitalizeFirstLetter(
    Component.displayName || Component.name || "Component"
  );
}

export const parseIncomingClass = (className: string = "") => {
  return {
    upperTixClassNames: className.split(" ").filter((c) => {
      return c.startsWith("__tix_");
    }),
    upperClassNames: className.split(" ").filter((c) => {
      return !c.startsWith("__tix_");
    }),
  };
};

export const createTixClassName = (El: ElementType, name?: string) => {
  return {
    tixClassName: name ? `__tix_${name}` : `__tix_${getDisplayName(El)}`,
    tixComponentName: name ? `Tix${name}` : `Tix${getDisplayName(El)}`,
  };
};
