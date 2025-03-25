import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";

async function main() {
	const selector = "#root";
	const target = document.querySelector(selector);
	if (!target) throw new Error(`Could not found: ${selector}`);

	return ReactDOM.createRoot(target).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}

main();
