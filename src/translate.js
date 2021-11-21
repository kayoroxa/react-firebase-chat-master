// import { translate } from 'free-translate';

async function translateText(text) {
  console.log('Oi')
  const res = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: 'es',
      format: 'text',
    }),
    headers: { 'Content-Type': 'application/json' },
  })

  const resposta = await res.json()
  return resposta
}

// console.log(translateText('Hello world'))

export default translateText
