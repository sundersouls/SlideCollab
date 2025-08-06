import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));
app.use(express.json({ limit: '10mb' }));

interface User {
  id: string;
  nickname: string;
  role: 'creator' | 'editor' | 'viewer';
  socketId: string;
}

interface TextElement {
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

interface Slide {
  id: string;
  order: number;
  elements: TextElement[];
}

interface Presentation {
  id: string;
  name: string;
  creatorId: string;
  slides: Slide[];
  users: Map<string, User>;
}
const presentations = new Map<string, Presentation>();
const userSessions = new Map<string, { userId: string; presentationId: string }>();

app.get('/api/presentations', async (req, res) => {
  try {
    const dbPresentations = await prisma.presentation.findMany({
      include: {
        slides: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    const presentationList = dbPresentations.map(p => ({
      id: p.id,
      name: p.name,
      creatorId: p.creatorId,
      slideCount: p.slides.length,
      activeUsers: presentations.get(p.id)?.users.size || 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));
    
    res.json(presentationList);
  } catch (error) {
    console.error('Error fetching presentations:', error);
    res.status(500).json({ error: 'Failed to fetch presentations' });
  }
});

app.post('/api/presentations', async (req, res) => {
  try {
    const { name, creatorNickname } = req.body;
    
    if (!name || !creatorNickname) {
      return res.status(400).json({ error: 'Name and creator nickname are required' });
    }
    
    const presentationId = nanoid();
    const creatorId = nanoid();
    
    const presentation = await prisma.presentation.create({
      data: {
        id: presentationId,
        name,
        creatorId,
        slides: {
          create: {
            id: nanoid(),
            order: 0,
            elements: JSON.stringify([])
          }
        }
      },
      include: {
        slides: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    const memoryPresentation: Presentation = {
      id: presentation.id,
      name: presentation.name,
      creatorId: presentation.creatorId,
      slides: presentation.slides.map((s: any) => ({
        id: s.id,
        order: s.order,
        elements: s.elements ? JSON.parse(s.elements) : [] as TextElement[]
      })),
      users: new Map()
    };
    
    presentations.set(presentation.id, memoryPresentation);
    
    res.json({
      id: presentation.id,
      name: presentation.name,
      creatorId: presentation.creatorId,
      slideCount: presentation.slides.length,
      activeUsers: 0,
      createdAt: presentation.createdAt,
      updatedAt: presentation.updatedAt
    });
    
  } catch (error) {
    console.error('Error creating presentation:', error);
    res.status(500).json({ error: 'Failed to create presentation' });
  }
});

app.get('/api/admin/data', async (req, res) => {
  try {
    const presentations = await prisma.presentation.findMany({
      include: { slides: true }
    });
    const slides = await prisma.slide.findMany();
    res.json({ presentations, slides });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-presentation', async ({ presentationId, nickname }) => {
    try {
      let presentation = presentations.get(presentationId);
      
      if (!presentation) {
        const dbPresentation = await prisma.presentation.findUnique({
          where: { id: presentationId },
          include: {
            slides: {
              orderBy: { order: 'asc' }
            }
          }
        });
        
        if (!dbPresentation) {
          socket.emit('error', { message: 'Presentation not found' });
          return;
        }
        
        presentation = {
          id: dbPresentation.id,
          name: dbPresentation.name,
          creatorId: dbPresentation.creatorId,
          slides: dbPresentation.slides.map((s: any) => ({ 
            id: s.id,
            order: s.order,
            elements: typeof s.elements === 'string' ? JSON.parse(s.elements) : []
          })),
          users: new Map()
        };
        
        presentations.set(presentationId, presentation);
      }
      
      const userId = nanoid();
      const user: User = {
        id: userId,
        nickname,
        role: presentation.users.size === 0 ? 'creator' : 'viewer',
        socketId: socket.id
      };
      
      presentation.users.set(userId, user);
      userSessions.set(socket.id, { userId, presentationId });
      
      socket.join(presentationId);
      
      socket.emit('presentation-data', {
        presentation: {
          id: presentation.id,
          name: presentation.name,
          slides: presentation.slides
        },
        currentUser: user,
        users: Array.from(presentation.users.values())
      });
      
      socket.to(presentationId).emit('user-joined', user);
      
      console.log(`User ${nickname} joined presentation ${presentationId}`);
    } catch (error) {
      console.error('Error joining presentation:', error);
      socket.emit('error', { message: 'Failed to join presentation' });
    }
  });

  socket.on('add-slide', async () => {
    try {
      const session = userSessions.get(socket.id);
      if (!session) return;
      
      const presentation = presentations.get(session.presentationId);
      if (!presentation) return;
      
      const user = presentation.users.get(session.userId);
      if (!user || user.role !== 'creator') return;
      
      const newSlideId = nanoid();
      const newOrder = presentation.slides.length;
      
      const newSlide: Slide = {
        id: newSlideId,
        order: newOrder,
        elements: []
      };
      
      presentation.slides.push(newSlide);
      presentation.slides.sort((a, b) => a.order - b.order);
      
      await prisma.slide.create({
        data: {
          id: newSlideId,
          order: newOrder,
          elements: JSON.stringify([]),
          presentationId: session.presentationId
        }
      });
      
      io.to(session.presentationId).emit('slide-added', newSlide);
      
    } catch (error) {
      console.error('Error adding slide:', error);
    }
  });

  socket.on('delete-slide', async ({ slideId }) => {
    try {
      console.log(`Received delete-slide event for slideId: ${slideId}`);
      const session = userSessions.get(socket.id);
      if (!session) {
        socket.emit('error', { message: 'No active session' });
        return;
      }
      
      const presentation = presentations.get(session.presentationId);
      if (!presentation) {
        socket.emit('error', { message: 'Presentation not found' });
        return;
      }
      
      const user = presentation.users.get(session.userId);
      if (!user || user.role !== 'creator') {
        socket.emit('error', { message: 'Only creators can delete slides' });
        return;
      }
      
      if (presentation.slides.length <= 1) {
        socket.emit('error', { message: 'Cannot delete the last slide' });
        return;
      }
      
      const slideToDelete = presentation.slides.find(s => s.id === slideId);
      if (!slideToDelete) {
        socket.emit('error', { message: 'Slide not found' });
        return;
      }
      
      console.log(`Attempting to delete slide ${slideId} from presentation ${session.presentationId}`);
      
      presentation.slides = presentation.slides.filter(s => s.id !== slideId);
      
      try {
        await prisma.slide.delete({
          where: { id: slideId }
        });
        console.log(`Successfully deleted slide ${slideId} from database`);
      } catch (dbError) {
        console.error('Database deletion error:', dbError);
      }
      
      io.to(session.presentationId).emit('slide-deleted', { slideId });
      console.log(`Broadcasted slide deletion to presentation ${session.presentationId}`);
      
    } catch (error) {
      console.error('Error deleting slide:', error);
      socket.emit('error', { message: 'Failed to delete slide' });
    }
  });
  
  socket.on('add-text-element', async ({ slideId, element }) => {
    try {
      const session = userSessions.get(socket.id);
      if (!session) return;
      
      const presentation = presentations.get(session.presentationId);
      if (!presentation) return;
      
      const user = presentation.users.get(session.userId);
      if (!user || (user.role !== 'creator' && user.role !== 'editor')) return;
      
      const slide = presentation.slides.find(s => s.id === slideId);
      if (!slide) return;
      
      const newElement: TextElement = {
        ...element,
        id: nanoid(),
        editedBy: user.id
      };
      
      slide.elements.push(newElement);
      
      await prisma.slide.update({
        where: { id: slideId },
        data: { elements: JSON.stringify(slide.elements) }
      });
      
      io.to(session.presentationId).emit('element-added', {
        slideId,
        element: newElement
      });
      
    } catch (error) {
      console.error('Error adding text element:', error);
    }
  });
  
  socket.on('update-text-element', async ({ slideId, elementId, changes }) => {
    try {
      const session = userSessions.get(socket.id);
      if (!session) return;
      
      const presentation = presentations.get(session.presentationId);
      if (!presentation) return;
      
      const user = presentation.users.get(session.userId);
      if (!user || (user.role !== 'creator' && user.role !== 'editor')) return;
      
      const slide = presentation.slides.find(s => s.id === slideId);
      if (!slide) return;
      
      const elementIndex = slide.elements.findIndex(e => e.id === elementId);
      if (elementIndex === -1) return;
      
      slide.elements[elementIndex] = {
        ...slide.elements[elementIndex],
        ...changes,
        editedBy: user.id
      };
      
      await prisma.slide.update({
        where: { id: slideId },
        data: { elements: JSON.stringify(slide.elements) }
      });
      
      socket.to(session.presentationId).emit('element-updated', {
        slideId,
        elementId,
        changes: {
          ...changes,
          editedBy: user.id
        }
      });
      
    } catch (error) {
      console.error('Error updating text element:', error);
    }
  });
  
  socket.on('delete-text-element', async ({ slideId, elementId }) => {
    try {
      const session = userSessions.get(socket.id);
      if (!session) return;
      
      const presentation = presentations.get(session.presentationId);
      if (!presentation) return;
      
      const user = presentation.users.get(session.userId);
      if (!user || (user.role !== 'creator' && user.role !== 'editor')) return;
      
      const slide = presentation.slides.find(s => s.id === slideId);
      if (!slide) return;
      
      slide.elements = slide.elements.filter(e => e.id !== elementId);
      
      await prisma.slide.update({
        where: { id: slideId },
        data: { elements: JSON.stringify(slide.elements) }
      });
      
      io.to(session.presentationId).emit('element-deleted', {
        slideId,
        elementId
      });
      
    } catch (error) {
      console.error('Error deleting text element:', error);
    }
  });
  
  socket.on('change-user-role', ({ userId, newRole }) => {
    const session = userSessions.get(socket.id);
    if (!session) return;
    
    const presentation = presentations.get(session.presentationId);
    if (!presentation) return;
    
    const currentUser = presentation.users.get(session.userId);
    if (!currentUser || currentUser.role !== 'creator') return;
    
    const targetUser = presentation.users.get(userId);
    if (!targetUser) return;
    
    targetUser.role = newRole;
    
    io.to(session.presentationId).emit('user-role-changed', {
      userId,
      newRole
    });
  });
  
  socket.on('disconnect', () => {
    const session = userSessions.get(socket.id);
    if (session) {
      const presentation = presentations.get(session.presentationId);
      if (presentation) {
        presentation.users.delete(session.userId);
        socket.to(session.presentationId).emit('user-left', session.userId);
      }
      userSessions.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});