<h1 align="center" text-align="center">
    <img height="70px" width="70px" src="https://octodex.github.com/images/daftpunktocat-guy.gif">
   styled-variants
   <img height="70px" width="70px" src="https://octodex.github.com/images/daftpunktocat-thomas.gif">
</h1>

<p align="center">
    <img src="https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357">
    <img src="https://img.shields.io/github/license/jdconner/styled-variants">
    <img src="https://img.shields.io/github/package-json/v/jdconner/styled-variants">
    <img src="https://img.shields.io/github/size/jdconner/styled-variants/src/index.js">
</p>

<p align="center" style="width: 100%; text-align: center; display: flex; justify-content: center;">
A scalable styled-component theming system that fully leverages JavaScript as a language for styles authoring and theming at both local and global levels.
</p>
<br>

> Note: This was created specifically for `styled-components` but can also be used with `@emotion/styled`.

> Note: the API has changed for v2. You can find the docs for v1 [here](https://github.com/jdconner/styled-variants/blob/b106524f3afd0b33282a029afa655a26c4a16b81/README.md)

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Why Another Theming Library?](#why-another-theming-library)
- [Install](#install)
- [Usage](#usage)
  - [Basic](#basic)
  - [Boolean Variants](#boolean-variants)
  - [Access to Props](#access-to-props)
  - [Multiple Variants](#multiple-variants)
  - [Combining Themes](#combining-themes)
  - [Pseudo Class Support](#pseudo-class-support)
  - [Global Variant Theming](#global-variant-theming)
  - [Globally Theming a Specific Component Type](#globally-theming-a-specific-component-type)
- [FAQ](#faq)
  - [How do I override pseudo classes?](#how-do-i-override-pseudo-classes)
  - [I have a super complex variant that I need to add, will this library support it?](#i-have-a-super-complex-variant-that-i-need-to-add-will-this-library-support-it)
- [Contributing](#contributing)
- [License](#license)

## Why Another Theming Library?

At [Remine](https://remine.com/info/careers/), we not only have _multiple global themes_ (i.e. separate themes for different apps/stakeholders, with light and dark themes for each), but _we also have multiple variants_: `size` (e.g. small, large, etc), `state` (e.g. error, warning, etc), and `type` (e.g. primary, secondary, tertiary) with more to come. We couldn't find a library in the ecosystem that could support such a large number of variants with minimal code, so we decided to create one.

Most theming systems for `styled-components` available today spit out string values (e.g. [styled-theming](https://github.com/styled-components/styled-theming), [styled-theme](https://github.com/diegohaz/styled-theme)) which can add code bloat since you still need to assign the theme value to a css property. `styled-variants` takes advantage of the first-class object functionality that `styled-components` has added in [version 3.3.0](https://spectrum.chat/styled-components/general/v3-3-0-is-out-with-first-class-object-support~2b5fd935-fb1d-480d-a524-95ecd540a1ac) to help reduce this bloat and allow for cleaner, scalable theming.

What this library is looking to empower and contain:

1. Scalable theming
2. Both local variant (passed via props) and global variant (passed via ThemeProvider) support
3. Multiple variants support
4. Remove redundant code (by taking advantage of the first-class object functionality stated above)
5. Small distribution size

All while encouraging clean, human-readable code.

## Install

```bash
$ npm install --save styled-variants
```

## Usage

See our Buttons [example code](https://github.com/jdconner/styled-variants/tree/master/example/src/components/Buttons) if you'd rather read code to understand the use cases.

### Basic

If we expect to write our HTML like this:

```html
<!-- applies global theme to each styled component -->
<ThemeProvider theme={{ mode: 'dark' }}>
    <!-- takes default/medium styles -->
    <ThemedButton />

    <!-- takes large styles -->
    <ThemedButton size="large" />

    <!-- takes small styles -->
    <ThemedButton size="small" />
</ThemeProvider>
```

The standard approach to define the "size" variant is to write a `styled-component` that uses ternary switches within the template literal definition:

<img height="20px" width="20px" src="https://www.iconsdb.com/icons/preview/red/x-mark-xxl.png"> **DIFFICULT TO READ**

```js
export const Button = styled.button`
    padding: ${props =>
        props.size === "large"
            ? "1em 1.2em"
            : props.size === "small"
            ? "0.3em 0.7em"
            : "0.7em 1em"};
    margin: ${props =>
        props.size === "large"
            ? "0.3em 0.7em"
            : props.size === "small"
            ? "0.1em 0.5em"
            : "0.2em 0.6em"};
    font-size: ${props =>
        props.size === "large"
            ? "1.2rem"
            : props.size === "small"
            ? "0.8rem"
            : "1rem"};
    background-color: ${props =>
        props.theme.mode === "light"
            ? "white"
            : props.theme.mode === "dark"
            ? "black"
            : "transparent"};
`;
```

This is not only difficult to read, but it also does not scale well.

**_Imagine_** what it would look like if we had even more size options or if "size" affected more css attributes!

With `styled-variants`, we can easily see:

1. What is included in each variant, and
2. What the css values will be without having to parse multiple levels of conditionals:

<img height="20px" width="20px" src="https://www.iconsdb.com/icons/preview/green/check-mark-3-xxl.png"> **EASIER TO READ**

```js
import styled from "styled-components";
import createTheme from "styled-variants";

const size = {
    small: {
        padding: "0.3em 0.7em",
        margin: "0.1em 0.5em",
        fontSize: "0.8rem",
    },
    large: {
        padding: "1em 1.2em",
        margin: "0.3em 0.7em",
        fontSize: "1.2rem",
    },
};

const mode = {
    light: {
        backgroundColor: "white",
    },
    dark: {
        backgroundColor: "black",
    },
};

const ButtonTheme = createTheme("Button", {
    padding: "0.7em 1em",
    margin: "0.2em 0.6em",
    fontSize: "1rem",
    backgroundColor: "transparent",
})
    .addVariant("size", size)
    .addGlobalVariant("type", type);

export const ThemedButton = styled.button(ButtonTheme);
```

---

### Boolean Variants

Another issues with most theming libraries is that they do not support multiple variants very well. If we have separate states (e.g. isDisabled, isActive, isOpen, etc) for each variant, we can easily incorporate those too:

```js
const typeVariant = ButtonTheme.addVariant("type", {
    isDisabled: {
        opacity: 0.5,
        cursor: "default",
        pointerEvents: "none",
    },
    isActive: {
        boxShadow: "0px 0px 1px 1px purple",
    },
    secondary: {
        isDisabled: {
            opacity: 0.7,
        },
        isActive: {
            boxShadow: "0px 0px 1px 1px blue",
            isPurple: {
                backgroundColor: "purple",
            },
        },
    },
});
```

Then we can pass a prop value for `isDisabled` and `isActive`:

```js
const MyApp = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <ThemeProvider theme={{ colors }}>
            <ThemedButton isDisabled={isDisabled} type="secondary" />
            <ThemedButton isDisabled={isDisabled} />
            <ThemedButton isDisabled={isDisabled} type="secondary" isActive />
        </ThemeProvider>
    );
};
```

---

### Access to Props

Just like `styled-components`, `styled-variants` also supports passing of props via function:

```js
import styled from "styled-components";
import createTheme from "styled-variants";

const type = {
    secondary: {
        color: "black",
        borderColor: ({ theme }) => theme.colors.secondary,
        backgroundColor: ({ theme }) => theme.colors.primary,
    },
};

const ButtonTheme = createTheme("Button").addVariant("type", type);

const Button = styled.button`
    color: white;
    border: ${({ theme }) => `5px solid ${theme.colors.primary}`};
    backgroundcolor: ${({ theme }) => theme.colors.secondary};
`;

export const ThemedButton = styled(Button)(ButtonTheme);
```

Then we can use `styled-components`'s `ThemeProvider` to inject a theme into the props of our `ThemedButton`:

```jsx
import { ThemeProvider } from "styled-components";
import { ThemedButton } from "./ThemedButton.js";

const colors = {
    primary: "#09d3ac",
    secondary: "#282c34",
};

const MyApp = () => {
    return (
        <ThemeProvider theme={{ colors }}>
            <ThemedButton />
            <ThemedButton type="secondary" />
        </ThemeProvider>
    );
};
```

---

### Multiple Variants

To add multiple variants, all you need to do is continue chaining your variants:

```js
const type = /* previous example's type variant code */;
const size = /* previous example's size variant code */;

const ButtonTheme = createTheme("Button")
    .addVariant("type", type)
    .addVariant("size", size);

export const ThemedButton = styled.button(ButtonTheme);
```

The higher the index of the function call, the higher the precedence. In this case, if there were conflicting styles between the variants, the `size` styles would overwrite the conflicting value of the `type`.

---

### Combining Themes

Thankfully, `styled-components` allows for multiple sets of objects when creating a styled component, so we can do the following to combine our themes:

```js
const type = /* previous example's type variant code */;
const size = /* previous example's size variant code */;

const BaseButtonTheme = createTheme("BaseButton")
    .addVariant("type", type)
    .addVariant("size", size);

const shape = /* shape variant code */;

const ShapedButtonTheme = createTheme("ShapedButton")
    .addVariant("shape", shape);

export const ThemedButton = styled.button(BaseButtonTheme, ShapedButtonTheme);
```

Again, the higher the index of the parameter, the higher the precedence. In this case, if there were conflicting styles between the themes, the `ShapedButtonTheme` styles would overwrite the conflicting value of the `BaseButtonTheme`.

---

### Pseudo Class Support

To add pseudo classes we need to make it a valid key. This is done simply by wrapping it in quotes:

```js
import createTheme from "styled-variants";

const type = {
    primary: {
        color: "green",
        "&:hover": {
            color: "limegreen",
        },
    },
    secondary: {
        color: "black",
        "&:focus": {
            color: "purple",
        },
    },
};

const ButtonTheme = createTheme("Button").addVariant("type", type);
```

---

### Global Variant Theming

Sometimes we want to change our entire app's styles based on a `ThemeProvider` value, rather than a local prop value. We can do that via the `globalVariant` function:

```js
import styled from "styled-components";
import createTheme from "styled-variants";

const size = /* previous example's size variant code */;
const mode = {
    soft: {
        borderRadius: "50px",
    },
    hard: {
        borderRadius: "3px",
    },
};

const ButtonTheme = createTheme("Button")
    .addVariant("size", size)
    .addGlobalVariant("mode", mode);

export const ThemedButton = styled.button(ButtonTheme);
```

then make sure we pass the "mode" `globalVariant` via the `ThemeProvider`:

```js
const MyApp = () => {
    const [mode, setMode] = useState("soft");

    return (
        <ThemeProvider
            theme={{
                mode,
            }}>
            <ThemedButton onClick={() => setMode("soft")}>
                Set Soft Mode
            </ThemedButton>
            <ThemedButton onClick={() => setMode("hard")}>
                Set Hard Mode
            </ThemedButton>
        </ThemeProvider>
    );
};
```

---

### Globally Theming a Specific Component Type

In previous examples, we created our theme named `Button`:

```js
const ButtonTheme = createTheme("Button")
    .addVariant("size", size)
    .addGlobalVariant("mode", mode);
```

so at the root of our app, if we'd like to globally style all of our buttons, we can do that by adding a `Button` key and the values we want to the `ThemeProvider`:

> Note: this does **NOT** support basic variants, but does support boolean variants

```js
const MyApp = () => {
    return (
        <ThemeProvider
            theme={{
                colors,
                Button: {
                    userSelect: "none",
                    cursor: "pointer",
                    isDisabled: { cursor: "default", pointerEvents: "none" },
                },
            }}>
            <ThemedButton />
            <ThemedButton isDisabled />
        </ThemeProvider>
    );
};
```

---

## FAQ

### How do I override pseudo classes?

The best example of a need to override pseudo classes is the need for a `disabled` state that would still allow pointer events (probably to allow for a tooltip on hover to explain why the component is disabled). When something is `disabled`, we normally want to remove some functionality. We can easily do that by setting the attributes back to the base values, which can be easily done if we set out base values as their own variable:

```js
const isDisabled = {
    opacity: 0.5,
    cursor: "default",
    outline: "none",
};

const primaryBaseStyles = {
    color: "white",
    borderColor: "purple",
    borderRadius: "5px",
};

const variant = {
    isDisabled,
    primary: {
        ...primaryBaseStyles,
        "&:focus": {
            color: "green",
            cursor: "pointer",
        },
        isDisabled: {
            "&:focus": {
                ...primaryBaseStyles,
                cursor: "initial",
            },
        },
    },
};

export const ButtonTheme = createTheme("Button").addVariant("variant", variant);
```

### I have a super complex variant that I need to add, will this library support it?

It honestly depends on the amount of complexity, but if your variants are super complex with a lot of pseudo classes and nested dynamic selectors, odds are that it will make less sense to use this library in this case. You can very easily combine both basic styled-component styles and styled-variant styles:

```js
const ButtonTheme = createTheme("Button").addVariant("size", size);

const ThemedButton = styled.button(ButtonTheme);

const StyledButton = styled(ButtonTheme)`
    * + * {
        div {
            margin-bottom: 20px;

            &:hover {
                background-color: green;
            }
        }
    }
`;
```

---

## Contributing

Contributions are welcome. Standards have yet to be set but we will set these in the near future.

To see you changes as you make them, an example app has been created. You can run it with:

```bash
$ npm run example
```

## License

MIT
