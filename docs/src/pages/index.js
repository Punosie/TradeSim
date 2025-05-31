import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className="hero__subtitle text--light">
          Fast, modular, and machine-learning-enhanced trading simulation platform.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            📘 Explore Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

function Features() {
  const FeatureList = [
    {
      title: '⚛️ React + Vite',
      description:
        'Blazing-fast frontend built with Vite and React. Styled using TailwindCSS and AG Grid for dynamic tables.',
    },
    {
      title: '🧠 Real-time ML Predictions',
      description:
        'Predict midpoint prices from live orderbook data using a trained scikit-learn model via WebSockets.',
    },
    {
      title: '🚀 FastAPI Backend',
      description:
        'Robust backend with FastAPI and `orjson` for high-speed JSON handling, powering real-time simulations and streaming.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((feature, idx) => (
            <div key={idx} className={clsx('col col--4')}>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation for the TradeSim trading simulator">
      <HomepageHeader />
      <main>
        <Features />
      </main>
    </Layout>
  );
}
