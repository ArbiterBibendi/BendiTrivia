import { Card } from "../components/card";
export default function Home() {
  return (
    <>
      <h1>BendiTrivia</h1>
      <div className="cardHolder">
        <Card 
          question={"According to Arthurian legend, what did King Arthur receive as a dowry, on his marriage to Guinevire"}
          answer={"The round table"}
          category={"General"}
        />
      </div>
    </>
  );
}
