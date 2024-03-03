/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { styled, createGlobalStyle } from "styled-components";
import axios from "axios";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { useDebounce } from "./hooks/useDebounce";
import { PhotosType } from "./types/Types";

import removeIcon from "./assets/images/remove-icon.svg";
import { historyContext } from "./Root";

const BASE_URL = "https://api.unsplash.com";
const IMAGE_PER_PAGE = 20;

const GlobalStyles = createGlobalStyle`
	body {
		height: 100%;
	}
	* {
		font-size: 62.5%;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	:root {
    --rem: 10;
	}


`;
const Container = styled.main`
	height: 100%;
	padding: 5rem 0;
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 5rem;
`;

const InputDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 3rem;

	.input {
		position: relative;
		input {
			width: 50rem;
			padding: 1.5rem 0 1.5rem 1rem;
			border: none;
			border-bottom: 0.1rem solid #000;
			font-size: 2rem;

			&::placeholder {
				font-size: 2rem;
			}

			&:focus-visible {
				outline: none;
			}
		}

		img {
			position: absolute;
			right: 2rem;
			top: 50%;
			transform: translateY(-50%);
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

function App() {
	const context = useContext(historyContext);
	console.log(context);
	const data1 = useLoaderData() as PhotosType[];

	const [photoGallery, setPhotoGallery] = useState<PhotosType[]>(data1);
	const [query, setQuery] = useState("");
	const [pageNumber, setPageNumber] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const debounceSearch = useDebounce(query, 1000);

	const observer = useRef<IntersectionObserver | null>(null);
	const lastImageElement = useCallback(
		(node: HTMLImageElement | null) => {
			if (loading || !hasMore || !node) return;
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
		[loading, hasMore]
	);

	useEffect(() => {
		if (pageNumber !== null) {
			fetchPhotos();
		}
	}, [pageNumber]);

	useEffect(() => {
		if (!query) return;
		setLoading(true);
		setPhotoGallery([]);
		fetchPhotos();
		context.setSearchHistroy((prev) => [...prev, debounceSearch]);
	}, [debounceSearch]);

	const fetchPhotos = async () => {
		const { data } = await axios.get(`${BASE_URL}/search/photos`, {
			params: {
				query: query,
				page: pageNumber,
				per_page: IMAGE_PER_PAGE,
				client_id: import.meta.env.VITE_API_KEY,
			},
		});
		setPhotoGallery((prev) => [...prev, ...data.results]);
		setHasMore(data.total_pages > pageNumber);
		setLoading(false);
	};

	return (
		<Container>
			<Outlet />
			<GlobalStyles />
			<InputDiv>
				<div className="input">
					<input
						type="text"
						placeholder="Search..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<img src={removeIcon} onClick={() => setQuery("")} alt="X icon" />
				</div>
			</InputDiv>
			{!loading ? (
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
			) : (
				<p style={{ fontSize: "2rem" }}>Loading...</p>
			)}
		</Container>
	);
}

export default App;
