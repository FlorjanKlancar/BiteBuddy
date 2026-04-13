"use client";

import {
	motion,
	useInView,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";

// --- Original components (kept for backward compat) ---

export function FadeIn({
	children,
	delay = 0,
	className,
}: { children: ReactNode; delay?: number; className?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export function FadeInScale({
	children,
	delay = 0,
	className,
}: { children: ReactNode; delay?: number; className?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3, delay, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export function SlideIn({
	children,
	direction = "right",
	className,
}: { children: ReactNode; direction?: "left" | "right"; className?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, x: direction === "right" ? 20 : -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: direction === "right" ? -20 : 20 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// --- New scroll-aware components ---

const directionOffset = {
	up: { x: 0, y: 24 },
	down: { x: 0, y: -24 },
	left: { x: -24, y: 0 },
	right: { x: 24, y: 0 },
};

export function ScrollFadeIn({
	children,
	delay = 0,
	className,
	direction = "up",
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
	direction?: "up" | "down" | "left" | "right";
}) {
	const offset = directionOffset[direction];
	return (
		<motion.div
			initial={{ opacity: 0, ...offset }}
			whileInView={{ opacity: 1, x: 0, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.5, delay, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// Animated number counter — counts from 0 to `to` when in view
export function AnimatedCounter({
	to,
	duration = 2,
	suffix = "",
	prefix = "",
	className,
}: {
	to: number;
	duration?: number;
	suffix?: string;
	prefix?: string;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const motionValue = useMotionValue(0);
	const rounded = useTransform(motionValue, (v) => Math.round(v));
	const isInView = useInView(ref, { once: true, amount: 0.5 });

	useEffect(() => {
		if (isInView) {
			const controls = import("framer-motion").then(({ animate }) => {
				return animate(motionValue, to, {
					duration,
					ease: "easeOut",
				});
			});
			return () => {
				controls.then((c) => c.stop());
			};
		}
	}, [isInView, motionValue, to, duration]);

	useEffect(() => {
		const unsubscribe = rounded.on("change", (v) => {
			if (ref.current) {
				ref.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
			}
		});
		return unsubscribe;
	}, [rounded, suffix, prefix]);

	return (
		<span ref={ref} className={className}>
			{prefix}0{suffix}
		</span>
	);
}

// Stagger children container — animates children one by one on scroll
const staggerContainerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.08,
		},
	},
};

export const staggerItemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: "easeOut" as const },
	},
};

export function StaggerChildren({
	children,
	className,
}: { children: ReactNode; className?: string }) {
	return (
		<motion.div
			variants={staggerContainerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.15 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// 3D tilt card on hover — no-op on touch devices
export function TiltCard({
	children,
	className,
	intensity = 8,
}: { children: ReactNode; className?: string; intensity?: number }) {
	const ref = useRef<HTMLDivElement>(null);
	const rotateX = useMotionValue(0);
	const rotateY = useMotionValue(0);
	const smoothX = useSpring(rotateX, { stiffness: 300, damping: 20 });
	const smoothY = useSpring(rotateY, { stiffness: 300, damping: 20 });

	function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const x = (e.clientY - centerY) / (rect.height / 2);
		const y = -(e.clientX - centerX) / (rect.width / 2);
		rotateX.set(x * intensity);
		rotateY.set(y * intensity);
	}

	function handleLeave() {
		rotateX.set(0);
		rotateY.set(0);
	}

	return (
		<motion.div
			ref={ref}
			onMouseMove={handleMouse}
			onMouseLeave={handleLeave}
			style={{
				rotateX: smoothX,
				rotateY: smoothY,
				transformStyle: "preserve-3d",
				perspective: 1000,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export { motion };
