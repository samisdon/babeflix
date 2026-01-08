import { useEffect, useState } from "react";

const API_KEY = "bKflKeJmgG9wu4f1UPVYpFl5IVpaMBukW5LsrlzX";
const BASE = "https://api.watchmode.com/v1";

export default function App() {
  const [titles, setTitles] = useState([]);
  const [type, setType] = useState("movie");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(
      `${BASE}/list-titles/?apiKey=${API_KEY}&types=${type}&providers=netflix&regions=IN&limit=40`
    )
      .then(res => res.json())
      .then(data => {
        const valid = data.titles?.filter(t => t.poster);
        setTitles(valid || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type]);

  function openDetails(item) {
    fetch(`${BASE}/title/${item.id}/details/?apiKey=${API_KEY}`)
      .then(res => res.json())
      .then(data => setSelected(data));
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <h1>BABEFLIX</h1>
        <div>
          <button onClick={() => setType("movie")}>Movies</button>
          <button onClick={() => setType("tv")}>Series</button>
        </div>
      </nav>

      {/* LOADING */}
      {loading && <h2 style={{ textAlign: "center" }}>Loading...</h2>}

      {/* GRID */}
      <div className="grid">
        {titles.map(item => (
          <div
            className="card"
            key={item.id}
            onClick={() => openDetails(item)}
          >
            <img src={item.poster} alt={item.title} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div className="details">
          <h2>{selected.title}</h2>
          <p>{selected.plot_overview}</p>

          <h3>Where to Watch</h3>
          <div className="providers">
            {selected.sources?.length ? (
              selected.sources.map(src => (
                <a
                  key={src.id}
                  href={src.web_url}
                  target="_blank"
                >
                  {src.name}
                </a>
              ))
            ) : (
              <p>Streaming info not available</p>
            )}
          </div>

          <button className="close" onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      )}
    </>
  );
}
