import { cleanEnv, str, port } from 'envalid'

//this will return the environment variables as an json object
export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port()
})
