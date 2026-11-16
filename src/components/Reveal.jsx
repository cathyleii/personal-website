import { useEffect, useRef, useState } from "react";

// Fades an element in once when it scrolls into view.
export default function Reveal({
	as: Tag = "div",
	delay = 0,
	className = "",
	children,
}) {
	const ref = useRef(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (!("IntersectionObserver" in window)) {
			setShown(true);
			return;
		}
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setShown(true);
					io.disconnect();
				}
			},
			{ threshold: 0.12 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<Tag
			ref={ref}
			className={`reveal ${shown ? "in" : ""} ${className}`.trim()}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</Tag>
	);
}
