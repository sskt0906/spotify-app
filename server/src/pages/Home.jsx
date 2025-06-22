import MoodSelector from '../components/MoodSelector';

export default function Home() {
  const handleMood = (mood) => {
    console.log('選ばれたムード：', mood);
    // ここで曲の取得などの処理を行う
  };

  return (
    <div style={{ marginTop: 80, textAlign: 'center' }}>
      <h2>気分で選ぶプレイリスト</h2>
      <MoodSelector onSelect={handleMood} />
    </div>
  );
}
