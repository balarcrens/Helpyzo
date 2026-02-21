import Footer from './Footer'

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="grow">
				{children}
			</main>
			<Footer />
		</div>
	)
}

export default Layout