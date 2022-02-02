import axios from "axios";
import {
	ACCESS_KEY_ID,
	SECRET_ACCESS_KEY,
	CHAIN_ID,
} from "../config"

export const uploadMetaData = async (name, description, imageUrl) => {

  const metadata = {
    metadata: {
      name,
      description,
      image:imageUrl
    }
  }

  const option = {
    headers: {
      Authorization:  "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
      "x-chain-id" : CHAIN_ID,
      "content-type" : "application/json"
    }
  }

  try {
    const response = await axios.post('https://metadata-api.klaytnapi.com/v1/metadata', metadata, option)
    console.log(JSON.stringify(response.data))
    return response.data.uri
  } catch (error) {
    console.log(error)
    return false
  }
}