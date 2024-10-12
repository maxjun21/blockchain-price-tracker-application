import * as dotenv from 'dotenv';

dotenv.config();

const {
  NODE_ENV,
  PORT,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  EMAIL_USER,
  EMAIL_PASSWORD,
  SEND_TO,
  MORALIS_API_KEY,
  ETH_CHAIN_ID,
  POLYGON_CHAIN_ID,
  APP_DIR,
  MATIC_ETHEREUM,
  MATIC_POLYGON,
} = process.env;

export default () => ({
  environment: NODE_ENV || 'development',
  port: +PORT || 3000,
  database: {
    type: 'postgres',
    host: DATABASE_HOST || 'localhost',
    port: +DATABASE_PORT || 5432,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  },
  email: {
    user: EMAIL_USER,
    password: EMAIL_PASSWORD,
    sendTo: SEND_TO,
  },
  moralis: {
    apiKey: MORALIS_API_KEY,
  },
  ethereum: {
    chainId: ETH_CHAIN_ID,
    maticToken: MATIC_ETHEREUM,
  },
  polygon: {
    chainId: POLYGON_CHAIN_ID,
    nativeToken: MATIC_POLYGON,
  },
  log: {
    dir: APP_DIR,
  },
});
