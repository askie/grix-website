export default function PublishActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
        Publish
      </button>
      <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-slate-400">
        Archive
      </button>
    </div>
  );
}
