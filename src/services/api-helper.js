import axios from 'axios'

const baseUrl = process.env.E_GAS_API;
const api = axios.create({
  baseURL: baseUrl
});

export let createUsers = async(formData) => {
await api.post('/users', formData)
}

export let getPrices = async() => {
  let response = await api.get('/prices')
  return response
}

export let setUserPrice = async(priceData) => {
 await api.post('/prices', priceData)
}

export let getGas = async () => {
  let response = await api.get('/gas_prices')
  return response.data
}