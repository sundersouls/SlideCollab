import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Popover
} from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  Palette as ColorIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { TextElement, usePresentationStore } from '../store/presentationStore';

interface TextElementComponentProps {
  element: TextElement;
  isSelected: boolean;
  canEdit: boolean;
  scaleFactor: number;
  slideId: string;
  onSelect: (elementId: string, isMultiSelect?: boolean) => void;
  onDragStart: (elementId: string, clientX: number, clientY: number) => void;
}

const TextElementComponent: React.FC<TextElementComponentProps> = ({
  element,
  isSelected,
  canEdit,
  scaleFactor,
  slideId,
  onSelect,
  onDragStart
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);
  const [showToolbar, setShowToolbar] = useState(false);
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { 
    updateTextElement, 
    deleteTextElement, 
    editingElementId, 
    setEditingElement,
    clearEditingElement
  } = usePresentationStore();
  const elementRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
    '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#00CCFF',
    '#0066FF', '#6600FF', '#FF00FF', '#FF0066', '#FFFFFF'
  ];

  const fontFamilies = [
    'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 
    'Verdana', 'Courier New', 'Comic Sans MS'
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

  const isNotSelectedElements = editingElementId && editingElementId !== element.id && editingElementId !== null;
  const isCurrentlyEditing = editingElementId === element.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      e.preventDefault();
      const rect = elementRef.current?.getBoundingClientRect();
      if (!rect) return;

      const canvasRect = elementRef.current?.closest('[data-canvas]')?.getBoundingClientRect();
      if (!canvasRect) return;

      const relativeX = (e.clientX - canvasRect.left) / scaleFactor;
      const relativeY = (e.clientY - canvasRect.top) / scaleFactor;

      let newWidth = element.width;
      let newHeight = element.height;
      let newX = element.x;
      let newY = element.y;

      const minSize = 50;
      switch (resizeHandle) {
        case 'nw':
          newWidth = Math.max(minSize, element.x + element.width - relativeX);
          newHeight = Math.max(minSize, element.y + element.height - relativeY);
          if (newWidth >= minSize) newX = relativeX;
          if (newHeight >= minSize) newY = relativeY;
          break;
        case 'ne':
          newWidth = Math.max(minSize, relativeX - element.x);
          newHeight = Math.max(minSize, element.y + element.height - relativeY);
          if (newHeight >= minSize) newY = relativeY;
          break;
        case 'sw':
          newWidth = Math.max(minSize, element.x + element.width - relativeX);
          newHeight = Math.max(minSize, relativeY - element.y);
          if (newWidth >= minSize) newX = relativeX;
          break;
        case 'se':
          newWidth = Math.max(minSize, relativeX - element.x);
          newHeight = Math.max(minSize, relativeY - element.y);
          break;
      }

      updateTextElement(slideId, element.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle('');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = `${resizeHandle}-resize`;
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (isResizing) {
        document.body.style.cursor = 'default';
      }
    };
  }, [isResizing, resizeHandle, element, scaleFactor, canEdit, slideId, updateTextElement]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit) return;
    
    if (isNotSelectedElements) return;
    
    onSelect(element.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEdit) return;
    
    if (isNotSelectedElements) return;
    
    setEditingElement(element.id);
    setIsEditing(true);
    setEditContent(element.content);
    setShowToolbar(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canEdit || isEditing || isNotSelectedElements) return;
    e.preventDefault();
    onDragStart(element.id, e.clientX, e.clientY);
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    if (!canEdit || isEditing || isNotSelectedElements) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
  };

  const handleEditSubmit = () => {
    if (editContent.trim() !== element.content) {
      updateTextElement(slideId, element.id, { content: editContent.trim() });
    }
    setIsEditing(false);
    setShowToolbar(false);
    clearEditingElement();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSubmit();
    }
  };

  const handleFormatChange = (property: keyof TextElement, value: any) => {
    updateTextElement(slideId, element.id, { [property]: value });
  };

  const handleToggleFormat = (format: 'bold' | 'italic' | 'underline') => {
    updateTextElement(slideId, element.id, { [format]: !element[format] });
  };

  const handleColorChange = (color: string) => {
    handleFormatChange('color', color);
    setColorAnchor(null);
  };

  const getTextStyle = (): React.CSSProperties => ({
    fontSize: element.fontSize * scaleFactor,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.bold ? 'bold' : 'normal',
    fontStyle: element.italic ? 'italic' : 'normal',
    textDecoration: element.underline ? 'underline' : 'none',
    lineHeight: 1.2,
    margin: 0,
    padding: '4px',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    minHeight: '1.2em'
  });

  const getBorderStyle = () => {
    if (isNotSelectedElements) {
      return { border: '2px solid', borderColor: 'warning.main' };
    }
    if (isCurrentlyEditing) {
      return { border: '2px solid', borderColor: 'success.main' };
    }
    if (isSelected) {
      return { border: '2px dashed', borderColor: 'primary.main' };
    }
    if (isHovered && canEdit) {
      return { border: '1px dashed', borderColor: 'primary.light' };
    }
    if (isResizing){
      return { border: '2px dashed', borderColor: 'primary.main' };
    }
    return { border: '1px solid transparent' };
  };

  const getCursor = () => {
    if (!canEdit) return 'default';
    if (isNotSelectedElements) return 'not-allowed';
    if (isEditing) return 'text';
    return 'move';
  };

  return (
    <>
      <Box
        ref={elementRef}
        sx={{
          position: 'absolute',
          left: element.x * scaleFactor,
          top: element.y * scaleFactor,
          width: element.width * scaleFactor,
          height: element.height * scaleFactor,
          cursor: getCursor(),
          ...getBorderStyle(),
          borderRadius: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          backgroundColor: isEditing ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          opacity: isNotSelectedElements ? 0.7 : 1,
          '&:hover': canEdit && !isNotSelectedElements ? {
            '& .resize-handle': {
              opacity: 1
            }
          } : {},
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={canEdit ? 0 : -1}
        data-element-id={element.id}
      >
        {isEditing ? (
          <TextField
            inputRef={inputRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            variant="standard"
            InputProps={{
              disableUnderline: true,
              style: getTextStyle()
            }}
            sx={{
              width: '100%',
              height: '100%',
              '& .MuiInputBase-root': {
                height: '100%',
                paddingTop: 0,
                alignItems: 'flex-start'
              },
              '& .MuiInputBase-input': {
                height: '100% !important',
                padding: '4px !important',
                boxSizing: 'border-box'
              }
            }}
          />
        ) : (
          <Box
            component="div"
            sx={{
              ...getTextStyle(),
              display: 'flex',
              alignItems: 'flex-start',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          >
            {element.content || 'Double-click to edit'}
          </Box>
        )}

        {isNotSelectedElements && (
          <Box
            sx={{
              position: 'absolute',
              top: -20 * scaleFactor,
              left: 0,
              bgcolor: 'warning.main',
              color: 'white',
              px: 0.5,
              py: 0.25,
              borderRadius: 0.5,
              fontSize: Math.max(8, 10 * scaleFactor),
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            Text component
          </Box>
        )}

        {(isSelected || isHovered) && canEdit && !isEditing && !isNotSelectedElements && (
          <>
            <Box
              className="resize-handle"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
              sx={{
                position: 'absolute',
                top: -6,
                left: -6,
                width: 12,
                height: 12,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                cursor: 'nw-resize',
                zIndex: 1001,
                opacity: isHovered ? 1 : 0.8,
                border: '2px solid white',
                transition: 'all 0.2s ease'
              }}
            />
            <Box
              className="resize-handle"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
              sx={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 12,
                height: 12,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                cursor: 'ne-resize',
                zIndex: 1001,
                opacity: isHovered ? 1 : 0.8,
                border: '2px solid white',
                transition: 'all 0.2s ease'
              }}
            />
            <Box
              className="resize-handle"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
              sx={{
                position: 'absolute',
                bottom: -6,
                left: -6,
                width: 12,
                height: 12,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                cursor: 'sw-resize',
                zIndex: 1001,
                opacity: isHovered ? 1 : 0.8,
                border: '2px solid white',
                transition: 'all 0.2s ease'
              }}
            />
            <Box
              className="resize-handle"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
              sx={{
                position: 'absolute',
                bottom: -6,
                right: -6,
                width: 12,
                height: 12,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                cursor: 'se-resize',
                zIndex: 1001,
                opacity: isHovered ? 1 : 0.8,
                border: '2px solid white',
                transition: 'all 0.2s ease'
              }}
            />
          </>
        )}
      </Box>

      {showToolbar && isEditing && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            left: (element.x * scaleFactor),
            top: (element.y * scaleFactor) - 60,
            zIndex: 1000,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none'
          }}
        >
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={element.fontFamily}
              onChange={(e) => handleFormatChange('fontFamily', e.target.value)}
              variant="outlined"
              size="small"
            >
              {fontFamilies.map((font) => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 60 }}>
            <Select
              value={element.fontSize}
              onChange={(e) => handleFormatChange('fontSize', e.target.value)}
              variant="outlined"
              size="small"
            >
              {fontSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup size="small" sx={{ height: 32 }}>
            <ToggleButton
              value="bold"
              selected={element.bold}
              onChange={() => handleToggleFormat('bold')}
              size="small"
            >
              <BoldIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton
              value="italic"
              selected={element.italic}
              onChange={() => handleToggleFormat('italic')}
              size="small"
            >
              <ItalicIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton
              value="underline"
              selected={element.underline}
              onChange={() => handleToggleFormat('underline')}
              size="small"
            >
              <UnderlineIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Text Color">
            <IconButton
              size="small"
              onClick={(e) => setColorAnchor(e.currentTarget)}
              sx={{ 
                border: '2px solid',
                borderColor: element.color,
                borderRadius: 1,
                width: 32,
                height: 32
              }}
            >
              <ColorIcon fontSize="small" sx={{ color: element.color }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                deleteTextElement(slideId, element.id);
                setShowToolbar(false);
                clearEditingElement();
              }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>
      )}

      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorChange(color)}
              sx={{
                width: 24,
                height: 24,
                bgcolor: color,
                border: '1px solid #ccc',
                cursor: 'pointer',
                borderRadius: 0.5,
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                ...(element.color === color && {
                  border: '2px solid #000',
                  transform: 'scale(1.1)'
                })
              }}
            />
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default TextElementComponent;