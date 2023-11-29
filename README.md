<p align="center">
    <picture>
      <img src="https://github.com/kenny101/Fetch-FE-Take-Home/assets/53395124/8367efff-79be-4040-9485-bec7d12033e7" width="500" alt="Image of dog">
    </picture>
</p>

<h1 align="center">
    Fetch Frontend Take-Home Exercise: Taking it Full-Stack 🚀 
</h1>

<h2 align="center">
    <a href="https://www.youtube.com/watch?v=SpvaOiun9jc" target="_blank" rel="noopener noreferrer"> ✨ YouTube Video Demo ✨</a> 
    
</h2>

## Development Setup: 💻

Install dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm install
npm run dev
```

A database has been integrated to this excercise making this a full-stack app! 🚀 This would allow us to save our favorite dogs per login session. Each pair of unique name and email will reference their own saved favorite dogs.

Lets start with the environment variables. First rename `.example.env` to `.env`.

Since we are using JWT for authenticating the user's queries to our own database, we generate our own JWT secret. With node installed, run the command below and save this output to the .env variable `SECRET_JWT_SECRET`

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

For deploying the production database, I used [Turso](https://turso.tech/) which uses [libSQL](https://github.com/tursodatabase/libsql) (a fork of SQLite) under the hood.

For development purposes, you can ignore the `SECRET_DB_AUTH_TOKEN` since it is only used in the production database with Turso.

To run the database locally, install the libSQL from their [releases page](https://github.com/libsql/sqld/releases/tag/v0.21.9). You can use the installation script to install libSQL below. After installing, take note of the installation path and add it to your `PATH` environment variables. (MacOs/Linux/WSL only)

```bash
curl -fsSL https://github.com/libsql/sqld/releases/download/v0.21.9/sqld-installer.sh -o sqld-installer.sh
sudo chmod +x sqld-installer.sh
./sqld-installer.sh

# NOTE: your path might be different
echo 'export PATH="$PATH:/home/kenny/.cargo/bin"' >> ~/.bashrc

# OR: You can also install with brew
brew tap libsql/sqld
brew install sqld-beta
```

To check if you installed the db correctly, restart your terminal and run `sqld --version`.

Run `sqld -d ./tmp/data.db --http-listen-addr=127.0.0.1:8080` to start the database. This will store your data locally in `./tmp/data.db`. Set `SECRET_DB_URL=http://127.0.0.1:8080` in your `.env` file.

To interact with our database we are using <a href="https://orm.drizzle.team/">Drizzle ORM</a> which allows us to make type-safe calls to our database using TypeScript. (You can think of this as a TypeScript wrapper for SQL as it outputs SQL files which you can see in the `drizzle/migrations` folder). Run the npm commands to generate the schema and perform migrations to your database. Convienently, Drizzle comes with a user interface to display and interact with your SQL data.

```bash
npm run generate
npm run migrate
npm run studio # (Optional) Starts the database UI on port :3333
```

![Drizzle Studio UI](https://github.com/kenny101/Fetch-FE-Take-Home/assets/53395124/598e1871-d8ed-4a91-acc3-e0c7c1817554)

## ✨ The Tech Behind the Stack ✨

### 🔮 Frontend

- 🔗 [SvelteKit](https://kit.svelte.dev/)
- 🎨 [Skeleton UI](https://www.skeleton.dev/) + [TailwindCSS](https://tailwindcss.com/)
- 🐕 [Dog Pic Source Attribution: Created by Lum3n](https://www.pexels.com/photo/closeup-photo-of-brown-and-black-dog-face-406014/)

### ⚙️ Backend / Infrastructure

- 🔺 [Vercel](https://vercel.com/)
- 📁 [libSQL](https://github.com/tursodatabase/libsql)
- 🗄️ [Drizzle ORM](https://orm.drizzle.team)

## Running Unit Tests 🧰

Tests can be ran with `npm run test`. By default, SvelteKit comes with `Vitest` and `Playwright` used for unit testing. See `index.test.ts` and `tests` directory for testing.
