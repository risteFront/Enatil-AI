import superagent from 'superagent';
import FormValue from "./apiInterface"
const API = 'http://localhost:3000';
const responseBody = (res: any) => {
  return res.body;
};

const httpHeaders = (req: any) => {
  req.set({
    Accept: 'application/json',
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:8000'
    },
    credentials: true
  });
};

const requests = {
  del: (url: string) => superagent.del(`${API}${url}`).withCredentials().use(httpHeaders).then(responseBody),
  get: (url: string) => superagent.get(`${API}${url}`).withCredentials().use(httpHeaders).then(responseBody),
  put:<FormValue> (url: string, body:  FormValue | any) => superagent.put(`${API}${url}`, body).withCredentials().use(httpHeaders).then(responseBody),
  post:<FormValue>(url: string, body: FormValue | any) => superagent.post(`${API}${url}`,body).withCredentials().use(httpHeaders).then(responseBody)
};

const Crawler = {
  crawl: (url: string , body: FormValue | any) => requests.post('/crawler/crawl', { url  , body}),
  getHistory: () => requests.get(`/crawler/history`)
};

export default {
  Crawler
};
