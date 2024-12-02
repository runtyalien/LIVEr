const { admin, db } = require('../../config/firebase');
const { client, getAsync, setAsync } = require('../../config/redis');
const { authenticateUser } = require('../../middleware/auth');
const { logger, loggerMiddleware } = require('../../middleware/logger');

// Firebase Configuration Tests
describe('Firebase Configuration', () => {
  it('should initialize Firebase admin', () => {
    expect(admin).toBeDefined();
    expect(db).toBeDefined();
  });

  it('should have Firestore methods available', () => {
    expect(typeof db.collection).toBe('function');
  });
});

// Redis Configuration Tests
describe('Redis Configuration', () => {
  it('should create Redis client', () => {
    expect(client).toBeDefined();
  });

  it('should have async get and set methods', () => {
    expect(typeof getAsync).toBe('function');
    expect(typeof setAsync).toBe('function');
  });
});

// Authentication Middleware Tests
describe('Authentication Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: { 
        authorization: 'Bearer mockToken' 
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should authenticate valid token', async () => {
    jest.spyOn(admin.auth(), 'verifyIdToken').mockResolvedValue({ uid: 'testUser' });

    await authenticateUser(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
  });

  it('should reject invalid token', async () => {
    jest.spyOn(admin.auth(), 'verifyIdToken').mockRejectedValue(new Error('Invalid token'));

    await authenticateUser(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });
});

// Logger Middleware Tests
describe('Logger Middleware', () => {
  it('should create logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('should create logger middleware', () => {
    const mockReq = {
      method: 'GET',
      path: '/test',
      ip: '127.0.0.1'
    };
    const mockRes = {};
    const mockNext = jest.fn();

    loggerMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});

// Product View Middleware Tests
const { productViewController } = require('../../middleware/productview');
const { sendNotification } = require('../../services/emailService');

describe('Product View Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: { userId: 'user123' },
      body: { productId: 'product456' }
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should call next middleware', async () => {
    jest.spyOn(db.collection('users').doc().collection('recentlyViewed'), 'where')
      .mockReturnValue({
        get: jest.fn().mockResolvedValue({ empty: true })
      });

    await productViewController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should send notification for multiple views', async () => {
    const mockSendNotification = jest.spyOn(sendNotification, 'mockImplementation');
    
    jest.spyOn(db.collection('users').doc().collection('recentlyViewed'), 'where')
      .mockReturnValue({
        get: jest.fn().mockResolvedValue({ 
          empty: false, 
          data: () => ({ viewCount: 3 }) 
        })
      });

    await productViewController(mockReq, mockRes, mockNext);

    expect(mockSendNotification).toHaveBeenCalledWith('user123', 'product456', 3);
  });
});