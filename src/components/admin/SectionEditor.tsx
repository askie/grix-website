const sectionTypes = ["hero", "problem", "solution", "features", "use_cases", "faq", "cta"];

export default function SectionEditor() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">Section editor placeholder. Use structured JSON data instead of HTML blobs.</p>
      <div className="flex flex-wrap gap-2">
        {sectionTypes.map((type) => (
          <span key={type} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
