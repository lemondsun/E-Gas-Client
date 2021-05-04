import './App.css';
import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
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
  const [priceAlert, setPriceAlert] = useState(false)

  useEffect(async () => {
    // get gas from database
    let gas_price = await getGas()
    let gas = []
    var d = new Date();
    var n = d.toISOString();
    // let gtime = formatDistance(
    //   gas_price[gas_price.length - 1].updated_at,
    //  n,
    //   { includeSeconds: true }
    // )
    gas.push(Array.from(String(gas_price[gas_price.length - 1].gas_price), Number))
    // get the time of the last gas price pull to tell users how old the price displayed might be.
    gas.push(gas_price[gas_price.length - 1].updated_at)


console.log(gas_price[gas_price.length - 1].updated_at, n)
    setGas(gas)
  }, [])
 
  let handlePriceChange = event => {
    setPrice(event.target.value)
    setPriceAlert(false)
  }

  let handleEmailChange = event => {
    setEmail(event.target.value)
  }
  
  let handleGramChange = event => {
    setTelegram(event.target.value)
  }

  let handleSubmit = async event => {
    event.preventDefault()

    let formData = {
      email: email,
      telegram: telegram,
    }

    if (price <= 0) {
      setPriceAlert(true)
      return
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
      <div class='body'>
      <div class='hero-section'>
        <img class='hero-logo' src={logo_cf_nobg} alt='logo' />
        <div class='hero-text'>
        <img class='hero-title' src={Chainflow} />
        <p class='hero-sub-title'>Ethereum Gas Tracker</p>
        </div>
        
      </div>
        <div class='form-section'>
          {/*condition rendering price after useEffect to prevent syncronism errors */
            gas[0] ?
              <div>
                <p class='body-text'>
                  Current Ethereum gas price:<span class='gas-price'> {gas[0]}| fast</span> as of 
                </p>
              </div>
            :
              <></>
          }
      <form class='form' onSubmit={handleSubmit}>
        <p class='body-text'>
              Enter your target price with your email below and we will alert you when the Ethereum gas price is at or below your target.
        </p>
            <label class='label'>Your target:</label>
        <input
          class='input'
          type='number'
          placeholder='Enter your target price here'
          onChange={handlePriceChange}
        >
            </input>
            <label class='label'>Your email:</label>
        <input
        class='input'
        type='email'
              placeholder='Enter your Email here'
          onChange={handleEmailChange}
      >
            </input>
            { 
            // <label>Your telegram</label>
    //   <input
      //   class='input'
      //   type='text'
      //     placeholder='Enter your telegram here'
      //     onChange={handleGramChange}
      // >
              //       </input>
            }
            <Button class='submit-button' variant="outlined" type='submit' value='submit'>Submit</Button>
            {
              priceAlert === true ?
              <div class='alert'>
              <p>
                Please enter a price greater than 0 for our service.
              </p>
            </div>
                :
                <></>
            }
          
            {/*<a class='tele-link' href="https://msng.link/o/?EG_price_bot=tg">After submitting your price and email, you can make request for up to the minute Ethereum gas prices on Telegram</a>*/}
        </form>
        </div>
      </div>
      <footer>
        <p>This service is brought to you by <a class='chainflow-link' href='https://chainflow.io/'>Chainflow</a>. The Ethereum gas price data is delivered from <a href='https://docs.defipulse.com/'>DeFi Pulse Data</a>.</p>
        <p>Website is a <a href='https://www.jasonmullingspro.com/'>Jason Mullings</a> production.</p>
      </footer>
    </div>
  );
}

export default App;
