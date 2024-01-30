import axios, { ResponseType } from 'axios'

const sendRequest = (
  method = 'post',
  link: string,
  data?: object,
  auth = false,
  responseType?: ResponseType,
) => {
  const headers: {Authorization?: string} = {}

  if (auth && !localStorage.getItem('token')) {
    return new Promise((_resolve, reject) =>
      reject(new Error('Not authenticated'))
    )
  }
  // even not for 'WithAuth' methods try to append auth token
  if (localStorage.getItem('token')) {
    headers.Authorization = localStorage.getItem('token') ?? undefined
  }

  return axios({
    method,
    url: `${import.meta.env.VITE_SERVER_BASE}${link}`,
    data,
    headers,
    responseType,
  })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const getRequest = (link: string) => {
  return sendRequest('get', link)
}

export const getRequestWithAuth = (link: string, responseType?: ResponseType) => {
  return sendRequest('get', link, {}, true, responseType)
}

export const postRequest = (link: string, data = {}) => {
  return sendRequest('post', link, data)
}

export const postRequestWithAuth = (link: string, data = {}) => {
  return sendRequest('post', link, data, true)
}

export const deleteRequestWithAuth = (link: string, data = {}) => {
  return sendRequest('delete', link, data, true)
}
