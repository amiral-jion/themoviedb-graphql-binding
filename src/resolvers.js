require("babel-polyfill");
import rp from "request-promise"

const BASE_URL = "https://api.themoviedb.org/3/"

const resolvers = {
	Query : {
		searchByName : async (root, {name}, context) => {
			const {results} = await searchByName( name, context.apiKey );
			return results;
		},
		searchByID : (root, {id}, context ) => searchByID( id, context.apiKey ),
		getLatestMovies: (root, {months, page}, context ) => {
			return getLatestMovies(months, page, context.apiKey)
		},
	},
	MovieDetail : {
		videos( root, args ){
			return root.videos.results
		}
	}
};


const searchByName = ( name, apiKey ) => query(`${BASE_URL}search/movie?api_key=${apiKey}&query=${name}`);

const searchByID = ( id, apiKey ) => query(`${BASE_URL}movie/${id}?api_key=${apiKey}&append_to_response=videos`);

const getLatestMovies = (months = 1, page = 1, apiKey) => {
	const today = new Date();
	const otherDate  = subtractMonths(months);
	const url = `${BASE_URL}discover/movie?primary_release_date.gte=${formatDate(otherDate)}&primary_release_date.lte=${formatDate(today)}&api_key=${apiKey}&append_to_response=videos&page=${page}&sort_by=release_date.desc`;
	return  query(url)
};

const query = url => {
	return rp({
		method: 'GET',
		uri: url,
		json: true
	});
};


const formatDate = (date) => `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`

const subtractMonths = (m) => {
	const d = new Date();
	const years = Math.floor(m / 12);
	const months = m - (years * 12);
	if (years) d.setFullYear(d.getFullYear() - years);
	if (months) d.setMonth(d.getMonth() - months);
	return d;
};

export default resolvers;
