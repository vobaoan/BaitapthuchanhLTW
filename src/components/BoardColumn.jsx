import TaskCard from "./TaskCard";

export default function BoardColumn({
  column,
  busy,
  onAddCard,
  onEditCard,
  onDeleteCard
}) {
  return (
    <section className="board-column">
      <h2>
        {column.title} <span>({column.cards.length})</span>
      </h2>

      {column.cards.map((card) => (
        <TaskCard
          key={card.id}
          card={card}
          busy={busy}
          onEdit={onEditCard}
          onDelete={onDeleteCard}
        />
      ))}

      <button
        type="button"
        disabled={busy}
        onClick={() => onAddCard(column.id)}
      >
        + Thêm công việc
      </button>
    </section>
  );
}