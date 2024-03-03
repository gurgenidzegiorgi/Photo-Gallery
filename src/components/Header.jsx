import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const HeaderComp = styled.header`
	ul {
		display: flex;
		gap: 5rem;
		align-items: center;
		list-style: none;

		li a {
			font-size: 5rem;
			text-decoration: none;
			color: olive;
		}
	}
`;

function Header() {
	const navigate = useNavigate();
	return (
		<HeaderComp>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link onClick={() => navigate("/history")}>Histroy</Link>
					</li>
				</ul>
			</nav>
		</HeaderComp>
	);
}

export default Header;
