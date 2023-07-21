# tix

[![npm](https://flat.badgen.net/npm/v/styled-tix)](https://www.npmjs.com/package/styled-tix?activeTab=readme)
[![typescript](https://flat.badgen.net/npm/types/styled-tix)](https://www.npmjs.com/package/styled-tix?activeTab=readme)
[![size](https://flat.badgen.net/bundlephobia/minzip/styled-tix)](https://bundlephobia.com/package/styled-tix@latest)
[![license](https://flat.badgen.net/github/license/danhtran94/styled-tix)](https://github.com/danhtran94/styled-tix/blob/main/LICENSE)

Styles your React components with TailwindCSS classes, and define variant properties without fighting huge & long classnames.

## Preview Simple Usecase
This is simple sample for **`styles button html tag`**. `tix` can do more complex cases than below.

Playground click below: \
[![npm](https://img.shields.io/badge/Codesandbox-000000?style=for-the-badge&logo=CodeSandbox&logoColor=white)](https://codesandbox.io/p/sandbox/styled-tix-sample-3789lk)

```jsx
/**
 * First, create our Button Component with tix.
 * file: TixButton.tsx
 */
import { tix, tw } from "./tix"; // Please read the document `Configuration`

export const TixButton = tix({
  base: tw`text-base font-bold border rounded inline-flex items-center px-8 py-3`,
  variants: {
    // variant can be object
    kind: {
      primary: tw`text-white bg-primary 
        hover:shadow-light`,
      secondary: tw`text-secondary border-secondary bg-light 
        hover:bg-neutral-200`,
      text: tw`text-sm font-semibold text-neutral-400 border-none bg-none rounded-none px-0
        hover:text-primary`,
      link: tw`text-primary border-b-2 border-transparent rounded-none px-0 py-0 pb-1
        hover:border-b-2 hover:border-b-primary`
    },
    // variant can be string
    noPadding: tw`p-0`,
    // variant can be function
    isDisabled: (disabled: boolean, stylesOf) => {
      const { kind, noPadding } = stylesOf(TixButton); // get other variant's values
      
      if (disabled && kind === "primary") {
        return tw`bg-gray hover:shadow-none`;
      }

      // any styling logic...

      return tw``;
    }
  },
  defaults: { // `defaults` has full support typescript base on `variants` type.
    kind: "primary", // keyof `kind` obj => "primary" | "secondary" | "text" | "link"
    noPadding: false, // string => true | false
    isDisabled: false // `disabled` type declaration = boolean in func `isDisabled` => true | false
  }
}, /* Element to applying styles */ "button" /* Element extends ElementType */)


/**
 * Later, use created `TixButton` in `App` or anywhere you want.
 * file: App.tsx
 */
import React, { FC } from "react";
import { TixButton } from "./TixButton"
 
const App: FC = () => {
  const handleHelloTix = () => { alert("Hello Tix!"); };

  return (<div>
    <TixButton onClick={handleHelloTix}>Default TixButton binds actions</TixButton> 
    {/* supports full ts for button's proptypes. */}
    {/* no need to re-declare anything like: onClick, onMouseXYZ, etc... */}

    <TixButton kind="text">Text TixButton</TixButton>
    <TixButton kind="primary" noPadding>Primary TixButton no Padding</TixButton>    
    <TixButton kind="primary" isDisabled>Disabled Primary TixButton</TixButton>

    <TixButton as={"a"} kind="link" href="https://google.com">Link TixButton to Google</TixButton> 
    {/* any TixComponent supports Polymorphic + forwardRef by default. */}
    {/* you can change under element by passing it "as" prop.  */}
    {/* tix's typescript will override default one then suggests correct proptypes. */}
  </div>)
}
```

## Features

**Extends Component & Custom Props**
```jsx
/**
 * First, create our extended TixButton with User's Props.
 * file: TixButtonCustomProps.tsx
 */
import { useState, useEffect } from "react";
import { tix, withProps, tw } from "./tix"; // Please read the document `Configuration`
import { TixButton } from "./TixButton";

// Define CustomProps type
interface CustomProps {
  initCount: number;
  onChangeCount: (val: number) => void;
}

// Declare CustomProps using `withProps` helper
export const TixButtonCustomProps = withProps<CustomProps>(tix)(
  {
    name: "ButtonCustomProps",
    base: tw`text-base font-bold border rounded inline-flex items-center px-8 py-3 mb-2`,
    variants: {
      ...TixButton.variants, // copy variants from TixButton
      kind: {
        primary: tw`bg-red-500 text-white`, // override primary styles
      },
    },
  },
  TixButton, // default under element as TixButton
  (styled) => (_props, ref) => {
    const [El, { initCount, onChangeCount, ...props }] = styled(_props);
    const [count, setCount] = useState(initCount); // get custom prop value

    useEffect(() => {
      count && onChangeCount(count);
    }, [count, onChangeCount]);

    return <El {...props} onClick={() => setCount(count + 1)} />;
  }
);

/** 
 * file: App.tsx
 */
import React, { FC } from "react";
import { TixButtonWithProps } from "./TixButtonWithProps"
 
const App: FC = () => {
  const handleHelloTix = () => { alert("Hello Tix!"); };

  return (<div>
    <TixButtonCustomProps
      kind="primary"
      initCount={0}
      onChangeCount={(num) => alert(num)}
    >
      CustomProps counting increment
    </TixButtonCustomProps>
  </div>)
}
```
**Pylymorphic Component & Refs/useRef**

```NO EXAMPLE BUT SUPPORTED, TODO EXAMPLE```

## Installation
`yarn add styled-tix tailwind-merge`

**(Important)** For using with `tailwindcss`, please install it first: \
https://tailwindcss.com/docs/installation

**(Optional)** If you don't use tailwindcss no need to install `tailwind-merge`. \
`styled-tix` can work alone without any dependencies.


## Configuration
Create a `tix.ts` file inside your `src` folder.

**`tix.ts`**
```typescript
import { newTix } from "styled-tix";
import { twMerge } from "tailwind-merge";

export * from "styled-tix";
export const tix = newTix(twMerge); 
// You can use any classes mixer you want.
// here we will use `tailwind-merge` for tailwindcss
```

## VSCode IntelliSense
### TailwindCSS

Install `Tailwind CSS IntelliSense` from VSCode. \
Add this line to your VSCode config settings, open by pressing <kbd>⌘</kbd> + <kbd>,</kbd>.
```json
"tailwindCSS.experimental.classRegex": [    
  "tw`([^`]*)"
]
```
![VSCode support image](docs/images/vscode-tailwind-intellisense.png)
