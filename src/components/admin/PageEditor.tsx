interface PageEditorProps {
  locale: string;
}

export default function PageEditor({ locale }: PageEditorProps) {
  return (
    <form className="space-y-4" aria-label="page-editor">
      <label className="block">
        <span className="mb-1 block text-sm text-slate-700">Slug</span>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" defaultValue="" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-slate-700">Title ({locale})</span>
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2" defaultValue="" />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-slate-700">Description ({locale})</span>
        <textarea className="h-28 w-full rounded-lg border border-slate-300 px-3 py-2" defaultValue="" />
      </label>

      <button type="button" className="rounded-full bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
        Save Draft
      </button>
    </form>
  );
}
