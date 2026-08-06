import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function About() {
  const [config, setConfig] = useState(null);
  const [story, setStory] = useState(null);

  useEffect(() => {
    Promise.all([api('/api/config'), api('/api/settings')])
      .then(([cfg, settings]) => {
        setConfig(cfg);
        setStory(settings);
      })
      .catch(console.error);
  }, []);

  return (
    <section className="section page-top">
      <div className="container about-layout">
        <div className="about-visual" aria-hidden />
        <div className="about-copy">
          <p className="eyebrow">About</p>
          <h1>{story?.storyTitle || 'Radhika Khandelwal'}</h1>
          <p className="lead">
            {story?.storyBody ||
              config?.about ||
              "Hi, I'm Radhika — an artist based in India, creating original paintings and stationery that bring quiet beauty into daily life."}
          </p>
          {config?.instagram && (
            <a
              href={config.instagram}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Follow on Instagram
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
