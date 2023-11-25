<p align="center">
  <a href="https://t4stack.com" target="_blank" rel="noopener noreferrer">
    <picture>
      <img src="https://github.com/kenny101/Fetch-FE-Take-Home/assets/53395124/5c8c8e61-ff9b-47b5-81ad-7450ef54189d" width="500" alt="Image of dog">
    </picture>
  </a>
</p>

<h1 align="center">
    Fetch Frontend Take-Home Exercise: Taking it Full-Stack 🚀 
</h1>

## Development Setup:
Install dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm install
npm run dev
```

Although it was not required, a database has been integrated to this excercise making this a full-stack app! 🚀 This would allow us to save our favorite dogs per login session. Each unique name and email will reference their own saved favorite dogs.

Lets start with the environment variables. First rename `.example.env` to `.env`.

Since we are using JWT for authenticating the user's queries to the database, we generate our own JWT secret. With node installed, run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and save this output to the .env variable `SECRET_JWT_SECRET`

For deploying the production database, we are using <a href="https://turso.tech/">Turso</a> which uses libSQL (a fork of SQLite) under the hood. For development purposes, you can ignore the SECRET_DB_AUTH_TOKEN since it is only used in production.

To run the database locally, first <a>install turso</a> on MacOS/WSL/Linux

```bash
brew install tursodatabase/tap/turso

# or if you don't have brew installed
curl -sSfL https://get.tur.so/install.sh | bash
```

Next install the libSQL from the <a href="https://github.com/libsql/sqld/releases/tag/v0.21.9">releases page</a>. You can use the installation script to install libSQL. After, installing take note of the installation path and add it to your environment variables.

```bash
curl -fsSL https://github.com/libsql/sqld/releases/download/v0.21.9/sqld-installer.sh -o sqld-installer.sh
chmod +x sqld-installer.sh
./sqld-installer.sh

# NOTE: your path might be different. This was the default path on linux for me.
echo 'export PATH="$PATH:/home/kenny/.cargo/bin"' >> ~/.bashrc
```

To check if you installed the db correctly, restart your terminal and run `turso --version` and `sqld --version`.

Run `turso dev` to start the database. The default port is `:8080` so set `SECRET_DB_URL=http://127.0.0.1:8080` in your `.env` file.

To interact with our database we are using <a href="https://orm.drizzle.team/">Drizzle ORM</a> which allows us to interact with our database using TypeScript. Run the npm commands to generate the schema and perform migrations to your database. Convienently, Drizzle comes with a user interface to display and interact with your SQL data.

```bash
npm run generate
npm run migrate
npm run studio # (Optional) Starts the database UI on port :3333
```

![Drizzle Studio UI](https://github.com/kenny101/Fetch-FE-Take-Home/assets/53395124/598e1871-d8ed-4a91-acc3-e0c7c1817554)








