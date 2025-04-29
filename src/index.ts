document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const config = {
        // Set to 'auto', 'landscape', or 'portrait'
        drawingOrientation: 'landscape',
        maxWidth: 1280,
        maxHeight: 1280,
        aspectRatioLandscape: 16/9,
        aspectRatioPortrait: 9/16
    };
    
    // DOM Elements
    const dimensionsDisplay = createDimensionsDisplay();
    const orientationButton = createOrientationButton();
    
    // Initialize button text
    updateButtonText();
    
    // Toggle between landscape and portrait when button is clicked
    orientationButton.addEventListener('click', () => {
        config.drawingOrientation = config.drawingOrientation === 'landscape' ? 'portrait' : 'landscape';
        updateButtonText();
        resizeContainer();
    });
    
    // Initial setup
    resizeContainer();
    
    // Event listeners
    window.addEventListener('resize', resizeContainer);
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeContainer, 500);
    });
    
    /**
     * Creates and appends the dimensions display element to the body
     */
    function createDimensionsDisplay(): HTMLDivElement {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.top = '10px';
        element.style.left = '10px';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        element.style.color = 'white';
        element.style.padding = '5px 10px';
        element.style.borderRadius = '4px';
        element.style.fontSize = '14px';
        element.style.zIndex = '1000';
        document.body.appendChild(element);
        return element;
    }
    
    /**
     * Creates and appends the orientation toggle button to the body
     */
    function createOrientationButton(): HTMLButtonElement {
        const button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#4a90e2';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);
        return button;
    }
    
    /**
     * Updates button text based on current orientation
     */
    function updateButtonText(): void {
        orientationButton.textContent = config.drawingOrientation === 'landscape' 
            ? 'Switch to Portrait' 
            : 'Switch to Landscape';
    }
    
    /**
     * Updates dimensions display with current canvas size
     */
    function updateDimensions(): void {
        const canvas = document.querySelector('#gameCanvas') as HTMLCanvasElement;
        if (canvas) {
            const width = Math.round(canvas.clientWidth);
            const height = Math.round(canvas.clientHeight);
            const isLandscape = width > height;
            const aspectRatio = isLandscape ? height / width : width / height;
            dimensionsDisplay.textContent = `Canvas: ${width}px × ${height}px :: ${Math.round(parseFloat(((aspectRatio * 100).toFixed(1))))}%`;
        }
    }
    
    /**
     * Draws content on the canvas based on orientation
     */
    function drawCanvas(canvas: HTMLCanvasElement, deviceIsLandscape: boolean): void {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const effectiveIsLandscape = config.drawingOrientation === 'landscape';
        const needsRotation = effectiveIsLandscape !== deviceIsLandscape;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        // Set up the logical drawing dimensions based on orientation
        let logicalWidth, logicalHeight;
        
        if (effectiveIsLandscape) {
            if (deviceIsLandscape) {
                logicalWidth = canvas.width;
                logicalHeight = canvas.height;
            } else {
                logicalWidth = canvas.height;
                logicalHeight = canvas.width;
                
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(Math.PI / 2);
                ctx.translate(-canvas.height / 2, -canvas.width / 2);
            }
        } else {
            if (deviceIsLandscape) {
                logicalWidth = canvas.height;
                logicalHeight = canvas.width;
                
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(Math.PI / 2);
                ctx.scale(-1, -1);
                ctx.translate(-canvas.height / 2, -canvas.width / 2);
            } else {
                logicalWidth = canvas.width;
                logicalHeight = canvas.height;
            }
        }
        
        // Create gradient (always horizontal in our logical coordinate system)
        const gradient = ctx.createLinearGradient(0, 0, logicalWidth, 0);
        gradient.addColorStop(0, '#3498db');
        gradient.addColorStop(1, '#9b59b6');
        
        // Fill background
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, logicalWidth, logicalHeight);
        
        // Draw mode text
        const modeText = effectiveIsLandscape ? 'LANDSCAPE MODE' : 'PORTRAIT MODE';
        ctx.font = `${Math.max(16, logicalWidth / 20)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(modeText, logicalWidth / 2, logicalHeight / 2);
        
        // Draw current orientation mode
        const orientationInfo = `Drawing Mode: ${config.drawingOrientation.toUpperCase()}`;
        ctx.font = `${Math.max(12, logicalWidth / 40)}px Arial`;
        ctx.fillText(orientationInfo, logicalWidth / 2, logicalHeight / 2 - logicalHeight * 0.1);
        
        // Draw position indicators
        drawPositionIndicators(ctx, logicalWidth, logicalHeight);
        
        // Draw directional arrows
        drawDirectionalArrows(ctx, logicalWidth, logicalHeight);
        
        ctx.restore();
    }
    
    /**
     * Draws position indicators (TOP, LEFT, RIGHT)
     */
    function drawPositionIndicators(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const fontSize = Math.max(16, width / 20);
        ctx.font = `${fontSize}px Arial`;
        
        // Draw TOP indicator
        ctx.fillStyle = 'yellow';
        ctx.fillText('TOP', width / 2, height * 0.1);
        
        // Draw LEFT indicator
        ctx.fillStyle = 'lime';
        ctx.fillText('LEFT', width * 0.1, height / 2);
        
        // Draw RIGHT indicator
        ctx.fillStyle = 'orange';
        ctx.fillText('RIGHT', width * 0.9, height / 2);
    }
    
    /**
     * Draws directional arrows
     */
    function drawDirectionalArrows(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = Math.max(3, width / 100);
        
        const arrowSize = width * 0.15;
        const arrowY = height / 2 + height * 0.15;
        
        // Left arrow
        ctx.beginPath();
        ctx.moveTo(width / 2 - arrowSize, arrowY);
        ctx.lineTo(width / 2 - arrowSize * 2, arrowY);
        ctx.moveTo(width / 2 - arrowSize * 1.7, arrowY - arrowSize * 0.3);
        ctx.lineTo(width / 2 - arrowSize * 2, arrowY);
        ctx.lineTo(width / 2 - arrowSize * 1.7, arrowY + arrowSize * 0.3);
        ctx.stroke();
        
        // Right arrow
        ctx.beginPath();
        ctx.moveTo(width / 2 + arrowSize, arrowY);
        ctx.lineTo(width / 2 + arrowSize * 2, arrowY);
        ctx.moveTo(width / 2 + arrowSize * 1.7, arrowY - arrowSize * 0.3);
        ctx.lineTo(width / 2 + arrowSize * 2, arrowY);
        ctx.lineTo(width / 2 + arrowSize * 1.7, arrowY + arrowSize * 0.3);
        ctx.stroke();
    }
    
    /**
     * Resizes the container and canvas with proper aspect ratio
     */
    function resizeContainer(): void {
        const container = document.querySelector('.container') as HTMLDivElement;
        const canvas = document.querySelector('#gameCanvas') as HTMLCanvasElement;
        if (!container || !canvas) return;
        
        const parentWidth = window.innerWidth;
        const parentHeight = window.innerHeight;
        const deviceIsLandscape = parentWidth >= parentHeight;
        
        const { width: containerWidth, height: containerHeight } = calculateContainerDimensions(
            parentWidth,
            parentHeight,
            deviceIsLandscape
        );
        
        // Update container dimensions
        container.style.width = `${containerWidth}px`;
        container.style.height = `${containerHeight}px`;
        container.style.position = 'absolute';
        container.style.left = `${(parentWidth - containerWidth) / 2}px`;
        container.style.top = `${(parentHeight - containerHeight) / 2}px`;
        
        // Calculate and set canvas dimensions
        const { width: canvasWidth, height: canvasHeight } = calculateCanvasDimensions(
            containerWidth,
            containerHeight,
            deviceIsLandscape
        );
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Position the canvas
        positionCanvas(canvas, deviceIsLandscape, canvasWidth, canvasHeight, containerWidth, containerHeight);
        
        // Draw on the canvas
        drawCanvas(canvas, deviceIsLandscape);
        
        // Update dimensions display
        updateDimensions();
    }
    
    /**
     * Calculates container dimensions based on viewport and device orientation
     */
    function calculateContainerDimensions(
        parentWidth: number,
        parentHeight: number,
        deviceIsLandscape: boolean
    ): { width: number, height: number } {
        let containerWidth: number, containerHeight: number;
        
        if (deviceIsLandscape) {
            containerHeight = parentHeight;
            containerWidth = containerHeight * config.aspectRatioLandscape;
            
            if (containerWidth > parentWidth) {
                containerWidth = parentWidth;
                containerHeight = containerWidth / config.aspectRatioLandscape;
            }
            
            if (containerWidth > config.maxWidth) {
                containerWidth = config.maxWidth;
                containerHeight = containerWidth / config.aspectRatioLandscape;
            }
        } else {
            containerWidth = parentWidth;
            containerHeight = containerWidth / config.aspectRatioPortrait;
            
            if (containerHeight > parentHeight) {
                containerHeight = parentHeight;
                containerWidth = containerHeight * config.aspectRatioPortrait;
            }
            
            if (containerHeight > config.maxHeight) {
                containerHeight = config.maxHeight;
                containerWidth = containerHeight * config.aspectRatioPortrait;
            }
        }
        
        return {
            width: Math.floor(containerWidth),
            height: Math.floor(containerHeight)
        };
    }
    
    /**
     * Calculates canvas dimensions based on container size and orientation
     */
    function calculateCanvasDimensions(
        containerWidth: number,
        containerHeight: number,
        deviceIsLandscape: boolean
    ): { width: number, height: number } {
        let canvasWidth: number, canvasHeight: number;
        
        if (deviceIsLandscape) {
            canvasHeight = containerHeight;
            canvasWidth = Math.min(containerWidth * 0.75, containerHeight * config.aspectRatioLandscape);
        } else {
            canvasWidth = containerWidth;
            canvasHeight = Math.min(containerHeight * 0.75, containerWidth / config.aspectRatioPortrait);
        }
        
        return {
            width: Math.floor(canvasWidth),
            height: Math.floor(canvasHeight)
        };
    }
    
    /**
     * Positions the canvas based on device orientation
     */
    function positionCanvas(
        canvas: HTMLCanvasElement,
        deviceIsLandscape: boolean,
        width: number,
        height: number,
        containerWidth?: number,
        containerHeight?: number
    ): void {
        canvas.style.position = 'absolute';
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        const uiContainer = document.querySelector('#uiContainer') as HTMLDivElement;
        const effectiveIsLandscape = config.drawingOrientation === 'landscape';
        const needsRotation = effectiveIsLandscape !== deviceIsLandscape;
        
        if (deviceIsLandscape) {
            // Align to right edge in landscape mode
            canvas.style.right = '0';
            canvas.style.top = '50%';
            canvas.style.transform = 'translateY(-50%)';
            canvas.style.left = 'auto';
            canvas.style.bottom = 'auto';
            
            if (uiContainer && containerWidth) {
                uiContainer.style.position = 'absolute';
                
                if (needsRotation) {
                    // For landscape device but portrait drawing
                    const uiWidth = containerWidth - width;
                    const uiHeight = containerHeight;
                    
                    // Set dimensions first
                    uiContainer.style.width = `${uiHeight}px`;
                    uiContainer.style.height = `${uiWidth}px`;
                    
                    // Position at the left side
                    uiContainer.style.left = '0';
                    uiContainer.style.top = '0';
                    
                    // Apply rotation last (after positioning)
                    uiContainer.style.transformOrigin = 'top left';
                    uiContainer.style.transform = `rotate(-90deg) translateX(-100%)`;
                } else {
                    uiContainer.style.transform = 'none';
                    uiContainer.style.width = `${containerWidth - width}px`;
                    uiContainer.style.height = '100%';
                    uiContainer.style.left = '0';
                    uiContainer.style.top = '0';
                }
            }
        } else {
            // Align to bottom edge in portrait mode
            canvas.style.bottom = '0';
            canvas.style.left = '50%';
            canvas.style.transform = 'translateX(-50%)';
            canvas.style.top = 'auto';
            canvas.style.right = 'auto';
            
            if (uiContainer && containerHeight) {
                uiContainer.style.position = 'absolute';
                
                if (needsRotation) {
                    // For portrait device but landscape drawing
                    const uiWidth = containerHeight - height;
                    const uiHeight = containerWidth;
                    
                    // Set dimensions first
                    uiContainer.style.width = `${uiWidth}px`;
                    uiContainer.style.height = `${uiHeight}px`;
                    
                    // Position at the top
                    uiContainer.style.left = '0';
                    uiContainer.style.top = '0';
                    
                    // Apply rotation last (after positioning)
                    uiContainer.style.transformOrigin = 'top left';
                    uiContainer.style.transform = `rotate(90deg) translateY(-100%)`;
                } else {
                    uiContainer.style.transform = 'none';
                    uiContainer.style.width = '100%';
                    uiContainer.style.height = `${containerHeight - height}px`;
                    uiContainer.style.left = '0';
                    uiContainer.style.top = '0';
                }
            }
        }
    }
});
