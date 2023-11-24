# `font-awesome-icon-generator`: Generating icons from font-awesome

Use case: You want to create an icon for your app and are lazy. Pick a
font-awesome icon and a color and be done with it.

## Pick an icon

Visit https://fontawesome.com/v4/icons/ and pick an icon. It has to be from v4,
as that is the last version with an open license, so it can be distributed in
npm. (Patches welcome to support later versions.)

Let us say you picked `fa-binoculars` from
https://fontawesome.com/v4/icon/binoculars . Congratulations!

Notice how that page also shows the Unicode hex value: `f1e5`:

![fa-binoculars screenshot](https://i.imgur.com/rw9LiHM.png)

## Pick a color

Google has a color picker: https://www.google.com/search?q=color+picker

Lets say you picked `#962456` as the color, because magenta binoculars are cool.
Congratulations!

## Install it

```shell
$ npm install font-awesome-icon-maker
```

## Create the configuration and go

```javascript
import fontAwesomeIconGenerator from 'font-awesome-icon-generator'

const config = {
  iconOutputFile: (size) => `bino-icon-${size}.png`,
  unicodeHex: 'f1e5',
  color: '#962456',
  // // These defaults can be omitted
  // sizes: [16, 32, 48, 64, 128, 256, 512],
  // mirrorX: false,
  // mirrorY: false,
}

fontAwesomeIconGenerator(config)
```

This will create these files:

```
bino-icon-16.png
bino-icon-32.png
bino-icon-48.png
bino-icon-64.png
bino-icon-128.png
bino-icon-256.png
bino-icon-512.png
```

That's it. Here is `bino-icon-128.png`:

![bino-icon-512.png](https://i.imgur.com/vrD36d1.png)

## Optional extra - create favicon(s)

Now, what I do is to create a favicon from `bino-icon-512.png` using
https://www.npmjs.com/package/favicons as documented on
https://github.com/itgalaxy/favicons. 

This is not part of this project, but is mentioned here as a natural next step.

I usually only need the single `favicon.ico` and generate it like this:

```javascript
import favicons from "favicons";
import fs from "fs/promises";

const src = "./bino-icon-512.png";
const faviconFileName = "favicon.ico"

const response = await favicons(src, { path: "/never-used-but-needs-a-value"});
const faviconImage = response.images.filter(i => i.name == faviconFileName)[0]
await fs.writeFile(faviconFileName, faviconImage.contents)
```

But read the favicons documentation for many more options, now that you have the
icons.