interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export default function RowActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Hapus",
}: RowActionsProps) {
  return (
    <div className="row-actions">
      <button type="button" aria-label={editLabel} onClick={onEdit}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4z" />
          <path d="m14.8 5.7 3.5 3.5M4 20.8 8.3 20" />
        </svg>
      </button>
      <button type="button" aria-label={deleteLabel} onClick={onDelete}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
        </svg>
      </button>
    </div>
  );
}
