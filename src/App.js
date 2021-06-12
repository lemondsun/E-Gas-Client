import './App.css';
import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import SuccessModal from './components/SuccessModal';
import SubmitForm from './components/SumbitForm';
//api helpers
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
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


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
   
  }

  let handleEmailChange = event => {
    setEmail(event.target.value)
   
  }
  
  // let handleGramChange = event => {
  //   setTelegram(event.target.value)
  // }

  let handleSubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    let formData = {
      email: email,
      telegram: telegram,
    }
    let priceData = {}
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setShow(true)
    }
    setValidated(true);
    
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
      
      {/*Modal for successfully submiting form */}
      <SuccessModal show={show} handleClose={handleClose} />
      
      <Container class='body'>
        
      <div class='hero-section'>
        <img class='hero-logo' src={logo_cf_nobg} alt='logo' />
        <div class='hero-text'>
        <img class='hero-title' src={Chainflow} alt='title'/>
        <p class='hero-sub-title'>Ethereum Gas Tracker</p>
        </div>
        </div>

        <div class='form-section'>
          {/*condition rendering Ethereum gas price after useEffect gets the Ethereum price to prevent async errors */
            gas[0] ?
              <div>
                <p class='body-text'>
                  The Ethereum gas price is <span class='gas-price'> {gas[0]}| fast</span> as of <span class='gas-price'> {gas[1] }</span> ago.
                </p>
              </div>
            :
              <LoadingDisplay
                type={'bars'}
                color={'#EC6431'}
              />
          }
          <SubmitForm
            handleSubmit={handleSubmit}
            handlePriceChange={handlePriceChange}
            handleEmailChange={handleEmailChange}
            validated={validated}
          />
        </div>
      </Container>
      <footer>
        <p class='footer-text' >This service is brought to you by <a class='text-link' href='https://chainflow.io/'>Chainflow</a>.</p>
        <p class='footer-text' > The Ethereum gas price data is delivered from <a class='text-link' href='https://docs.defipulse.com/'>DeFi Pulse Data</a>.</p>
        <p class='footer-text' >Website is a <a class='text-link' href='https://www.jasonmullingspro.com/'>Jason Mullings</a> production.</p>
      </footer>
    </div>
  );
}

export default App;

