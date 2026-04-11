import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";

type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link
      to={`/artikel/${article.slug}`}
      className="group block overflow-hidden rounded-sm border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-harvest/30"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          width={1280}
          height={720}
        />
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-harvest px-3 py-1 font-body text-xs font-semibold text-harvest-foreground">{article.category}</span>
        </div>
      </div>
      <div className="p-6">
        <p className="mb-3 font-body text-xs text-muted-foreground">{article.date}</p>
        <h3 className="mb-2 font-heading text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-harvest">{article.title}</h3>
        <p className="font-body text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      </div>
    </Link>
  );
};

export default ArticleCard;
