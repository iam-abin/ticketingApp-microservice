import Link from "next/link";

// currentUser will be provided in every page from _app.js
export default ({ currentUser }) => {
	// here Sign Up,Sign In label will display only if currentUser is null
	// array looks like [{label:'Sign Up',href: '/auth/signup'},{label:'Sign In',href: '/auth/signin'},false]
	// if currentUser is not null Sign Out will display
	// array looks like [false,false,{label:'Sign Out',href: '/auth/signout'}]
	const links = [
		!currentUser && { label: "Sign Up", href: "/auth/signup" },
		!currentUser && { label: "Sign In", href: "/auth/signin" },
		currentUser && { label: "Sell Tickets", href: "/tickets/new" },
		currentUser && { label: "My Orders", href: "/orders" },
		currentUser && { label: "Sign Out", href: "/auth/signout" },
	]
		.filter((linkConfig) => linkConfig) // filter out false and return only true
		.map(({ label, href }) => {
			return (
				<li key={href} className="nav-item">
					<Link className="nav-link" href={href}>
						{label}
					</Link>
				</li>
			);
		});

	return (
		<nav className="navbar navbar-light bg-light">
			<Link className="navbar-brand" href="/">
				GitTix
			</Link>

			<div className="d-flex justify-content-end">
				<ul className="nav d-flex aligh-items-center">{links}</ul>
			</div>
		</nav>
	);
};
