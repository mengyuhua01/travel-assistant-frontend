import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api';

const token = process.env.REACT_APP_COZE_API_TOKEN;
const baseURL = COZE_CN_BASE_URL;

if (!token) {
  throw new Error("REACT_APP_COZE_API_TOKEN is not set in environment variables.");
}

const client = new CozeAPI({
  baseURL,
  token,
});

export default client;
