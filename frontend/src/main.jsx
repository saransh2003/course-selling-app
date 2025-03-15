import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51R2rTCENW4dxQH6IXShk2NMlPFHz7bFxcPUofNS9zbQW9giohftTHJ450Sq5dLI9IUN0eyGi9XCRIJsGhOXVUrbf00UZWX7vm4");

createRoot(document.getElementById("root")).render(
	<Elements stripe={stripePromise}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Elements>
);
