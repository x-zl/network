const BackendURL = 'http://47.100.162.64:8000/'

export function handleResponse (response) {
  let contentType = response.headers.get('content-type')
  if (contentType.includes('application/json')) {
    return handleJSONResponse(response)
  } else if (contentType.includes('text/html')) {
    return handleTextResponse(response)
  } else {
    throw new Error(`Sorry, content-type ${contentType} not supported`)
  }
}

function handleJSONResponse (response) {
  return response.json()
    .then(json => {
      if (response.ok) {
        return json;
      } else {
        return Promise.reject(Object.assign({}, json, {
          status: response.status,
          statusText: response.statusText
        }))
      }
    })
}

function handleTextResponse (response) {
  return response.text()
    .then(text => {
      if (response.ok) {
        return text;
      } else {
        return Promise.reject({
          status: response.status,
          statusText: response.statusText,
          err: text
        })
      }
    })
}

export function handleHeaderWithAuthToken(headers={}) {
  const newHeaders = { ...headers };
  newHeaders.Authorization = `JWT ${localStorage.getItem('token')}`;
  return newHeaders;
}

export function handleUrl(url, param=undefined) {
  let newUrl = `${BackendURL}${url}`;
  if (!param) {
    return newUrl;
  }
  if (newUrl.endsWith('/')) {
    newUrl = newUrl.slice(0,-1);
  }
  newUrl = `${newUrl}?`
  for (let [key, value] of Object.entries(param)) {
    newUrl = `${newUrl}${key}=${value}&`;
  }
  return newUrl.slice(0,-1);
}
