import crypto from 'crypto'


export const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, 
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem' 
    },

    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  })