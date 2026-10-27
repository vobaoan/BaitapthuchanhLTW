export default function TaskCard({
  card,
  busy,
  onEdit,
  onDelete
}) {
  return (
    <div className="task-card">
      <strong>{card.title}</strong>

      <p style={{ whiteSpace: "pre-wrap" }}>
        {card.description}
      </p>

      <div>
        <button
          type="button"
          disabled={busy}
          onClick={() => onEdit(card)}
        >
          Sửa
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(card)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}