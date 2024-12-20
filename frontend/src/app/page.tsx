import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-between min-h-screen  text-white">
			{/* Main Content */}
			<main className="flex flex-col items-center text-center px-4 py-10 w-full flex-grow">
				{/* Logo */}
				<Image
					src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
					alt="RChat logo"
					width={120}
					height={120}
					priority
				/>

				{/* Title */}
				<h1 className="text-4xl sm:text-5xl font-extrabold mt-6 text-white">
					Welcome to <span className="text-purple-500">RChat</span>
				</h1>

				{/* Subtitle */}
				<p className="mt-4 text-lg text-gray-300 sm:text-xl">
					Connect with friends, family, and colleagues instantly.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 mt-8">
					<a
						href="/chat"
						className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 text-sm sm:text-base shadow-lg"
					>
						<Image
							src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png"
							alt="Chat Icon"
							width={20}
							height={20}
						/>
						Start Chatting
					</a>
					<a
						href="/docs"
						className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300 text-sm sm:text-base shadow-lg"
					>
						<Image
							src="https://cdn-icons-png.flaticon.com/512/1251/1251767.png"
							alt="Docs Icon"
							width={20}
							height={20}
						/>
						Read Docs
					</a>
				</div>

				{/* Login and Signup */}
				<div className="flex gap-4 mt-6">
					<a
						href="/signup"
						className="px-6 py-2 border border-blue-500 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 text-sm shadow-sm"
					>
						Signup
					</a>
					<a
						href="/login"
						className="px-6 py-2 border border-gray-500 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300 text-sm shadow-sm"
					>
						Login
					</a>
				</div>
			</main>

			{/* Footer */}
			<footer className="w-full py-4 bg-gray-900 text-gray-400 flex justify-center gap-6 text-sm">
				<a
					href="https://rchat.learn.example.com"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-white transition duration-300"
				>
					Learn
				</a>
				<a
					href="https://rchat.templates.example.com"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-white transition duration-300"
				>
					Examples
				</a>
				<a
					href="https://rchat.example.com"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-white transition duration-300"
				>
					Visit RChat →
				</a>
			</footer>
		</div>
	);
}
