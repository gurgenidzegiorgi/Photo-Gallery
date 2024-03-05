/* eslint-disable @typescript-eslint/no-unused-vars */
import { styled } from "styled-components";
import { PhotosType } from "../types/Types";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

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
const PhotoGallery = () => {
	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (pageNumber !== null) {
			fetchPhotos();
		}
	}, [pageNumber]);

	return (
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
	);
};

export default PhotoGallery;
