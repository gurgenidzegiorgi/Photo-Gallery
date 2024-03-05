/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLoaderData, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { SinglePhoto } from "../types/Types";
import closeBtn from "../assets/images/remove-icon.svg";

const ModalWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 99;

	.img-div {
		position: relative;
		width: 110rem;
		height: 95rem;
		background-color: white;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		.closeBtn {
			position: absolute;
			top: 1rem;
			right: 1rem;
			cursor: pointer;
			background-color: white;
			border-radius: 0.1rem;
		}

		.single-image {
			width: 100%;
			height: 90%;
		}

		.img-info {
			display: flex;
			justify-content: space-between;
			padding: 1rem;

			div {
				display: flex;
				flex-direction: column;
				gap: 1rem;

				h5 {
					color: grey;
					font-size: 3rem;
				}
				p {
					font-size: 2rem;
				}
			}
		}
	}
`;

const ImageModal = () => {
	const data = useLoaderData() as SinglePhoto;
	const navigate = useNavigate();

	const onClose = () => navigate("/");
	return (
		<ModalWrapper>
			<div className="img-div">
				<img
					className="closeBtn"
					src={closeBtn}
					alt="X icon"
					onClick={onClose}
				/>
				<img
					className="single-image"
					src={data.urls.full}
					alt={data.alt_description}
				/>
				<div className="img-info">
					<div>
						<h5>Likes</h5>
						<p>{data.likes}</p>
					</div>
					<div>
						<h5>Downloads</h5>

						<p>{data.downloads}</p>
					</div>
					<div>
						<h5>Views</h5>
						<p>{data.views}</p>
					</div>
				</div>
			</div>
		</ModalWrapper>
	);
};

export default ImageModal;
