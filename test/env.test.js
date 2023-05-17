require('dotenv').config();

describe('Environment Variables', () => {
  let env;

  beforeEach(() => {
    env = {
      PORT: process.env.PORT,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      DB_CONN_STRING: process.env.DB_CONN_STRING,
      REDIS_URL: process.env.REDIS_URL,
      DB_NAME: process.env.DB_NAME,
      BOOK_SUMMARY_COLLECTION_NAME: process.env.BOOK_SUMMARY_COLLECTION_NAME,
      PROMPT_CACHE_COLLECTION_NAME: process.env.PROMPT_CACHE_COLLECTION_NAME,
      PROFILE_COLLECTION_NAME: process.env.PROFILE_COLLECTION_NAME,
      OPENAI_QUERY_COLLECTION_NAME: process.env.OPENAI_QUERY_COLLECTION_NAME,
      NODE_ENV: process.env.NODE_ENV,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    };
  });

  it('should have the correct keys', () => {
    const expectedKeys = [
      'PORT',
      'OPENAI_API_KEY',
      'DB_CONN_STRING',
      'REDIS_URL',
      'DB_NAME',
      'BOOK_SUMMARY_COLLECTION_NAME',
      'PROMPT_CACHE_COLLECTION_NAME',
      'PROFILE_COLLECTION_NAME',
      'OPENAI_QUERY_COLLECTION_NAME',
      'NODE_ENV',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
    ];

    expect(Object.keys(env)).toEqual(expectedKeys);
  });

  it('should have string values', () => {
    Object.values(env).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });

  it('should not be empty', () => {
    Object.values(env).forEach((value) => {
      expect(value).toBeTruthy();
    });
  });

  it('should have a valid MongoDB connection string', () => {
    const mongoDbConnStringPattern = /^mongodb:\/\/(\w+\.)*\w+(:\d+)?\/?$/;

    expect(env.DB_CONN_STRING).toMatch(mongoDbConnStringPattern);
  });


});
