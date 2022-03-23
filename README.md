# NFT market BApp

LikeLion NFT Market BApp Project

<br />

## 🎉 Get Started
#### 1. src 폴더에 `config` 폴더 생성 후 config.cypress.js 파일 생성
메인넷 네트워크 연결 후 진행

```js
export const NFT_CONTRACT_ADDRESS = "" // modifiedKIP17Token 컨트랙트 배포 주소
export const MARKET_CONTRACT_ADDRESS = "" // NFTMarket 컨트랙트 배포 주소
export const ACCESS_KEY_ID = "" // KAS API ACCESS_KEY_ID
export const SECRET_ACCESS_KEY = "" // KAS API SECRET_ACCESS_KEY
export const DEPLOY_ADDRESS_PRIVATE_KEY = "" // 컨트랙트 배포 지갑 private key
export const CHAIN_ID = "8217" 
```
#### 2. NODE 모듈 설치
```
npm install
```

#### 3. App 실행
```
npm start
```

<br />

## 🎨 Features

- Klip 지갑 연동
- KLAY 잔고 조회
- NFT 조회 : 유저 보유 NFT, 마켓 보유 NFT
- NFT 발행
- NFT 판매 : 마켓에 NFT 전송
- NFT 구매

