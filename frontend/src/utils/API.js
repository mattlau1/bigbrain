import BACKEND_PORT from '../config'

export default class API {
  /** @param {String} url */
  constructor () {
    this.url = `http://localhost:${BACKEND_PORT.BACKEND_PORT}`;
  }

  /** @param {String} path */
  /** @param {Object} body */
  postAPIRequestBody (path, body) {
    return fetch(`${this.url}/${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  /** @param {String} path */
  /** @param {Object} body */
  /** @param {String} token */
  postAPIRequestToken (path, token) {
    return fetch(`${this.url}/${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /** @param {String} path */
  /** @param {Object} body */
  /** @param {String} token */
  postAPIRequestBodyToken (path, body, token) {
    return fetch(`${this.url}/${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  }

  /** @param {String} path */
  /** @param {Object} query */
  /** @param {String} token */
  getAPIRequestTokenQuery (path, query, token) {
    return fetch(`${this.url}/${path}/?` + new URLSearchParams(query), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Gets user data from given token
  /** @param {String} token */
  getAPIUserData (token) {
    return fetch(`${this.url}/user/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        return responseData;
      })
      .catch((error) => console.warn(error));
  }

  /** @param {String} path */
  /** @param {Object} query */
  /** @param {String} token */
  putAPIRequestTokenQuery (path, query, token) {
    return fetch(`${this.url}/${path}/?` + new URLSearchParams(query), {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /** @param {String} path */
  /** @param {Object} query */
  /** @param {Object} body */
  /** @param {String} token */
  putAPIRequestTokenBodyQuery (path, query, body, token) {
    return fetch(`${this.url}/${path}/?` + new URLSearchParams(query), {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  }

  /** @param {String} path */
  /** @param {Object} body */
  /** @param {String} token */
  putAPIRequestTokenBody (path, body, token) {
    return fetch(`${this.url}/${path}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  }

  /** @param {String} path */
  /** @param {Object} body */
  putAPIRequestBody (path, body) {
    return fetch(`${this.url}/${path}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  /** @param {String} path */
  /** @param {String} token */
  deleteAPIRequestToken (path, token) {
    return fetch(`${this.url}/${path}/`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /** @param {String} path */
  /** @param {String} token */
  getAPIRequestToken (path, token) {
    return fetch(`${this.url}/${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /** @param {String} path */
  /** @param {String} token */
  getAPIRequestQuizDetails (path, token) {
    return fetch(`${this.url}/${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /** @param {String} path */
  getAPIRequest (path) {
    return fetch(`${this.url}/${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
}
