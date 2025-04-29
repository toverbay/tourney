# Tourney Canvas Orientation Handler

A responsive web application that demonstrates dynamic canvas and UI orientation handling for cross-device compatibility.

## Overview

This project provides a solution for maintaining consistent drawing orientations regardless of the device's physical orientation. It allows applications to maintain a specific drawing orientation (landscape or portrait) while properly adapting the UI to the device's physical orientation.

## Features

- **Orientation Control**: Switch between landscape and portrait drawing modes at any time
- **Responsive Design**: Automatically adapts to various screen sizes and device orientations
- **Dynamic Canvas Scaling**: Maintains proper aspect ratios regardless of screen size
- **Orientation-Aware UI**: UI elements rotate and reposition to match the drawing orientation
- **Real-time Dimension Display**: Shows current canvas dimensions and aspect ratio

## Installation

1. Clone the repository:

```shell
git clone https://github.com/yourusername/tourney.git
cd tourney
```

2. Install dependencies:

```shell
npm install
```

3. Build the project:

```shell
npm run build
```

4. Start the development server:

```shell
npm run dev
```

## Usage

### Basic Usage

1. Open the application in a web browser.
2. The canvas will initialize with the default orientation (landscape).
3. Use the "Switch to Portrait" button in the top-right corner to toggle between landscape and portrait drawing orientations.
4. Rotate your device to see how the layout adapts while maintaining the selected drawing orientation.

### Configuration

The main configuration options can be found at the top of `src/index.ts`:

```typescript
const config = {
    // Set to 'auto', 'landscape', or 'portrait'
    drawingOrientation: 'landscape',
    maxWidth: 1280,
    maxHeight: 1280,
    aspectRatioLandscape: 16/9,
    aspectRatioPortrait: 9/16
};
```

- **drawingOrientation**: Controls the default drawing orientation
- **maxWidth/maxHeight**: Maximum dimensions for the canvas
- **aspectRatioLandscape/Portrait**: Aspect ratios for each orientation mode

## How It Works

### Drawing Orientation vs. Device Orientation

This application distinguishes between two types of orientations:

1. **Drawing Orientation**: The orientation in which your application logic and drawing operations expect to work
2. **Device Orientation**: The physical orientation of the user's device

When these two orientations match, the canvas displays normally. When they differ, the application automatically:

1. Rotates the canvas to maintain the drawing orientation
2. Repositions and transforms UI elements to adapt to the physical device orientation
3. Ensures that "up" in your drawing logic remains "up" visually for the user

### Technical Implementation

The system uses CSS transforms and canvas context rotations to handle orientation changes:

- **Canvas Rotation**: When the device and drawing orientations don't match, the canvas context is rotated using `ctx.rotate()` and `ctx.translate()`
- **UI Adaptation**: The UI container is rotated and repositioned using CSS transforms to utilize the available space
- **Responsive Layout**: The container dimensions are calculated based on the viewport size and orientation to maximize screen usage

## Browser Compatibility

This application works in all modern browsers that support:

- CSS Flexbox
- Canvas API
- CSS Transforms

## License

MIT
