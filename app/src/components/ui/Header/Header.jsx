import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
	const [nepaliTime, setNepaliTime] = useState("लोड हुँदैछ...");

	useEffect(() => {
		const nepaliDays = [
			"आइतवार",
			"सोमवार",
			"मंगलवार",
			"बुधवार",
			"बिहिवार",
			"शुक्रवार",
			"शनिवार",
		];

		const nepaliMonths = [
			"बैशाख",
			"जेठ",
			"असार",
			"श्रावण",
			"भदौ",
			"असोज",
			"कार्तिक",
			"मंसिर",
			"पौष",
			"माघ",
			"फाल्गुण",
			"चैत्र",
		];

		const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

		const toNepaliNumber = (num) =>
			num
				.toString()
				.split("")
				.map((d) => nepaliDigits[d] ?? d)
				.join("");

		const referenceAD = new Date("2025-04-14T00:00:00+05:45");

		const referenceBS = {
			year: 2082,
			month: 1,
			day: 1,
		};

		const bsMonthDays = [31, 32, 31, 32, 31, 30, 30, 29, 29, 29, 30, 30];

		const convertToBS = (date) => {
			const nstOffset = 5.75 * 60 * 60 * 1000;
			const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
			const nstTime = utcTime + nstOffset;

			const referenceNST = referenceAD.getTime();

			let diffDays = Math.floor((nstTime - referenceNST) / (1000 * 60 * 60 * 24));

			let year = referenceBS.year;
			let month = referenceBS.month;
			let day = referenceBS.day;

			while (diffDays !== 0) {
				if (diffDays > 0) {
					day++;

					if (day > bsMonthDays[month - 1]) {
						day = 1;
						month++;

						if (month > 12) {
							month = 1;
							year++;
						}
					}

					diffDays--;
				} else {
					day--;

					if (day < 1) {
						month--;

						if (month < 1) {
							month = 12;
							year--;
						}

						day = bsMonthDays[month - 1];
					}

					diffDays++;
				}
			}

			return { year, month, day };
		};

		const updateNepaliTime = () => {
			const now = new Date();

			const nstOffset = 5.75 * 60 * 60 * 1000;
			const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
			const nstTime = new Date(utcTime + nstOffset);

			const hour = nstTime.getHours();
			const minutes = nstTime.getMinutes();
			const seconds = nstTime.getSeconds();

			const bs = convertToBS(now);

			const amPm = hour < 12 ? "पूर्वाह्न" : "अपराह्न";

			setNepaliTime(
				`नेपाली समय ${toNepaliNumber(
					String(hour).padStart(2, "0"),
				)}:${toNepaliNumber(String(minutes).padStart(2, "0"))}:${toNepaliNumber(
					String(seconds).padStart(2, "0"),
				)} ${amPm}   ${toNepaliNumber(bs.year)} ${
					nepaliMonths[bs.month - 1]
				} ${toNepaliNumber(bs.day)} ${nepaliDays[nstTime.getDay()]}`,
			);
		};

		updateNepaliTime();
		const interval = setInterval(updateNepaliTime, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			style={{
				backgroundColor: "#08a222",
				height: "170px",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0 20px",
				boxSizing: "border-box",
			}}
		>
			{/* LEFT */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "20px",
					width: "30%",
				}}
			>
				<img
					src="/gif/ओमकार.gif"
					alt=""
					style={{
						height: "120px",
						width: "auto",
					}}
				/>

				<div>
					<img
						src="/gif/स्वागत छ.gif"
						alt=""
						style={{
							height: "55px",
							marginBottom: "10px",
						}}
					/>

					<div
						style={{
							fontSize: "24px",
							fontWeight: "600",
							color: "#000",
							lineHeight: "1.2",
						}}
					>
						JOIN WITH US
					</div>

					<div
						style={{
							fontSize: "24px",
							color: "#000",
							lineHeight: "1.2",
						}}
					>
						(जोइन्ट विथ अस)
					</div>
				</div>
			</div>

			{/* CENTER */}
			<div
				style={{
					width: "40%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "15px",
				}}
			>
				<img
					src="/images/khaiKHo.png"
					alt=""
					style={{
						height: "140px",
						width: "auto",
					}}
				/>

				<img
					src="/gif/Flag.gif"
					alt=""
					style={{
						height: "90px",
						width: "auto",
					}}
				/>

				<img
					src="/images/लोगो.png"
					alt=""
					style={{
						height: "90px",
						width: "auto",
					}}
				/>

				<img
					src="/gif/Flag.gif"
					alt=""
					style={{
						height: "90px",
						width: "auto",
						transform: "scaleX(-1)",
					}}
				/>

				<img
					src="/images/khaiKHo.png"
					alt=""
					style={{
						height: "140px",
						width: "auto",
					}}
				/>
			</div>

			{/* RIGHT */}
			<div
				style={{
					width: "30%",
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<div
					style={{
						backgroundColor: "#2563eb",
						color: "#fff",
						borderRadius: "8px",
						width: "340px",
						padding: "10px",
						textAlign: "center",
						boxSizing: "border-box",
					}}
				>
					<h2
						style={{
							margin: "0 0 10px",
							fontSize: "18px",
							fontWeight: "bold",
						}}
					>
						Transaction Hour:
					</h2>

					<p
						style={{
							margin: "0 0 8px",
							fontSize: "14px",
						}}
					>
						10:00 AM to 3:00 PM (Sun To Thu)
					</p>

					<p
						style={{
							margin: "0 0 15px",
							fontSize: "14px",
						}}
					>
						10:00 AM to 2:00 PM (Fri)
					</p>

					<p
						style={{
							margin: "0",
							fontSize: "14px",
						}}
					>
						{nepaliTime}
					</p>

					<h1
						style={{
							margin: "10px 0 0",
							fontSize: "18px",
							fontWeight: "bold",
							cursor: "pointer",
						}}
					>
						Membership Form
					</h1>
				</div>
			</div>
		</div>
	);
};

export default Header;
