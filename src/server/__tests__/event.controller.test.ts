import request from 'supertest';
import express from 'express';
import { getEvent } from '../controllers/event.controller.ts';

const app = express();
app.use(express.json());
app.get('/api/event', getEvent);

jest.mock('../config/database.ts', () => ({
  prisma: {
    event: {
      findFirst: jest.fn().mockResolvedValue({
        publicId: 'evt-123',
        title: 'Baby Shower de Sofía',
        babyName: 'Sofía',
        eventDate: new Date().toISOString(),
        eventTime: '15:00',
        location: 'Jardín Principal',
        address: 'Calle 123 #45-67',
      }),
    },
  },
}));

describe('Event Controller', () => {
  it('should return event data', async () => {
    const response = await request(app).get('/api/event');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('publicId');
    expect(response.body).toHaveProperty('title');
  });
});
