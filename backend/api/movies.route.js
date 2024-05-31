import express from 'express'
import MoviesController from './movies.controller.js'

const router = express.Router()

//router.route('/').get((req, res) => res.send('hello world'))

router.route('/').get(MoviesController.apiGetMovies);
router.route("/id/:id").get(MoviesController.apiGetMovieById)
router.route("/ratings").get(MoviesController.apiGetRatings);

export default router