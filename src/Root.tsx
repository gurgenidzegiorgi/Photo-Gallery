/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { styled, createGlobalStyle } from "styled-components";

import {
	createBrowserRouter,
	RouterProvider,
	createRoutesFromElements,
	Route,
	Outlet,
} from "react-router-dom";

import History from "./pages/History.tsx";
import ImageModal from "./pages/ImageModal.tsx";
import Header from "./components/Header.jsx";
import App from "./App.tsx";
import { createContext, useState } from "react";

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
	gap: 8rem;
`;

const BASE_URL = "https://api.unsplash.com";
const IMAGE_PER_PAGE = 20;

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route
				path="/"
				element={
					<>
						<Header />
						<App />
					</>
				}
				loader={async () =>
					fetch(
						`${BASE_URL}/photos?per_page=${IMAGE_PER_PAGE}&order_by=popular&client_id=${
							import.meta.env.VITE_API_KEY
						}`
					)
				}
			>
				<Route
					path="/:id"
					element={<ImageModal />}
					loader={async ({ params }) =>
						fetch(
							`${BASE_URL}/photos/${params.id}?client_id=${
								import.meta.env.VITE_API_KEY
							}`
						)
					}
				/>
			</Route>
			<Route
				path="history"
				element={
					<>
						<Header />
						<History />
					</>
				}
			/>
		</Route>
	)
);

type Histroy = {
	searchHistory: string[];
	setSearchHistroy: React.Dispatch<React.SetStateAction<string[]>>;
};

export const historyContext = createContext<Histroy>(null);

const Root = () => {
	const [searchHistory, setSearchHistroy] = useState<string[]>([]);

	return (
		<historyContext.Provider
			value={{
				searchHistory: searchHistory,
				setSearchHistroy: setSearchHistroy,
			}}
		>
			<Container>
				<GlobalStyles />
				<RouterProvider router={router}></RouterProvider>
			</Container>
		</historyContext.Provider>
	);
};

export default Root;
