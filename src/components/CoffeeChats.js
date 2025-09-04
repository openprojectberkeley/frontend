export default function CoffeeChats() {
  return (
    <main style={{minHeight:'70vh', padding:'2rem 1rem'}}>
      <h1 style={{marginBottom:'1rem'}}>Coffee Chats</h1>
      <div style={{position:'relative', width:'100%', height:'70vh', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden'}}>
        <iframe
          title="Airtable: Coffee Chats"
          src="https://airtable.com/embed/appDYKljs9im5Fdxg/shrAxF8L52pwIsawY?viewControls=on"
          style={{position:'absolute', inset:0, width:'100%', height:'100%', border:0, background:'transparent'}}
          allowFullScreen
        />
      </div>
    </main>
  );
}