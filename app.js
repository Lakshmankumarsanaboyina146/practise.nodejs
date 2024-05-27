const express = require('express')

const app = express()

const path = require('path')

const databasepath = path.join(__dirname, 'cricketTeam.db')

const {open} = require('sqlite')

app.use(express.json())

const sqlite3 = require('sqlite3')

let database = null

const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: databasepath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('server running at http://localhost:3000')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//API 1
app.get('/players/', async (request, response) => {
  const playerQuery = `
    
    SELECT * FROM cricket_team  ORDER BY player_id
    `

  const players = await database.all(playerQuery)

  response.send(players)
})

//API 2

app.post('/players/', async (request, response) => {
  const playerDetails = request.body

  const {player_name, jersey_number, role} = playerDetails

  const addPlayerQuery = `
  INSERT INTO cricket_team
  (
    player_name,
    jersey_number,
    role
  )

  VALUES(
    '${player_name}',
    ${jersey_number},
    '${role}'
  );

  `

  const postAPIResponse = await database.run(addPlayerQuery)

  const playeruniqueId = postAPIResponse.lastID

  response.send('Player Added to Team')
})

//API 3
app.get('/players/:playerId/', async (request, response) => {
  const playerId = request.params

  const playerQuery = `
    
    SELECT * FROM cricket_team  WHERE player_id=${playerId}
    `

  const player = await database.get(playerQuery)

  response.send(player)
})
