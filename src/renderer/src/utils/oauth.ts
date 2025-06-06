import { SILICON_CLIENT_ID, TOKENFLUX_HOST } from '@renderer/config/constant'
import i18n, { getLanguageCode } from '@renderer/i18n'

export const oauthWithSiliconFlow = async (setKey) => {
  const authUrl = `https://account.siliconflow.cn/oauth?client_id=${SILICON_CLIENT_ID}`

  const popup = window.open(
    authUrl,
    'oauth',
    'width=720,height=720,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,alwaysOnTop=yes,alwaysRaised=yes'
  )

  const messageHandler = (event) => {
    if (event.data.length > 0 && event.data[0]['secretKey'] !== undefined) {
      setKey(event.data[0]['secretKey'])
      popup?.close()
      window.removeEventListener('message', messageHandler)
    }
  }

  window.removeEventListener('message', messageHandler)
  window.addEventListener('message', messageHandler)
}

export const oauthWithAihubmix = async (setKey) => {
  const authUrl = ` https://aihubmix.com/token?client_id=cherry_studio_oauth&lang=${getLanguageCode()}&aff=SJyh`

  const popup = window.open(
    authUrl,
    'oauth',
    'width=720,height=720,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,alwaysOnTop=yes,alwaysRaised=yes'
  )

  const messageHandler = async (event) => {
    const data = event.data

    if (data && data.key === 'cherry_studio_oauth_callback') {
      const { iv, encryptedData } = data.data

      try {
        const secret = import.meta.env.RENDERER_VITE_AIHUBMIX_SECRET || ''
        const decryptedData: any = await window.api.aes.decrypt(encryptedData, iv, secret)
        const { api_keys } = JSON.parse(decryptedData)
        if (api_keys && api_keys.length > 0) {
          setKey(api_keys[0].value)
          popup?.close()
          window.removeEventListener('message', messageHandler)
        }
      } catch (error) {
        console.error('[oauthWithAihubmix] error', error)
        popup?.close()
        window.message.error(i18n.t('oauth.error'))
      }
    }
  }

  window.removeEventListener('message', messageHandler)
  window.addEventListener('message', messageHandler)
}

export const oauthWithTokenFlux = async () => {
  const callbackUrl = `${TOKENFLUX_HOST}/auth/callback?redirect_to=/dashboard/api-keys`
  const resp = await fetch(`${TOKENFLUX_HOST}/api/auth/auth-url?type=login&callback=${callbackUrl}`, {})
  if (!resp.ok) {
    window.message.error(i18n.t('oauth.error'))
    return
  }
  const data = await resp.json()
  const authUrl = data.data.url
  window.open(
    authUrl,
    'oauth',
    'width=720,height=720,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,alwaysOnTop=yes,alwaysRaised=yes'
  )
}

export const providerCharge = async (provider: string) => {
  const chargeUrlMap = {
    silicon: {
      url: 'https://cloud.siliconflow.cn/expensebill',
      width: 900,
      height: 700
    },
    aihubmix: {
      url: `https://aihubmix.com/topup?client_id=cherry_studio_oauth&lang=${getLanguageCode()}&aff=SJyh`,
      width: 720,
      height: 900
    },
    tokenflux: {
      url: `https://tokenflux.ai/dashboard/billing`,
      width: 900,
      height: 700
    }
  }

  const { url, width, height } = chargeUrlMap[provider]

  window.open(
    url,
    'oauth',
    `width=${width},height=${height},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,alwaysOnTop=yes,alwaysRaised=yes`
  )
}

export const providerBills = async (provider: string) => {
  const billsUrlMap = {
    silicon: {
      url: 'https://cloud.siliconflow.cn/bills',
      width: 900,
      height: 700
    },
    aihubmix: {
      url: `https://aihubmix.com/statistics?client_id=cherry_studio_oauth&lang=${getLanguageCode()}&aff=SJyh`,
      width: 900,
      height: 700
    },
    tokenflux: {
      url: `https://tokenflux.ai/dashboard/billing`,
      width: 900,
      height: 700
    }
  }

  const { url, width, height } = billsUrlMap[provider]

  window.open(
    url,
    'oauth',
    `width=${width},height=${height},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,alwaysOnTop=yes,alwaysRaised=yes`
  )
}
