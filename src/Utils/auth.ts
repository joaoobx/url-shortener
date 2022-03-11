export default {
  jwt: {
    secret: process.env.APP_SECRET || '284458c3c0dc53c13463aa939617b25a',
    expiresIn: '1d',
  },
};
