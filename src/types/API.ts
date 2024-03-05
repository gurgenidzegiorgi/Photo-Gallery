import axios from "axios";
import { BaseContextType } from "./Types";

const fetchPhotos = async (
	query: string,
	pageNumber: number,
	context: BaseContextType
) => {
	const { IMAGE_PER_PAGE, BASE_URL } = context;
	const { data } = await axios.get(`${BASE_URL}/search/photos`, {
		params: {
			query: query,
			page: pageNumber,
			per_page: IMAGE_PER_PAGE,
			client_id: import.meta.env.VITE_API_KEY,
		},
	});
	return data;
};

export default fetchPhotos;
