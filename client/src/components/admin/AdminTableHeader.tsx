//region imports
//endregion

//region interfaces
interface AdminTableHeaderProps {
  columns: string[];
}
//endregion

//region component
/**
 * Reusable table header component for admin tables
 * Provides consistent styling across all admin tables
 */
export function AdminTableHeader({ columns }: AdminTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-white/10">
        {columns.map((column) => (
          <th
            key={column}
            className="py-4 px-4 text-xs uppercase tracking-wider font-semibold text-white/40"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}
//endregion
