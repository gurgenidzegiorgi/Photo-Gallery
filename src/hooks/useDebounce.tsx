/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";

export const useDebounce = (value: string, delay: number = 500) => {
	const [debounceValue, setDebounceValue] = useState(value);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebounceValue(value);
		}, delay);

		return () => clearTimeout(timeout);
	}, [value, delay]);

	return debounceValue;
};
