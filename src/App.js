import './App.css';
import React, { useState, useEffect } from "react";
import ReactLoading from 'react-loading';
import Button from '@material-ui/core/Button';
import {
  createUsers,
  getPrices,
  setUserPrice,
  getGas
} from './services/api-helper'
import LoadingDisplay from './components/LoadingDisplay'
import { formatDistance } from 'date-fns'
// company logos
import logo_cf_nobg from './images/logo_cf_nobg.png';
import Chainflow from './images/Chainflow.svg'

function App() {
  const [price, setPrice] = useState(0)
  const [email, setEmail] = useState("")
  const [telegram, setTelegram] = useState("")
  const [gas, setGas] = useState(false)
  const [priceAlert, setPriceAlert] = useState(false)
  const [emailAlert, setEmailAlert] = useState(false)
  const [submitAlert, setSubmitAlert] = useState(false)


  useEffect(async () => {
    // gets Ethereum gas price from database.
    let gas_price = await getGas()
    let gas = []
    // gets time of latest Ethereum gas price pull and assigns to variable.
    var d = new Date(gas_price[gas_price.length - 1].updated_at);
    // assigns the difference in text between the variable and the current timen to a variable to save in state.
    let gtime = formatDistance(
      new Date(),
      d,
      { includeSeconds: true }
    )
    gas.push(Array.from(String(gas_price[gas_price.length - 1].gas_price), Number))
    gas.push(gtime)
    setGas(gas)
  }, [])


  let handlePriceChange = event => {
    setPrice(event.target.value)
    setPriceAlert(false)
  }

  let handleEmailChange = event => {
    setEmail(event.target.value)
    setEmailAlert(false)
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
    // makes sure the user enters valid price.
    if (price <= 0) {
      setPriceAlert(true)
      return
    }

    // makes sure the user enters an email.
    if (email === "") {
      setEmailAlert(true)
      return
    }

    setSubmitAlert(true)

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
          // save users price in database
          // save user with saved price id reference
          await setUserPrice(priceData)
          let result = await getPrices()

          formData.price_id= result.data[result.data.length -1].id
          await createUsers(formData)
          break
          }
      }
    } else {
      // incase the prices table is empty
      // save the users price
            priceData.price = parseInt(price)
      await setUserPrice(priceData)
      // get that price from the list of any that might have been saved at the same time.
      let thisRresult = await getPrices()
      for (let i = 0; i < thisRresult.length; i++){
        if (thisRresult[i] === priceData.price) {
          // get the matching price.id
          formData.price_id = thisRresult[i].id
            await createUsers(formData)}
      }
      
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
          {/*condition rendering price after useEffect to prevent async errors */
            gas[0] ?
              <div>
                <p class='body-text'>
                  The Ethereum gas price is <span class='gas-price'> {gas[0]}| fast</span> as of <span class='gas-price'> {gas[1] }</span> ago.
                </p>
              </div>
            :
            <LoadingDisplay type={'bars' } color={'#EC6431'} />
          }
      
          <form class='form' onSubmit={handleSubmit}>
            {
              submitAlert === true ?
              
                <div class='completion-section'>
                  <p class='body-text completion-text'>
                    Thank you for using our service. Refresh the page to enter another price.
              </p>
                </div>
                :
                <p class='body-text'>
                  Enter your target price with your email below and we will alert you when the Ethereum gas price is at or below your target.
        </p>
            }
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
              priceAlert === true ?
              <div class='alert'>
              <p>
                Please enter a price greater than 0 for our service.
              </p>
            </div>
                :
                <Button class='submit-button' variant="outlined" type='submit' value='submit'>Submit</Button>

            }
            {
              emailAlert === true ?
                <div class='alert-background' >
                  <div class='alert'>
              <p>
                      Please enter a valid email for our service.
              </p>
              </div>
            </div>
                :
                <></>
            }
          
            {/*<a class='tele-link' href="https://msng.link/o/?EG_price_bot=tg">After submitting your price and email, you can make request for up to the minute Ethereum gas prices on Telegram</a>*/}
        </form>
        </div>
        
      </div>
      <footer>
        <p class='footer-text' >This service is brought to you by <a class='chainflow-link' href='https://chainflow.io/'>Chainflow</a>.</p>
        <p class='footer-text' > The Ethereum gas price data is delivered from <a href='https://docs.defipulse.com/'>DeFi Pulse Data</a>.</p>
        <p class='footer-text' >Website is a <a href='https://www.jasonmullingspro.com/'>Jason Mullings</a> production.</p>
      </footer>
    </div>
  );
}

export default App;
