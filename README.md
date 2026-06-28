# Mondrian Generator

Generative art tool that creates compositions in the style of Piet Mondrian and other geometric abstraction artists.

## Features

- 10 artist styles: Mondrian, van Doesburg, van der Leck, Malevich, Lissitzky, Albers, Kelly, LeWitt, Stella, Huszár
- Adjustable canvas resolution
- Seed-based reproducible compositions
- Customizable color palette (red, blue, yellow, line, background, gray)
- Control line weight, minimum cell size, split probability, color probability
- Toggle gray cells
- Download compositions as PNG
- **p5.brush integration** — all styles render with realistic brush stroke textures and painted fills

## Usage

Open `index.html` in any modern browser. No build step required.

The project uses [p5.js](https://p5js.org/) in WEBGL mode with [p5.brush](https://github.com/acamposuribe/p5.brush) for textured, hand-painted rendering. If p5.brush fails to load, the generator falls back to standard vector rendering.

## Parameters

| Parameter | Description |
|-----------|-------------|
| Style | Artist style to generate |
| Seed | Reproducible random seed |
| Resolution | Canvas size in pixels |
| Line Weight | Thickness of grid lines |
| Min Cell Size | Smallest allowed rectangle |
| Split Chance | Probability of continuing subdivision |
| Color Probability | Chance a cell gets a primary color |
| Colors | Customizable palette |
| Use Gray | Include gray as a fill color |

## License

MIT
