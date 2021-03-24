export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    expired: '1d',
  },
};
