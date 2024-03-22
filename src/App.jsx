import { useState } from 'react'
import './style.css'

import Hand from './Hand';


function App() {

const cards = {
  "suits": ["hearts", "diamonds", "spades", "clubs"],
  "values": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
}

function shuffle (array) {
  //initialize empty array
  const output = [];
  //copy input array
  const input = array.slice(0)
  //for each card in array
  for(let i = 0; i < array.length; i++){
    //take a random index in the input array
    let index = Math.floor(Math.random() * (input.length - 1))
    //push to return array
    output.push(input[index])
    //remove index from input array
    input.splice(index, 1);
  }
  //return output
  return output;
}

function generateDeck () {
  //initialize deck array
  let deck = [];
  //iterate through suits
  for(let suit of cards.suits){
    //iterate through values
    for(let value of cards.values){
      //create new card object
      let newCard = {suit, value};
      //add unicode representation
      cardToUnicode(newCard);
      //add to the deck 6 times
      for(let i = 0; i <= 5; i++)
      {deck.push(newCard);}
    }
  }
  //shuffle deck
  deck = shuffle(deck);
  //return deck
  return deck;
}

function cardToUnicode (card) {
  let hexCode = 0x1F000;
  switch(card.suit){
    case 'spades': hexCode += 0x000A0; break;
    case 'hearts': hexCode += 0x000B0; break;
    case 'diamonds': hexCode += 0x000C0; break;
    case 'clubs': hexCode += 0x000D0; break;
  }
  switch(card.value){
    case 'A' : hexCode += 0x00001; break;
    case '2' : hexCode += 0x00002; break;
    case '3' : hexCode += 0x00003; break;
    case '4' : hexCode += 0x00004; break;
    case '5' : hexCode += 0x00005; break;
    case '6' : hexCode += 0x00006; break;
    case '7' : hexCode += 0x00007; break;
    case '8' : hexCode += 0x00008; break;
    case '9' : hexCode += 0x00009; break;
    case '10': hexCode += 0x0000A; break;
    case 'J' : hexCode += 0x0000B; break;
    case 'Q' : hexCode += 0x0000D; break;
    case 'K' : hexCode += 0x0000E; break;
  }
  card.unicode = String.fromCodePoint(hexCode);
  return String.fromCodePoint(hexCode);
}

function getScore (hand) {
  //initialize output var
  let score = 0;
  //initialize ace counter
  let aceCounter = 0;
  //iterate through cards in hand
  for(let card of hand){
    //if not an ace
    if(card.value !== 'A'){
      //add card value to output
      if(['J', 'Q', 'K'].includes(card.value)){
        score += 10;
      }
      else{
        score += (+card.value)
      }
    }
    //if is an ace
    else{
      //add 1 to ace counter
      aceCounter += 1;
    }
  }
  //for each ace counted
  for(let i = 1; i <= aceCounter; i++){
    //add 11 to score
    score += 11;
    //if over 21
    if(score > 21){
      //subtract 10
      score -= 10
    }
  }
  //return score
  return score;
}

function startGame () {
  //deal hands
  setPlayer(() => {return {...player, cards:[deck[deck.length - 1], deck[deck.length - 2]], score: 0}})
  setDealer(() => {return {...dealer, cards:[deck[deck.length - 3], {...deck[deck.length - 4], unicode: String.fromCodePoint(0x1F0A0)}], score: 0}})
  //remove the cards from the end of the deck
  setDeck(() => deck.slice(0, deck.length - 4))
  //reset result
  setResult(() => '')
}

function hit () {
  //add next card to hand
  setPlayer(() => {return {...player, cards:[...player.cards, deck[deck.length - 1]]}})
  //remove card from deck
  setDeck(() => deck.slice(0, deck.length - 1));
}

function endGame () {
  //get player score
  const playerScore = getScore(player.cards);
  //update player score
  setPlayer(() => {return {...player, score: playerScore}});
  //flip dealer facedown card
  setDealer(() => {return {...dealer, cards: [dealer.cards[0], {...dealer.cards[1], unicode: cardToUnicode(dealer.cards[1])}]}})
  //copy dealer with score
  let currentDealer = {...dealer, score: getScore(dealer.cards)};
  //deal dealer cards until their score is at or over 17
  while(currentDealer.score <= 17){
    //deal a card to dealer
    currentDealer.cards = [...currentDealer.cards, deck[deck.length - currentDealer.cards.length + 1]];
    //score dealer
    currentDealer.score = getScore(currentDealer.cards);
  }
  //set dealer
  setDealer(() => currentDealer)
  //set result
  setResult(() => {
    if(playerScore <= 21 && playerScore > currentDealer.score || currentDealer.score > 21 && playerScore <= 21){
      return 'Congrats, You win!'
    }
    else if(playerScore < currentDealer.score && currentDealer.score <= 21 || playerScore > 21 && currentDealer.score <= 21){
      return 'Sorry, You lost.'
    }
    else{
      return 'It\'s a draw'
    }
  } )
}

  const [deck, setDeck] = useState(generateDeck());
  const [player, setPlayer] = useState({cards: [], score: 0})
  const [dealer, setDealer] = useState({cards: [], score: 0})
  const [result, setResult] = useState('')

  return (
    <>
      <button className='btn' onClick={() => startGame()}>Deal</button>
      <Hand player='Dealer' hand={dealer.cards} />
      <p>Score: {JSON.stringify(dealer.score)}</p>
      <Hand player='Player' hand={player.cards}/>
      <p>Score: {JSON.stringify(player.score)}</p>
      <button className="btn btn-hit" onClick={() => hit()}>Hit</button>
      <button className="btn btn-stay" onClick={() => endGame()}>Stay</button>
      <h4>{result}</h4>
    </>
  )
}

export default App