/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
export default function Hand ({player ,hand}) {
  return(
  <div className='hand'>
    <h1>{player}'s Hand:</h1>
    {hand.map(card => <p className='card' key={`${card.value}-${card.suit}`}>{card.unicode}</p>)}
  </div>
  )
}