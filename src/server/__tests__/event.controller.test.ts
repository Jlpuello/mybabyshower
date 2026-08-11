import request from 'supertest';
import express from 'express';
import { getEvent } from '../controllers/event.controller';

const app = express();
app.use(express.json());
app.get('/api/event', getEvent);

jest.mock('../config/database');

describe('Event Controller', () => {
  it('should return event data', async () => {
    const response = await request(app).get('/api/event');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('publicId');
    expect(response.body).toHaveProperty('title');
  });
});
