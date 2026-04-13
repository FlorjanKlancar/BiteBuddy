"use client";

import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	BookOpen,
	ChevronRight,
	Clock,
	Flame,
	Search,
	Star,
} from "lucide-react";
import { useState } from "react";

interface Recipe {
	id: string;
	title: string;
	category: string;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
	prepTime: number;
	rating: number;
	image?: string;
}

const CATEGORIES = ["All", "High Protein", "Low Carb", "Quick Meals", "Vegetarian"];

const SAMPLE_RECIPES: Recipe[] = [
	{
		id: "1",
		title: "Grilled Chicken & Quinoa Bowl",
		category: "High Protein",
		calories: 520,
		protein: 42,
		carbs: 48,
		fat: 14,
		prepTime: 25,
		rating: 4.8,
	},
	{
		id: "2",
		title: "Salmon Avocado Poke",
		category: "High Protein",
		calories: 480,
		protein: 35,
		carbs: 32,
		fat: 22,
		prepTime: 15,
		rating: 4.9,
	},
	{
		id: "3",
		title: "Mediterranean Veggie Wrap",
		category: "Vegetarian",
		calories: 380,
		protein: 18,
		carbs: 42,
		fat: 16,
		prepTime: 10,
		rating: 4.6,
	},
	{
		id: "4",
		title: "Turkey Meatball Zoodles",
		category: "Low Carb",
		calories: 340,
		protein: 38,
		carbs: 12,
		fat: 16,
		prepTime: 30,
		rating: 4.7,
	},
	{
		id: "5",
		title: "Overnight Protein Oats",
		category: "Quick Meals",
		calories: 420,
		protein: 28,
		carbs: 52,
		fat: 12,
		prepTime: 5,
		rating: 4.5,
	},
	{
		id: "6",
		title: "Shrimp Stir-Fry",
		category: "Quick Meals",
		calories: 360,
		protein: 32,
		carbs: 28,
		fat: 14,
		prepTime: 20,
		rating: 4.7,
	},
];

export default function RecipesPage() {
	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");

	const filtered = SAMPLE_RECIPES.filter((r) => {
		const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
		const matchesCategory =
			activeCategory === "All" || r.category === activeCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="space-y-5">
			<FadeIn>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-foreground">Recipes</h1>
					<div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
						<BookOpen className="size-5 text-on-surface-variant" />
					</div>
				</div>
			</FadeIn>

			{/* Search */}
			<FadeIn delay={0.05}>
				<div className="relative">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
					<Input
						type="text"
						placeholder="Search recipes..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="bg-surface-container-low border-0 rounded-2xl h-12 pl-11"
					/>
				</div>
			</FadeIn>

			{/* Category tabs */}
			<FadeIn delay={0.1}>
				<div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
					{CATEGORIES.map((cat) => (
						<button
							key={cat}
							type="button"
							onClick={() => setActiveCategory(cat)}
							className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
								activeCategory === cat
									? "bg-gradient-to-br from-primary to-primary-container text-white shadow-md"
									: "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
							}`}
						>
							{cat}
						</button>
					))}
				</div>
			</FadeIn>

			{/* Recipe cards */}
			<div className="space-y-3">
				{filtered.map((recipe, i) => (
					<FadeIn key={recipe.id} delay={0.1 + i * 0.05}>
						<div className="bg-card rounded-3xl overflow-hidden shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10">
							{/* Image placeholder */}
							<div className="h-36 bg-gradient-to-br from-primary/5 to-primary-fixed/15 flex items-center justify-center">
								<div className="text-4xl">
									{recipe.category === "Vegetarian"
										? "🥗"
										: recipe.category === "Quick Meals"
											? "⚡"
											: "🍽️"}
								</div>
							</div>

							<div className="p-4">
								<div className="flex items-start justify-between mb-2">
									<h3 className="font-bold text-sm text-foreground leading-tight flex-1">
										{recipe.title}
									</h3>
									<div className="flex items-center gap-0.5 text-tertiary-container ml-2 shrink-0">
										<Star className="size-3.5 fill-current" />
										<span className="text-xs font-semibold">
											{recipe.rating}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-3 text-xs text-on-surface-variant mb-3">
									<span className="flex items-center gap-1">
										<Clock className="size-3" />
										{recipe.prepTime}m
									</span>
									<span className="flex items-center gap-1">
										<Flame className="size-3" />
										{recipe.calories} kcal
									</span>
								</div>

								{/* Macro pills */}
								<div className="flex gap-1.5">
									<span className="bg-primary/10 text-primary text-[10px] font-semibold px-2.5 py-1 rounded-full">
										P: {recipe.protein}g
									</span>
									<span className="bg-secondary/10 text-secondary text-[10px] font-semibold px-2.5 py-1 rounded-full">
										C: {recipe.carbs}g
									</span>
									<span className="bg-tertiary/10 text-tertiary text-[10px] font-semibold px-2.5 py-1 rounded-full">
										F: {recipe.fat}g
									</span>
								</div>
							</div>
						</div>
					</FadeIn>
				))}
			</div>

			{filtered.length === 0 && (
				<div className="text-center py-10">
					<p className="text-on-surface-variant">No recipes found</p>
				</div>
			)}
		</div>
	);
}
