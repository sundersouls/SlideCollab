import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  editedBy?: string;
}

export interface Slide {
  id: string;
  order: number;
  elements: TextElement[];
}

export interface User {
  id: string;
  nickname: string;
  role: 'creator' | 'editor' | 'viewer';
  socketId: string;
}

export interface Presentation {
  id: string;
  name: string;
  creatorId: string;
  slides?: Slide[];
}

interface PresentationState {
  socket: Socket | null;
  connected: boolean;
  
  currentPresentation: Presentation | null;
  slides: Slide[];
  currentSlideIndex: number;
  
  users: User[];
  currentUser: User | null;
  
  selectedElements: string[];
  isPresenting: boolean;
  
  editingElementId: string | null;
  
  setCurrentPresentation: (presentation: Presentation | null) => void;
  connectSocket: (presentationId: string, nickname: string) => void;
  disconnectSocket: () => void;
  addTextElement: (slideId: string, element: Omit<TextElement, 'id'>) => void;
  updateTextElement: (slideId: string, elementId: string, changes: Partial<TextElement>) => void;
  deleteTextElement: (slideId: string, elementId: string) => void;
  addSlide: () => void;
  deleteSlide: (slideId: string) => void;
  setCurrentSlide: (index: number) => void;
  setSelectedElements: (elementIds: string[]) => void;
  changeUserRole: (userId: string, newRole: User['role']) => void;
  setEditingElement: (elementId: string | null) => void;
  clearEditingElement: () => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  socket: null,
  connected: false,
  currentPresentation: null,
  slides: [],
  currentSlideIndex: 0,
  users: [],
  currentUser: null,
  selectedElements: [],
  isPresenting: false,
  editingElementId: null,

  setCurrentPresentation: (presentation) => {
    set({ currentPresentation: presentation });
  },

  connectSocket: (presentationId, nickname) => {
    const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to server');
      set({ connected: true });
      socket.emit('join-presentation', { presentationId, nickname });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      set({ connected: false, editingElementId: null });
    });

    socket.on('presentation-data', ({ presentation, currentUser, users }) => {
      console.log('Received presentation data:', presentation);
      set({
        currentPresentation: presentation,
        slides: presentation.slides || [],
        currentUser,
        users
      });
    });

    socket.on('user-joined', (user) => {
      set(state => ({
        users: [...state.users, user]
      }));
    });

    socket.on('user-left', (userId) => {
      set(state => ({
        users: state.users.filter(u => u.id !== userId)
      }));
    });

    socket.on('user-role-changed', ({ userId, newRole }) => {
      set(state => ({
        users: state.users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ),
        currentUser: state.currentUser && state.currentUser.id === userId 
          ? { ...state.currentUser, role: newRole }
          : state.currentUser
      }));
    });

    socket.on('slide-added', (slide) => {
      set(state => ({
        slides: [...state.slides, slide].sort((a, b) => a.order - b.order)
      }));
    });

    socket.on('slide-deleted', ({ slideId }) => {
      console.log('Received slide-deleted event for slideId:', slideId);
      set(state => {
        const newSlides = state.slides.filter(s => s.id !== slideId);
        let newCurrentIndex = state.currentSlideIndex;
        
        if (newCurrentIndex >= newSlides.length && newSlides.length > 0) {
          newCurrentIndex = newSlides.length - 1;
        } else if (newSlides.length === 0) {
          newCurrentIndex = 0;
        }
        
        console.log(`Deleted slide. New slides count: ${newSlides.length}, new current index: ${newCurrentIndex}`);
        
        return {
          slides: newSlides,
          currentSlideIndex: newCurrentIndex
        };
      });
    });

    socket.on('element-added', ({ slideId, element }) => {
      set(state => ({
        slides: state.slides.map(slide =>
          slide.id === slideId
            ? { ...slide, elements: [...slide.elements, element] }
            : slide
        )
      }));
    });

    socket.on('element-updated', ({ slideId, elementId, changes }) => {
      set(state => ({
        slides: state.slides.map(slide =>
          slide.id === slideId
            ? {
                ...slide,
                elements: slide.elements.map(el =>
                  el.id === elementId ? { ...el, ...changes } : el
                )
              }
            : slide
        )
      }));
    });

    socket.on('element-deleted', ({ slideId, elementId }) => {
      set(state => ({
        slides: state.slides.map(slide =>
          slide.id === slideId
            ? {
                ...slide,
                elements: slide.elements.filter(el => el.id !== elementId)
              }
            : slide
        ),
        selectedElements: state.selectedElements.filter(id => id !== elementId),
        editingElementId: state.editingElementId === elementId ? null : state.editingElementId
      }));
    });

    socket.on('element-editing-started', ({ elementId, userId }) => {
      const state = get();
      if (state.currentUser && state.currentUser.id !== userId) {
        set({ editingElementId: elementId });
      }
    });

    socket.on('element-editing-stopped', ({ elementId }) => {
      set(state => ({
        editingElementId: state.editingElementId === elementId ? null : state.editingElementId
      }));
    });

    socket.on('error', ({ message }) => {
      console.error('Socket error:', message);
      alert(`Error: ${message}`);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ 
        socket: null, 
        connected: false,
        currentPresentation: null,
        slides: [],
        users: [],
        currentUser: null,
        selectedElements: [],
        currentSlideIndex: 0,
        editingElementId: null
      });
    }
  },

  addSlide: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('add-slide');
    }
  },

  deleteSlide: (slideId) => {
    const { socket } = get();
    if (socket) {
      socket.emit('delete-slide', { slideId });
    }
  },

  addTextElement: (slideId, element) => {
    const { socket } = get();
    if (socket) {
      socket.emit('add-text-element', { slideId, element });
    }
  },

  updateTextElement: (slideId, elementId, changes) => {
    const { socket } = get();
    if (socket) {
      socket.emit('update-text-element', { slideId, elementId, changes });
      
      set(state => ({
        slides: state.slides.map(slide =>
          slide.id === slideId
            ? {
                ...slide,
                elements: slide.elements.map(el =>
                  el.id === elementId ? { ...el, ...changes } : el
                )
              }
            : slide
        )
      }));
    }
  },

  deleteTextElement: (slideId, elementId) => {
    const { socket } = get();
    if (socket) {
      socket.emit('delete-text-element', { slideId, elementId });
    }
  },

  setCurrentSlide: (index) => {
    set({ 
      currentSlideIndex: index,
      selectedElements: [],
      editingElementId: null
    });
  },

  setSelectedElements: (elementIds) => {
    set({ selectedElements: elementIds });
  },

  changeUserRole: (userId, newRole) => {
    const { socket } = get();
    if (socket) {
      socket.emit('change-user-role', { userId, newRole });
    }
  },

  setEditingElement: (elementId) => {
    const { socket } = get();
    
    set({ editingElementId: elementId });
    
    if (socket && elementId) {
      socket.emit('element-editing-start', { elementId });
    }
  },

  clearEditingElement: () => {
    const { socket, editingElementId } = get();
    
    if (socket && editingElementId) {
      socket.emit('element-editing-stop', { elementId: editingElementId });
    }
    
    set({ editingElementId: null });
  }
}));