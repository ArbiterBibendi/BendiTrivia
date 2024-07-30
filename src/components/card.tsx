export function Card({question, answer, category}: {question:string, answer:string, category:string}) {
    return (
        <div className="card">
          <h3 className="category">{category}</h3>
          <h2>{question}</h2>
          <h2 className="answer">{answer}</h2>
        </div>
    )
}