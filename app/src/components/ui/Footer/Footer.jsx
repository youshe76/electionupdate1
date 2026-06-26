import React from "react";
import "./Footer.css";
import { Mail, Phone, MessageCircle, Globe } from "lucide-react";

const Footer = () => {
	return (
		<>
			<footer className="footer">
				<div className="footer-container">
					<div className="footer-grid">
						{/* Logo */}
						<div className="footer-column">
							<div className="logo-wrapper">
								<img
									src="/images/लोगो.png"
									alt="Logo"
									className="footer-logo"
								/>
							</div>

							<p className="footer-description">
								We will be available 24 hours for yours believable service.
							</p>

							<div className="social-icons">
								<a
									href="mailto:timsinamr91@gmail.com"
									className="social-btn"
								>
									<Mail size={20} />
								</a>

								<a
									href="https://www.facebook.com/nirmala.dhamala.37/"
									target="_blank"
									rel="noreferrer"
									className="social-btn"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M22 12.07C22 6.507 17.523 2 12 2S2 6.507 2 12.07c0 5.017 3.657 9.176 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.52 1.492-3.913 3.777-3.913 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.242 0-1.63.775-1.63 1.57v1.885h2.773l-.443 2.9h-2.33V22c4.78-.754 8.437-4.913 8.437-9.93z" />
									</svg>
								</a>

								<a
									href="tel:+9779862149172"
									className="social-btn"
								>
									<Phone size={20} />
								</a>

								<a
									href="https://wa.me/9862028541"
									target="_blank"
									rel="noreferrer"
									className="social-btn"
								>
									<MessageCircle size={20} />
								</a>

								<a
									href="https://www.youtube.com/@jointwithus"
									target="_blank"
									rel="noreferrer"
									className="social-btn"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M23.5 6.2c-.3-1.2-1.2-2.1-2.4-2.4C19 3.2 12 3.2 12 3.2s-7 0-9.1.6C1.7 4.1.8 5 .5 6.2 0 8.3 0 12 0 12s0 3.7.5 5.8c.3 1.2 1.2 2.1 2.4 2.4 2.1.6 9.1.6 9.1.6s7 0 9.1-.6c1.2-.3 2.1-1.2 2.4-2.4.5-2.1.5-5.8.5-5.8s0-3.7-.5-5.8zM9.6 15.3V8.7l6.2 3.3-6.2 3.3z" />
									</svg>
								</a>
							</div>
						</div>

						{/* Quick Links */}
						<div className="footer-column">
							<h3 className="footer-title">Quick Links</h3>

							<ul className="footer-list">
								<li>
									<a
										href="https://www.youtube.com/@jointwithus"
										target="_blank"
										rel="noreferrer"
									>
										YouTube
									</a>
								</li>

								<li>
									<a href="#">Downloads</a>
								</li>

								<li>
									<a
										href="https://maps.app.goo.gl/sZLM4wGoNRzokkd38"
										target="_blank"
										rel="noreferrer"
									>
										<h2>Location Map</h2>
										<h3>कोशी प्रदेश, सदाबहार मार्ग, Itahari 56705</h3>
										<h3>M78C+4R Itahari</h3>
									</a>	
								</li>
							</ul>

							<div className="video-wrapper">
								<iframe
									src="https://www.youtube.com/embed/XM7DA9goOoc?si=3LN0u2LHbXVs1fvv"
									title="YouTube Video"
									frameBorder="0"
									allowFullScreen
								/>
							</div>
						</div>

						{/* Useful Links */}
						<div className="footer-column">
							<h3 className="footer-title">Useful Links</h3>

							<ul className="footer-list">
								<li>
									<a
										href="https://mahilasaccos.coop.np/"
										target="_blank"
										rel="noreferrer"
									>
										Mahila Saccoss
									</a>
								</li>

								<li>
									<a href="/register">Payment Gateway</a>
								</li>
							</ul>

							<div className="extra-links">
								<p>
									<a
										href="https://itaharimun.gov.np/"
										target="_blank"
										rel="noreferrer"
									>
										इटहरी उप-महानगरपालिका कार्यालय, इटहरी, सुनसरी
									</a>
								</p>

								<p>
									<a
										href="https://see.gov.np/"
										target="_blank"
										rel="noreferrer"
									>
										OFFICE OF THE CONTROLLER OF EXAMINATIONS (SEE), Grade 10
									</a>
								</p>
							</div>

							<div className="video-wrapper">
								<iframe
									src="https://www.youtube.com/embed/zIiOUGZqqk0"
									title="YouTube Video"
									frameBorder="0"
									allowFullScreen
								/>
							</div>
						</div>

						{/* Address */}
						<div className="footer-column">
							<h3 className="footer-title">Address</h3>

							<div className="info-row">
								<i className="fa-solid fa-location-dot"></i>
								<p>
									इटहरी उप-महानगरपालिका, वडा नं. ४ आइतबारे (सदबहार मार्ग), सुनसरी (कोशी
									प्रदेश)
								</p>
							</div>

							<h3 className="footer-title contact-title">Contact Information</h3>

							<div className="info-row">
								<i className="fa-solid fa-phone-volume"></i>
								<p>9862028541, 9842290880, 9862149172</p>
							</div>

							<div className="info-row">
								<i className="fa-solid fa-envelope"></i>
								<p>timsinamr91@gmail.com</p>
							</div>

							<div className="download-app">
								<h2>
									<a
										href="https://www.jointwithus.com.np"
										target="_blank"
										rel="noreferrer"
									>
										Download App
									</a>
								</h2>

								<div className="store-buttons">
									<a
										href="https://www.jointwithus.com.np"
										target="_blank"
										rel="noreferrer"
									>
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
											alt="Google Play"
										/>
									</a>

									<a
										href="https://www.jointwithus.com.np"
										target="_blank"
										rel="noreferrer"
									>
										<img
											src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
											alt="App Store"
										/>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>

			<div className="footer-bottom">
				<div className="footer-bottom-container">
					<div>2025, All Rights Reserved.</div>

					<div className="developer-info">
						Design & Developed by
						<img
							src="/gif/Glove.gif"
							alt=""
							className="glove-icon"
						/>
						<span>JOINT WITH US (जोइन्ट विथ अस) Pvt. Ltd</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default Footer;
