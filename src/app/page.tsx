import Link from "next/link";

const categories = [
  {
    slug: "life-hacks",
    name: "生活常识",
    description: "日常生活中的科学原理与实用知识",
    icon: "💡",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 hover:border-emerald-400/30",
  },
  {
    slug: "history",
    name: "历史",
    description: "探索古今中外的历史事件与人物",
    icon: "📜",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/20 hover:border-amber-400/30",
  },
  {
    slug: "geography",
    name: "地理",
    description: "了解世界各地的自然与人文地理",
    icon: "🌍",
    color: "from-sky-500/20 to-blue-500/10 border-sky-500/20 hover:border-sky-400/30",
  },
  {
    slug: "astronomy",
    name: "天文",
    description: "仰望星空，探索宇宙的奥秘",
    icon: "🔭",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/20 hover:border-violet-400/30",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-zinc-100 mb-3 tracking-tight">
          📚 百科问答
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
          涵盖历史、地理、天文、生活常识的交互式问答平台。
          选择题挑战你的知识，问答题拓展你的视野。
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className={`group relative rounded-xl border bg-gradient-to-br ${cat.color} p-5 transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="text-3xl mb-3">{cat.icon}</div>
            <h2 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
              {cat.name}
            </h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              {cat.description}
            </p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100">
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
