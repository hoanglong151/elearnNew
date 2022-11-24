import React from 'react';
import ReactDOM from 'react-dom';
const Footer = () => {
	return (
		<>
			<a href={'#'} id="scroll-to-top">
				<i className="material-icons">keyboard_arrow_up</i>
			</a>
			<footer className="footer">
				<div>
					<span>
						© Global Elearn <span id="js-current-year" />
					</span>
				</div>
				<div>
					{/* <nav className="nav">
						<a href="https://mona.media" className="nav-link">
							Terms of use
						</a>
						<a href="https://mona.media" className="nav-link">
							Privacy Policy
						</a>
						<a href="https://mona.media" className="nav-link">
							License
						</a>
					</nav> */}
				</div>
			</footer>
		</>
	);
};
// const domContainer = document.getElementById('footer');
// if (domContainer) ReactDOM.render(<Footer />, domContainer);
export default Footer;
