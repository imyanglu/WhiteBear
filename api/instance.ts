
import { getItemAsync } from 'expo-secure-store';

const DefaultTimeout = 20000;

const remoteUrl = process.env['EXPO_PUBLIC_API_URL']
const localUrl = process.env['EXPO_PUBLIC_LOCAL_URL']
const isProd = process.env['EXPO_PUBLIC_ENV']==='PROD'

export class ApiError {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

async function fetchMethod<T>({
  banConvert,
  url,
  method,
  body,
  headers: otherHeader = {},
}: {
  url: string;
  method: RequestInit['method'];
  body?: any;
  headers?: RequestInit['headers'];
  banConvert?: boolean;
}) {
  const token = await getItemAsync('token');
  const headers: RequestInit['headers'] = {
    'X-Auth-Token': token ?? '',
    'Content-Type': 'application/json',
    ...otherHeader,
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, DefaultTimeout);

  const baseUrl = isProd ? remoteUrl : localUrl;
  return fetch(url.startsWith('http') ? url :baseUrl+ url, {
    signal: controller.signal,
    method,
    headers,
    body: banConvert ? body : typeof body === 'string' ? body : JSON.stringify(body),
  }).then<T>(async (data) => {
    clearTimeout(timeoutId);
    const { status, headers } = data;
    const type = headers.get('Content-type');
    if (!type?.includes('application/json')) {
      const text = await data.text();
      throw new ApiError(status, text);
    }
    const obj = await data.json();
    if (status >= 200 && status < 300) return obj;
    throw new ApiError(status, 'error');
  });
}

function formatParams<T extends object>(params: T) {
  return Object.keys(params)
    .reduce((string, item) => {
      return (string += `${item}=${params[item as keyof T]}&`);
    }, '?')
    .slice(0, -1);
}

export function get<P, T extends object = object>(
  url: string,
  params?: T,
  headers?: RequestInit['headers']
) {
  let queryString = '';
  if (params && Object.keys(params).length > 0) queryString = formatParams(params);
  return fetchMethod<P>({ url: url + queryString, method: 'get', headers });
}

export function post<P, T extends object = object>(
  url: string,
  body?: { params?: T; data: object | string; banConvert?: boolean },
  headers?: RequestInit['headers']
) {
  const { params, data, banConvert } = body ?? {};
  let queryString = '';
  if (params && Object.keys(params).length > 0) queryString = formatParams(params);
  return fetchMethod<P>({
    url: url + queryString,
    method: 'post',
    body: data ?? null,
    headers,
    banConvert,
  });
}

export function put<P, T extends object = object>(
  url: string,
  body?: { params?: T; data: object | string },
  headers?: RequestInit['headers']
) {
  const { params, data } = body ?? {};
  let queryString = '';
  if (params && Object.keys(params).length > 0) queryString = formatParams(params);
  return fetchMethod<P>({ url: url + queryString, method: 'PUT', body: data ?? null, headers });
}
