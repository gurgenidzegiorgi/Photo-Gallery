/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { PhotosType } from "../types/Types";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { historyContext } from "../Root";
import axios from "axios";

const HistoryDiv = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	margin-bottom: 5rem;
	h1 {
		font-size: 5rem;
		margin-bottom: 1rem;
	}

	div {
		display: flex;
		justify-content: center;
		gap: 1rem;

		p {
			font-size: 2rem;
			cursor: pointer;
		}
	}
`;

const GalleryDiv = styled.div`
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(5, 1fr);

	img {
		width: 300px;
		height: 300px;
		object-fit: cover;
	}
`;
const BASE_URL = "https://api.unsplash.com";

const History = () => {
	const [photoGallery, setPhotoGallery] = useState<PhotosType[]>([]);
	const [pageNumber, setPageNumber] = useState<number | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [query, setQuery] = useState("");

	const context = useContext(historyContext);

	const observer = useRef<IntersectionObserver | null>(null);
	const lastImageElement = useCallback(
		(node: HTMLImageElement | null) => {
			if (!hasMore || !node) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setPageNumber((prevPage) => {
						return prevPage + 1;
					});
				}
			});
			observer.current.observe(node);
		},
		[hasMore]
	);

	useEffect(() => {
		if (pageNumber !== null) {
			fetchPhotos(query);
		}
	}, [pageNumber]);

	const fetchPhotos = async (query) => {
		const { data } = await axios.get(`${BASE_URL}/search/photos`, {
			params: {
				query: query,
				page: pageNumber,
				per_page: 20,
				client_id: import.meta.env.VITE_API_KEY,
			},
		});
		setPhotoGallery((prev) => [...prev, ...data.results]);
		setHasMore(data.total_pages > pageNumber);
	};

	return (
		<main>
			<HistoryDiv>
				<h1>Search History</h1>
				<div>
					{context?.searchHistory.map((historyQuery) => (
						<p
							key={historyQuery}
							onClick={() => {
								setQuery(historyQuery);
								fetchPhotos(historyQuery);
							}}
						>
							{historyQuery}
						</p>
					))}
				</div>
			</HistoryDiv>
			{
				<GalleryDiv>
					{photoGallery &&
						photoGallery?.map((image: PhotosType | undefined, index) => {
							if (index === photoGallery.length - 1) {
								return (
									<img
										ref={lastImageElement}
										key={image.id}
										src={image.urls.regular}
										alt={image.alt_description}
									/>
								);
							} else {
								return (
									<Link to={`/${image.id}`} key={image.id}>
										<img src={image.urls.regular} alt={image.alt_description} />
									</Link>
								);
							}
						})}
				</GalleryDiv>
			}
		</main>
	);
};

export default History;
