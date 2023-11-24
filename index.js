import sharp from 'sharp'
import svgfont2jsDefault from '@ladjs/svgfont2js'
import fs from "fs/promises";

const svgfont2js = svgfont2jsDefault.default

// As long as import.meta.resolve stays experimental, you can use createRequire
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);


export default async function fontAwesomeIconGenerator(providedConfig) {
  
  // This would also do it, but at least with node v18.13.0 still requires to be
  // run with --experimental-import-meta-resolve. Note that this will be
  // prefixed with 'file://'.
  // const webfontURL = await import.meta.resolve(
  //   'font-awesome/fonts/fontawesome-webfont.svg'
  // );

  const webfont = require.resolve('font-awesome/fonts/fontawesome-webfont.svg');
  
  const config = {
    // These defaults can be omitted
    sizes: [16, 32, 48, 64, 128, 256, 512],
    mirrorX: false,
    mirrorY: false,
    ...providedConfig
  }

  const icons = svgfont2js(
    await fs.readFile(webfont, 'utf8')
  );
  
  const icon = icons.filter(i => i.unicode_hex == config.unicodeHex)[0]

  const promises = []
  for (const size of config.sizes) {
    let translateX = 0
    let translateY = 0
    let scaleX  = 1
    let scaleY = 1

    if (config.mirrorX) {
      translateX = icon.width
      scaleX = -1
    }
    if (config.mirrorY) {
      translateY = icon.height
      scaleY = -1
    }

    const translate = `translate(${translateX},${translateY})`
    const scale = `scale(${scaleX},${scaleY})`
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${icon.width} ${icon.height}">
        <path fill="${config.color}" d="${icon.path}"
              transform="${translate} ${scale}"></path>
      </svg>
    `
    // console.log(svg)
    const outFile = config.iconOutputFile(size)
    // console.log('Creating', outFile)
    promises.push(new Promise((resolve, reject) => {
      sharp(Buffer.from(svg))
      .resize(size, size)
      .toFile(outFile, (err, info) => {
        if (err) {
          reject([`Error creating ${outFile}`, err, info])
        } else {
          resolve(info)
        }
      })
    }));
  }
  return Promise.all(promises)
}