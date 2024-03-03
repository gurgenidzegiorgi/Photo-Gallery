/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLoaderData } from "react-router-dom";
import { styled } from "styled-components";

import removeIcon from "../assets/images/remove-icon.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { PhotosType } from "../types/Types";
import axios from "axios";

const GalleryDiv = styled.div`
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(4, 300px);
	grid-template-rows: repeat(5, 300px);

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const InputDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 3rem;

	h1 {
		font-size: 5rem;
		color: olive;
	}
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

function Home() {
	const data = useLoaderData() as PhotosType[];
	const [photoGallery, setPhotoGallery] = useState<PhotosType[]>([]);
	const [uniquePhotoIds, setUniquePhotoIds] = useState<Set<string>>(new Set());
	const [query, setQuery] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
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
						console.log("setter", pageNumber);
						return prevPage + 1;
					});
					console.log("useCallBack", pageNumber, hasMore);
				}
			});
			observer.current.observe(node);
		},
		[loading, hasMore]
	);

	useEffect(() => {
		fetchPhotos();
	}, [pageNumber]);

	useEffect(() => {
		const fetchInitialPhotos = async () => {
			const { data } = await axios.get(
				`${BASE_URL}/photos?per_page=20&order_by=popular&client_id=${
					import.meta.env.VITE_API_KEY
				}`
			);
			console.log(data);
			setPhotoGallery(data);
			setLoading(false);
		};
		fetchInitialPhotos();
		setPhotoGallery([]);
	}, []);

	useEffect(() => {
		if (!query) return;
		setLoading(true);
		setPhotoGallery([]);
		fetchPhotos();
	}, [debounceSearch]);

	const fetchPhotos = async () => {
		const { data } = await axios.get(
			`${BASE_URL}/search/photos?query=${query}&page=${pageNumber}&per_page=${IMAGES_PER_PAGE}&client_id=${
				import.meta.env.VITE_API_KEY
			}`
		);
		const newPhotos = data.results.filter(
			(photo: PhotosType) => !uniquePhotoIds.has(photo.id)
		);
		const newPhotoIds = new Set<string>(
			newPhotos.map((photo: PhotosType) => photo.id)
		);

		setUniquePhotoIds((prev) => new Set([...prev, ...newPhotoIds]));
		setPhotoGallery((prev) => [...prev, ...newPhotos]);
		setHasMore(pageNumber < data.total_pages);
		setLoading(false);
		// console.log("fetchPhotos", pageNumber, uniquePhotoIds, photoGallery);
	};

	return (
		<>
			<InputDiv>
				<h1>Image Search</h1>
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
			<GalleryDiv>
				{photoGallery &&
					photoGallery?.map((image: PhotosType) => (
						<img
							key={image?.id}
							src={image?.urls.regular}
							alt={image?.alt_description}
						/>
					))}
			</GalleryDiv>
		</>
	);
}

export default Home;
