import express from 'express'
const app = express()
const port = process.env.Port
import mongodb, { MongoClient, ObjectId } from 'mongodb'
const url = process.env.MONGODB_URL;
app.use(express.json())

const client = new MongoClient(url);
let dbName = 'moviesDB'
let db
const connectToDB =  async () => {
    try {
      await client.connect();
      db = client.db(dbName)
      console.log("Database connected");
      
    } catch (error) {
      console.log('Could not connect to the database', error);
    }     
  }
  
  connectToDB();

  app.post('/movies/add-movies', async (req, res)=>{
    try {
        const movie =  req.body
        const result = await db.collection('movies').insertMany(movie)
        if(!result){
            res.status(500).json({message : 'movie not add'})
        }
        res.status(201).json({message:'movie add'})
    } catch (error) {
        console.log(error);
        
        res.status(500).send('cannot add a movie')
    }
  })

  app.get('/movies', async (req, res)=>{
    try {
        const result = await db.collection('movies').find().toArray()
        if(!result){
            res.status(500).json({message : 'No movies found'})
        }
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
         res.status(500).send('cannot get a movie') 
    }
  })

  app.get('/oneMovies/:id', async (req, res)=>{
      try {
        const id =  req.params.id
        const result = await db.collection('movies').findOne({_id:new ObjectId(id)})
        if(!result){
            res.status(500).json({message : 'No movies found'})
        }
        res.status(200).json(result)
        
    } catch (error) {
        console.log(error);
        res.status(500).json('cannot get a movie') 
    }
  })


  app.get('/Movies/:title', async (req, res)=>{
    try {
      const {title} =  req.params
      const result = await db.collection('movies').findOne({title})
      if(!result){
          res.status(500).json({message : 'No movies found'})
      }
      res.status(200).json(result)
      
  } catch (error) {
      console.log(error);
      res.status(500).json('cannot get a movie') 
  }
})
app.put('/upmovies/:id', async (req, res)=>{
    
    try {
        const {id} =  req.params
        const newMovies = req.body
        const result = await db.collection('movies').updateOne({_id:new ObjectId(id)},
            {$set:newMovies}
        )
        if(!result.matchedCount === 0){
            res.status(500).json({message : 'No movies found'})
        }
        res.status(200).json(result)
        
        
    } catch (error) {
        console.log(error);
        
    }
})

app.delete('/deletemovies/:id', async (req, res)=>{
    try {
        const {id} =  req.params
        const result = await db.collection('movies').deleteOne({_id:new ObjectId(id)})
        if(result.deletedCount ===0){
            return res.status(500).json({message : 'No movies found'})
        }
        return res.status(200).json({ message: 'Movie deleted successfully', result });
}catch(error){
    console.log(error);
}
})






app.listen (port, () => {
    console.log(`Server running on port ${port}`);
})