const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-33302-firebase-adminsdk-pu2hl-1fa93a6cc6.json')
const databaseURL = 'https://fcm-33302.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-33302/messages:send'
const deviceToken =
  'ddpELs0SqN_kkNpdNZsQ35:APA91bET5VwI4rMd0RnDJcdRVTmy1bDgWNSuEwxxHtxcFJ-cwzE-cY9gLuMEkevIgWinpXcJQUrak4BPYyU_4uxiAtOVDocFPRazukZxWtRRgX6N3Jpy9mEm4f5P1MO7yPaQj3aMRw9J'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()
