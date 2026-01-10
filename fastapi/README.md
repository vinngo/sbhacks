# Initializing FastAPI backend + MCP Server

## Step 0: Create a venv

```

# in the terminal under: /fastapi

python -m venv sbhacksvenv

# or if ur on mac

python3 -m venv sbhacksvenv
```

### then activate ur venv

```
source sbhacksvenv/bin/activate
```


## Step 1: Install our dependencies
```

#still in the temrinal under /fastapi


pip install -r requirements.txt

or if ur on mac

pip3 install -r requirements.txt
```

## Step 2: Dev

### starting FastAPI
```
Starting fastapi:
uvicorn main:app --reload


```


### initializing GCAL MCP


```
  # in the terminal under /google-calendar-mcp
  
  npm install
  
  npm run build

```

create an env file based on .env.example

```
  cp .env.example .env
  
  TRANSPORT=http
  PORT=4000
  HOST=127.0.0.1
  GOOGLE_OAUTH_CREDENTIALS=./gcp-oauth.keys.json
```

create a gcp-oauth.keys.json file

```
cp gcp-oauth.keys.example.json gcp-oauth.keys.json
```

ask me (vincent) for the contents of the gcp-oauth.keys.json file

authenticate and log in using ur google account
```
npm run auth
```

run the mcp server in the background whenever u want the agent to call the tools

```
node build/index.js --transport http --port 8080
```

listens on port 8080 so you would want to configure our langchain agent to connect to something like localhost:8080
