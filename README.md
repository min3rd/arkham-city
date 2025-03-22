
# Arkham City (Firebase Alternative Open-Source)
*The baddest city will be leaded by the modernest technology*

## Mindset design
![alt](/docs/images/Main%20Structure.drawio.png)

## Project structure

```
arkham-city
|-- arkham-city-core (All API come from here)
  |-- gateway (API endpoint)
  |-- microservice (message broker subscriber)
  |-- modules (all services)
|-- arkham-city-dashboard (Dashboard web application base on angular 19)
(still on working)
```

## Arkham City Core

Place
```bash
cd arkham-city

# run redis and mongo
docker compose -f docker-compose-dev.yml

cd arkham-city/arkham-city-core
```

Development enviroment
```
Nodejs >= 18
Docker
```

Setup
```bash
npm i
```

Before start develope

```bash
# create .env
cp .env.example .env
```

Compile and run the project
```bash
# development
npm run start

# hot reload
npm run start:dev

# debug
npm run start:debug

# run on production mode
npm run start:production
```

Run tests
```bash
npm run test
```

API handle flow

![alt](/docs/images/Main%20Structure-API%20handle.drawio.png)

Notice:
- We use response interceptor to format all response to template, so we no need do format in service or controller, just focus into bussiness process
    ```json
    {
        "error": false,
        "timestamp": "2025-03-16T08:29:22.730Z",
        "data" : {}
    }
    ```
- It may be hard to understand how microservice working, but we can simplize that: we have more than 1 microservice which subscribe message "A", when a service call help by message "A" then 1 of which subscribed can do process and return the output. Just imagine, that will make sence when our system become bigger than google, and that is the way we can deploy our system.

## Arkham City Dashboard (on working)

Figma design

```link
https://www.figma.com/design/nA2SZouWXs0g1S9FvQCU4O/Arkham-City-Dashboard?node-id=220802-40276&t=jVRWiCPA0gHjynXk-1
```

## Author
1. Vũ Văn Minh [Github](https://github.com/min3rd) [Facebook](https://fb.com/min3rd)
