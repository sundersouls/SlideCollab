import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { Slide, usePresentationStore } from '../store/presentationStore';
import TextElementComponent from './textElementComponent';

interface SlideCanvasProps {
  slide: Slide;
  canEdit: boolean;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const SlideCanvas: React.FC<SlideCanvasProps> = ({ slide, canEdit }) => {
  const { selectedElements, setSelectedElements, updateTextElement } = usePresentationStore();
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    elementId: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const calculateScaleFactor = useCallback(() => {
    if (!canvasRef.current) return 1;
    const containerWidth = canvasRef.current.clientWidth - 40; 
    const containerHeight = canvasRef.current.clientHeight - 40;
    const factor = Math.min(containerWidth / CANVAS_WIDTH, containerHeight / CANVAS_HEIGHT, 1);
    setScaleFactor(factor);
    return factor;
  }, []);

  useEffect(() => {
    calculateScaleFactor();
    
    const handleResize = () => {
      calculateScaleFactor();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateScaleFactor]);

  useEffect(() => {
    if (canvasRef.current) {
      calculateScaleFactor();
    }
  }, [canvasRef.current, calculateScaleFactor]);

  const handleElementSelect = useCallback((elementId: string, isMultiSelect: boolean = false) => {
    if (!canEdit) return;

    if (isMultiSelect) {
      setSelectedElements(
        selectedElements.includes(elementId)
          ? selectedElements.filter(id => id !== elementId)
          : [...selectedElements, elementId]
      );
    } else {
      setSelectedElements(selectedElements.includes(elementId) ? [] : [elementId]);
    }
  }, [selectedElements, setSelectedElements, canEdit]);

  const handleElementDragStart = useCallback((
    elementId: string, 
    clientX: number, 
    clientY: number
  ) => {
    if (!canEdit) return;

    const element = slide.elements.find(el => el.id === elementId);
    if (!element) return;

    setDragState({
      isDragging: true,
      elementId,
      startX: clientX,
      startY: clientY,
      initialX: element.x,
      initialY: element.y
    });

    if (!selectedElements.includes(elementId)) {
      setSelectedElements([elementId]);
    }
  }, [slide.elements, selectedElements, setSelectedElements, canEdit]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState || !canEdit) return;

    e.preventDefault();
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const deltaX = (e.clientX - dragState.startX) / scaleFactor;
    const deltaY = (e.clientY - dragState.startY) / scaleFactor;

    const element = slide.elements.find(el => el.id === dragState.elementId);
    if (!element) return;

    const newX = Math.max(0, Math.min(CANVAS_WIDTH - element.width, dragState.initialX + deltaX));
    const newY = Math.max(0, Math.min(CANVAS_HEIGHT - element.height, dragState.initialY + deltaY));

    updateTextElement(slide.id, dragState.elementId, {
      x: newX,
      y: newY
    });
  }, [dragState, slide.id, slide.elements, updateTextElement, canEdit, scaleFactor]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElements([]);
    }
  }, [setSelectedElements]);


  return (
    <Box
      ref={canvasRef}
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
        overflow: 'auto'
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      tabIndex={0}
    >
      <Paper
        elevation={3}
        sx={{
          width: CANVAS_WIDTH * scaleFactor,
          height: CANVAS_HEIGHT * scaleFactor,
          bgcolor: 'white',
          position: 'relative',
          cursor: dragState ? 'grabbing' : 'default',
          transition: 'width 0.2s ease, height 0.2s ease'
        }}
        data-canvas="true"
      >
        {slide.elements.map((element) => (
          <TextElementComponent
            key={element.id}
            element={element}
            isSelected={selectedElements.includes(element.id)}
            canEdit={canEdit}
            scaleFactor={scaleFactor}
            onSelect={handleElementSelect}
            onDragStart={handleElementDragStart}
            slideId={slide.id}
          />
        ))}
        
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            px: 1,
            py: 0.5,
            fontSize: Math.max(8, 10),
            color: 'text.secondary',
            pointerEvents: 'none',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 0.5,
            backdropFilter: 'blur(2px)'
          }}
        >
          {Math.round(scaleFactor * 100)}% • {CANVAS_WIDTH}×{CANVAS_HEIGHT}
        </Box>
      </Paper>
    </Box>
  );
};

export default SlideCanvas;