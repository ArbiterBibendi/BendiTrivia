export type Trivia = {
  question: string;
  answer: string;
  category: string;
};
export function Card({ trivia }: { trivia: Trivia }) {
  const { question, answer, category } = trivia;
  return (
    <div className="card">
      <h3 className="category">{category}</h3>
      <h2>{question}</h2>
      <h2 className="answer">{answer}</h2>
    </div>
  );
}
