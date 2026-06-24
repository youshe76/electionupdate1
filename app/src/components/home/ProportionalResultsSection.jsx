import { Link } from "react-router-dom";

const TOTAL_VOTES = "१,०८,३५,०२५";

const parties = [
	{
		slug: "rastriya-swatantra-party",
		name: "राष्ट्रिय स्वतन्त्र पार्टी",
		image: "/assets/images/rsp_AiC1qh2xlI.jpg",
		percent: "४७.८४",
		votes: "५१,८३,४९३",
	},
	{
		slug: "nepali-congress",
		name: "नेपाली कांग्रेस",
		image: "/assets/images/congress-logo_zVeY3un3Hj.jpg",
		percent: "१६.२४",
		votes: "१७,५९,१७२",
	},
	{
		slug: "cpn-uml",
		name: "नेकपा (एमाले)",
		image: "/assets/images/uml-1_zfT0bMAJFO.jpg",
		percent: "१३.४४",
		votes: "१४,५५,८८५",
	},
	{
		slug: "nepali-communist-party",
		name: "नेपाली कम्युनिष्ट पार्टी",
		image: "/assets/images/nepali-communist_uVwmNizOSk.jpg",
		percent: "७.४९",
		votes: "८,११,५७७",
	},
	{
		slug: "shram-samskriti-party",
		name: "श्रम संस्कृति पार्टी",
		image: "/assets/images/shram-sanskriti-party_jrxdNsjzjb.jpg",
		percent: "३.५६",
		votes: "३,८५,९०२",
	},
	{
		slug: "rastriya-prajatantra-party",
		name: "राष्ट्रिय प्रजातन्त्र पार्टी",
		image: "/assets/images/raprapa_RPVSZDsBPg.jpg",
		percent: "३.०५",
		votes: "३,३०,६८४",
	},
];

export default function ProportionalResultsSection() {
	return (
		<section className="section section-samaupatik-result">
			<Link
				className="btn"
				to="/parties"
				target="_blank"
				rel="noopener noreferrer"
				style={{ left: "78.5%" }}
			>
				विस्तृत
			</Link>
			<div className="elc-container">
				<div className="flex">
					<div className="samaupatik-result-heading">
						<span className="title">समानुपातिक मतगणना</span>
						<p>कुल मत: {TOTAL_VOTES}</p>
					</div>
					<div className="samaupatik-parties-result">
						<div className="dn-grid dn-grid-small">
							{parties.map((party) => (
								<div
									key={party.slug}
									className="col2"
								>
									<div className="candidate famous-party">
										<Link to={`/party/${party.slug}`} target="_blank" rel="noopener noreferrer">
											<div className="profile">
												<img
													src={party.image}
													alt={party.name}
												/>
											</div>
											<span>{party.name}</span>
										</Link>
										<div>
											<div className="flex flex-middle">
												<h3> प्रतिशतमा:</h3>
												<span> {party.percent}%</span>
											</div>
											<div div className="flex flex-middle">
												<h3> कुल मत:</h3>
												<span className="value">{party.votes}</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
						<div
							className="text--right"
							style={{ marginTop: "12px" }}
						></div>
					</div>
				</div>
			</div>
		</section>
	);
}
