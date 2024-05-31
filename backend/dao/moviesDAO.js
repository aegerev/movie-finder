import mongodb from "mongodb"

const ObjectId = mongodb.ObjectId;

let movies
export default class MoviesDAO{

    static async injectDB(conn) {
        if(movies) {
            return
        }
        try{
            console.log("Getting movies:")
            movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection('movies')
            console.log(movies)
        }
        catch(e) {
            console.error('Unable to connect in MoviesDAO: + ${e}')
            console.error(e);
        }
    }

    //-----------------------------------------
    //filters object might look like:
    //{ title: "dragon", rated: "G" }
    static async getMovies({ //default filter
        filters = null,
        page = 0,
        moviesPerPage = 20,
        } = {}) {
            let query
            if (filters){
                if ("title" in filters) {
                    query = { $text: {$search: filters['title']}
                            }
                } else if ("rated" in filters) {
                    query = { $rated: {$eq: filters['rated']}
                            } 
                }
            }

            let cursor

            try{
                cursor = await movies
                    .find(query)
                    .limit(moviesPerPage)
                    .skip(moviesPerPage * page)
                    
                const moviesList = await cursor.toArray()
                const totalNumMovies = await movies.countDocuments(query)
                return {moviesList, totalNumMovies}
            }
            catch(e) {
                console.error('Unable to issue find command, ${e}')
                console.error(e)
                return {moviesList: [], totalNumMovies: 0}
            }
        }   

        //-------------------------------------
        static async getRatings() {
            let ratings = []
            try {
                ratings = await movies.distinct("rated")
                return ratings

            } catch(e) {
                console.error('unable to get ratings, $(e)')
                return ratings
            }
        }

        //-------------------------------------
        static async getMovieById(id) {
            try {
                return await movies.aggregate([
                    {
                        $match: {
                            _id: new ObjectId(id),
                        }
                    },
                ]).next()

            } catch(e) {
                console.error('error in getMovieById: ${e}')
                throw e
            }
        }

} //class MoviesDAO
//stopped at p.66 of 156 - 45%