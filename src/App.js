import './App.css';
import React, { useState, useEffect } from "react";
import {
  createUsers,
  getPrices,
  setUserPrice,
  getGas
} from './services/api-helper'
import logo_cf_nobg from './images/logo_cf_nobg.png';
import Chainflow from './images/Chainflow.svg'

function App() {
  const [price, setPrice] = useState(0)
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [gas, setGas] = useState(false)

  useEffect(async () => {
    // get gas from database
    let gas_price = await getGas()
    let gas = []
    gas.push(Array.from(String(gas_price[gas_price.length - 1].gas_price), Number))
    // get the time of the last gas price pull to tell users how old the price displayed might be.
    gas.push(gas_price[gas_price.length - 1].updated_at)
    // remove the 0 at the end of the fast gas price
    // gas[0].pop()
    setGas(gas)
  }, [])
 
  let handlePriceChange = event => {
  setPrice(event.target.value)
  }

  let handleEmailChange = event => {
    setEmail(event.target.value)
  }
  
  let handleGramChange = event => {
    setTelegram(event.target.value)
  }

  let handleSubmit = async event => {
    event.preventDefault();
    let formData = {
      email: email,
      telegram: telegram,
    }
    let priceData = {}
    let result = await getPrices()
    let prices = result.data
    priceData.price = parseInt(price)

    if (prices.length !== 0) {
      for (let i = 0; i < prices.length; i++) {
        // if price set by user already exist in the database
        // save user with saved price id reference 
        if (prices[i].price === priceData.price) {
          formData.price_id = prices[i].id
          createUsers(formData)
          break
        }else {
          // if price set by user does not already exist in the database
          // save user price in database
          // save user with saved price id reference
          await setUserPrice(priceData)
          let result = await getPrices()

          formData.price_id= result.data[result.data.length -1].id
          await createUsers(formData)
          break
             }
      }
    }else {
            priceData.price = parseInt(price)
            await setUserPrice(priceData)
            
            formData.price_id= 1
            await createUsers(formData)
          }
  }
  return (
    <div className="App">
      <div class='header'>
        <img class='logo' src={logo_cf_nobg } alt='logo'/>
      </div>
      <div class='body'>
      <div class='hero-section'>
        <img class='hero-logo' src={logo_cf_nobg} alt='logo' />
        <div class='hero-text'>
        <img class='hero-title' src={Chainflow} />
        <p class='hero-sub-title'> Ethereum Gas tracker</p>
        </div>
        
      </div>
        <div class='form-section'>
          {/*condition rendering price after useEffect to prevent errors */
            gas[0] ?
            <div><p>Current 'Ethereum Gas' price:</p>
              <p>{gas[0]}| fast</p></div>
            :
              <></>
          }
      <form class='form' onSubmit={handleSubmit}>
        <p>
              Enter your target price, email and/or telegram username below and we will alert you when the 'Ethereum gas' price is at or below your target.
        </p>
            <label>Your target</label>
        <input
          class='input'
          type='number'
          placeholder='Enter your target price here'
          onChange={handlePriceChange}
        >
            </input>
            <label>Your email</label>
        <input
        class='input'
        type='email'
              placeholder='Enter your Email here'
          onChange={handleEmailChange}
      >
            </input>
            <label>Your telegram</label>
        <input
        class='input'
        type='text'
          placeholder='Enter your telegram here'
          onChange={handleGramChange}
      >
            </input>
            <a href="https://msng.link/o/?EG_price_bot=tg">Message me on Telegram</a>
        <input class='submit-button' type='submit' value='submit'/>
        </form>
        </div>
        </div>
    </div>
  );
}

export default App;
